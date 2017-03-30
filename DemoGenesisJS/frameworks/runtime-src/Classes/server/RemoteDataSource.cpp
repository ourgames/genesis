//
//  RemoteDataSource.cpp
//  DemoGenesisJS
//
//  Created by hoolai on 16/10/12.
//
//

#include <memory>
#include "RemoteDataSource.h"

using asio::ip::tcp;

RemoteDataSource::RemoteDataSource(string server, string port)
: _server(server)
, _readMessage(new MessageDataHelper(new MessageData()))
, _port(port)
{
}
RemoteDataSource::~RemoteDataSource()
{
    stop();
}

bool RemoteDataSource::start()
{
    try {
        if (!_ioService) {
            _ioService = shared_ptr<asio::io_service>(new asio::io_service());
        }
        
        CCASSERT(this->_dataReceiver, "_dataReceiver is nullptr in RemoteDataSource::startNetClient().");
        tcp::resolver resolver(*_ioService);
        string port = "9876";
        
        log_i__("connect to %s:%s", _server.c_str(), port.c_str());
        
        auto endpointIterator = resolver.resolve({ _server.c_str(), port.c_str() });
        
        //_netClient = make_shared<NetClient>(*_ioService, endpointIterator, _dataReceiver, this);
        _socket = new tcp::socket(*_ioService);
        _readMessage->setDataReceiver(_dataReceiver);
        _deletor = shared_ptr<void>(nullptr, [this](void *){ this->doClose(); });
        
        doConnect(endpointIterator);

        if (!_work) {
            _work = shared_ptr<asio::io_service::work>(new asio::io_service::work(*_ioService));
            std::thread([this](){ _ioService->run(); }).detach();
        }
    }
    catch (std::exception& e) {
        std::cerr << "Exception: " << e.what() << "\n";
        return false;
    }
    return true;
}

void RemoteDataSource::stop()
{
    try {
        this->_dataReceiver = nullptr;
        this->_deletor = nullptr;
        try { _socket->shutdown(asio::socket_base::shutdown_both); } catch(...) {};

        _work.reset();
        _work = nullptr;
        _ioService->stop();
    }
    catch(std::exception e)
    {
        log_e__("exception %s", e.what());
    }
}

void RemoteDataSource::setDataReceiver(IDataReceiver *receiver)
{
    this->_dataReceiver = receiver;
}

#pragma mark -
#pragma mark IServerStub

void RemoteDataSource::onRequest(const MessageData &message)
{
    this->doWrite(message);
}

void RemoteDataSource::onResponse(const std::string &jsonData)
{
    
}
#pragma mark -
#pragma mark IClientManager


void RemoteDataSource::doConnect(tcp::resolver::iterator endpointIterator)
{
    auto deletroRef = _deletor;
    asio::async_connect(*_socket, endpointIterator,
                        [this, deletroRef](std::error_code ec, tcp::resolver::iterator)
                        {
                            if (!ec)
                            {
                                _socket->set_option(tcp::no_delay(true));
                                _dataReceiver->onDataSourceStart(this, 0);
                                doRead();
                            }
                            else
                            {
                                log_e__("connect failed, ec=(%d)%s", ec.value(), ec.message().c_str());
                                _deletor = nullptr;
                            }
                        });
}

void RemoteDataSource::doClose()
{
    try { _socket->close(); } catch(...){};
    this->stop();
    _dataReceiver->onDataSourceStop(this, 0);
}
void RemoteDataSource::doRead()
{
    auto messageRef = _readMessage;
    auto deletorRef = _deletor;
    auto self = shared_from_this();
    
    _socket->async_read_some(
                            asio::buffer(_readMessage->readPosition(), MessageData::max_read_length),
                            [this, messageRef, deletorRef, self](std::error_code ec, std::size_t length)
                            {
                                if (!ec)
                                {
                                    _readMessage->onRead(length);
                                    _readMessage->decode();
                                    
                                    this->doRead();
                                }
                                else
                                {
                                    log_e__("doReadHeader() error, ec=(%d)%s", ec.value(), ec.message().c_str());
                                    try { _socket->shutdown(asio::socket_base::shutdown_both); } catch(...) {};
                                    _deletor = nullptr;
                                }
                            });
}

void RemoteDataSource::doWrite(const MessageData & data)
{
    _ioService->post([this, data]()
                    {
                        bool write_in_progress = !_writeQueue.empty();
                        _writeQueue.push_back(data);
                        if (!write_in_progress)
                        {
                            doWrite();
                        }
                    });
}

void RemoteDataSource::doWrite()
{
    auto deletorRef = _deletor;
    auto self = shared_from_this();
    
    asio::async_write(*_socket,
                      asio::buffer(_writeQueue.front().data(),
                                   _writeQueue.front().length()),
                      [this, deletorRef, self](std::error_code ec, std::size_t /*length*/)
                      {
                          if (!ec)
                          {
                              _writeQueue.pop_front();
                              if (!_writeQueue.empty())
                              {
                                  doWrite();
                              }
                          }
                          else
                          {
                              log_e__("doWrite() error, ec=(%d)%s", ec.value(), ec.message().c_str());
                              try { _socket->shutdown(asio::socket_base::shutdown_both); } catch(...) {};
                              _deletor = nullptr;
                          }
                      });
}
