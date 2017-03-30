//
//  ServerSelector.cpp
//  DemoGenesisJS
//
//  Created by hoolai on 16/10/12.
//
//

#include "ServerSelector.h"
#include "asio.hpp"

using asio::ip::tcp;

//string ServerSelector::__servers[] = { "123.207.118.159", "169.54.250.41", "127.0.0.1", "10.0.4.99", "10.0.4.80", "10.0.1.121" };
uint64_t ServerSelector::__timeout = 5000; //(ms)

ServerSelector::ServerSelector(ServerFoundFunction onServerFound)
{
    _onServerFound = onServerFound;
    _servers["123.207.118.159"] = { "123.207.118.159", "server_ch", 0 };
    _servers["169.54.250.41"] = { "169.54.250.41", "server_us", 0 };
}

ServerSelector::~ServerSelector()
{
}

void ServerSelector::ping()
{
    _fastestServer = "";
    _selectedServer = "";
    
    string port("9876");
    shared_ptr<asio::io_service> ioService = make_shared<asio::io_service>();
    auto work = make_shared<asio::io_service::work>(*ioService);
    auto resolver = make_shared<tcp::resolver>(*ioService);
    
    std::thread([ioService]{ ioService->run(); }).detach();
    
    for (auto& data : _servers)
    {
        try
        {
            auto sentTime = TimeUtil::getNow();
            data.second.Latency = (uint64_t)-1;
            auto server = data.second.server;
            log_i__("ping %s:%s", server.c_str(), port.c_str());
            resolver->async_resolve({ server.c_str(), port.c_str() },
                                   [this, resolver, server, ioService, sentTime, work](std::error_code ec, tcp::resolver::iterator endpointIterator)
                                   {
                                       if(!ec)
                                       {
                                           shared_ptr<tcp::socket> socket = shared_ptr<tcp::socket>(new tcp::socket(*ioService));
                                           asio::async_connect(*socket, endpointIterator,
                                                               [this, server, ioService, sentTime, socket, work](std::error_code ec, tcp::resolver::iterator)
                                                               {
                                                                   if (!ec)
                                                                   {
                                                                       auto lag = TimeUtil::getNow() - sentTime;
                                                                       this->onConnectOK(server, lag);
                                                                       try { socket->shutdown(asio::socket_base::shutdown_both); } catch(std::exception& e)
                                                                       {
                                                                           std::cerr << "Exception: " << e.what() << std::endl;
                                                                       };
                                                                   }
                                                                   else
                                                                   {
                                                                       onConnectFailed(server);
                                                                       log_e__("connect %s failed, ec=(%d) %s", server.c_str(),ec.value(), ec.message().c_str());
                                                                   }
                                                               });
                                       }
                                       else
                                       {
                                           onConnectFailed(server);
                                           log_e__("resolve %s failed, ec=(%d) %s", server.c_str(),ec.value(), ec.message().c_str());
                                       }
                                   });
        }
        catch (std::exception& e)
        {
            std::cerr << "Exception: " << e.what() << std::endl;
        }
    }
}

void ServerSelector::onServerFound()
{
    if (_onServerFound)
    {
        _onServerFound(_fastestServer);
    }
}

void ServerSelector::onConnectOK(string server, uint64_t lag)
{
    lock_guard<mutex> l(_mutex);
    _servers[server].Latency = lag;
    log_i__("response from %s in %llu ms", server.c_str(), lag);
    
    if (_fastestServer.empty()) {
        _fastestServer = server;
        onServerFound();
    }
}

void ServerSelector::onConnectFailed(string server)
{
    lock_guard<mutex> l(_mutex);
    _servers[server].Latency = -1;
}

string ServerSelector::getServer()
{
    lock_guard<mutex> l(_mutex);
    return !_selectedServer.empty() ? _selectedServer : _fastestServer;
}

void ServerSelector::setSelectServer(string server)
{
    lock_guard<mutex> l(_mutex);
    if (_servers.find(server) == _servers.end()) {
        _servers[server] = { server, server, 0 };
    }
    
    _selectedServer = server;
}

const ServerStatusMap ServerSelector::getServerStatus()
{
    lock_guard<mutex> l(_mutex);
    return _servers;
}
