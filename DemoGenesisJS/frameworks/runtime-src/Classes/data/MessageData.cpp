//
//  MessageData.cpp
//  DemoGenesisJS
//
//  Created by hoolai on 16/10/12.
//
//

#include "MessageData.h"
MessageData::MessageData()
: _headerLength(0)
, _header(new hlgenesis::msg_header())
{
    _buff = std::shared_ptr<uint8_t>(new uint8_t[ max_buff_length ], [](uint8_t *p){
        delete[] p;
    });
}

MessageData::~MessageData()
{
    _buff = nullptr;
    _header = nullptr;
}
size_t MessageData::length()
{
    return _headerLength + _bodyLength;
}

size_t MessageData::bodyLength()
{
    return _bodyLength;
}

uint8_t * MessageData::data()
{
    return _buff.get();
}

uint8_t * MessageData::header()
{
    return _buff.get();
}

uint8_t * MessageData::body()
{
    return _buff.get() + _headerLength;
}

