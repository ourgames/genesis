//
//  LocalTestDataSource.cpp
//  DemoGenesisJS
//
//  Created by hoolai on 16/10/12.
//
//

#include "LocalTestDataSource.hpp"
#include "DataDefinition.h"
#include "../data/MessageDataHelper.hpp"

LocalTestDataSource::LocalTestDataSource()
{
    
}

bool LocalTestDataSource::start()
{
    //Director::getInstance()->getScheduler()->scheduleUpdate(this, 0, false);
    return true;
}
void LocalTestDataSource::stop()
{
    //Director::getInstance()->getScheduler()->unscheduleUpdate(this);
}
void LocalTestDataSource::onRequest(const MessageData & message)
{
    std::thread([this, message](){ req2res(message); }).detach();
}

void LocalTestDataSource::onResponse(const std::string & data)
{
    
}
void LocalTestDataSource::setDataReceiver(IDataReceiver * receiver)
{
    _dataReceiver = receiver;
}

void LocalTestDataSource::update(float delta)
{
    
}

void LocalTestDataSource::req2res(const MessageData& message)
{
    if (!_dataReceiver) { return; }
    
    switch(message._header->type) {
        case MsgType__(c2s_test_data):
        {
            hlgenesis::s2c_test_data data;
            data.code = 200;
            data.message = "status ok.";
            
            auto msg = new MessageData();
            msg->_header->id = message._header->id;
            auto msgHelper = new MessageDataHelper(msg);
            msgHelper->fakeResponse(data, MsgType__(s2c_test_data));
            msgHelper->setDataReceiver(_dataReceiver);
            msgHelper->decode();
            break;
        }
        default: break;
    }
}

