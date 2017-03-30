//
//  DataManager.cpp
//  DemoGenesisJS
//
//  Created by hoolai on 16/10/12.
//
//

#include "DataManager.hpp"
#include "ajson.hpp"
#include "MessageDataHelper.hpp"
#include "DataRequestBuilder.hpp"

#if DATA_LOCAL_MAX >= data_source__
#include "../test/LocalTestDataSource.hpp"
#else
#include "../server/RemoteDataSource.h"
#endif

DataManager * DataManager::_instance = nullptr;

DataManager::DataManager() : _requestId(0)
{
    Director::getInstance()->getScheduler()->scheduleUpdate(this, 0, false);
}

DataManager::~DataManager()
{
    Director::getInstance()->getScheduler()->unscheduleUpdate(this);
}

DataManager * DataManager::instance()
{
    if(!_instance) { _instance = new DataManager(); }
    return _instance;
}

// IDataReceiver
void DataManager::onData(const hlgenesis::ResponseHeader &header, const string& data)
{
    auto it = this->_callbacksInProgress.find(header.id);
    if (it == this->_callbacksInProgress.end()) { return; }
    
    lock_guard<mutex> lg(_mutex);

    this->_callbacksDone[it->first] = { it->second, header, data };
    this->_callbacksInProgress.erase(it);
    //it->second(header.type, data);
}
void DataManager::onDataSourceStop (IServerStub *dataSource, int code)
{
}
void DataManager::onDataSourceStart(IServerStub *dataSource, int code)
{
    
}

void DataManager::update(float delta)
{
    lock_guard<mutex> lg(_mutex);
    
    for (auto& item : this->_callbacksDone) {
        auto entry = item.second;
        entry.callback(entry.header.type, entry.data);
    }
    this->_callbacksDone.clear();
}


void DataManager::connect(string ip, string port, ConnectCallback callback)
{
#if DATA_LOCAL_MAX >= data_source__
    _server = std::make_shared<LocalTestDataSource>();
#else
    _server = std::make_shared<RemoteDataSource>(ip, port);
#endif
    
    _server->setDataReceiver(this);
    
    log_i__("data_source__ is [%d]", data_source__);
    _server->start();
    
    callback(1, "OK");
}

bool DataManager::request(std::string stringHeader, std::string request, DataCallback callback)
{
    // deserialize header
    hlgenesis::RequestHeader header;
    json2obj__<hlgenesis::RequestHeader>(stringHeader, header);
    
    // build request message
    MessageData message;
    auto requestId = ++this->_requestId;
    message._header->id = requestId;
    if(!DataRequestBuilder::build(header, request, message)) {
        log_e__("can't build request with header (%s) and request (%s)", stringHeader.c_str(), request.c_str());
        
        return false;
    }
    
    _mutex.lock();
    this->_callbacksInProgress[requestId] = callback;
    _mutex.unlock();
    
    _server->onRequest(message);
    
    return true;
}
