//
//  MessageDataHelper.cpp
//  DemoGenesisJS
//
//  Created by hoolai on 16/10/12.
//
//

#include "MessageDataHelper.hpp"

MessageDataHelper::MessageDataHelper(MessageData * messageData) : _messageData(messageData), _decodingBody(false)
{
}

void MessageDataHelper::setDataReceiver(IDataReceiver * dataReceiver)
{
    _dataReceiver = dataReceiver;
}

uint8_t * MessageDataHelper::readPosition()
{
    return this->header() + _readLength;
}

void MessageDataHelper::onRead(size_t length)
{
    _readLength += length;
    _remainDataLength += length;
}

size_t MessageDataHelper::length()
{
    return _messageData->length();
}

size_t MessageDataHelper::bodyLength()
{
    return _messageData->bodyLength();
}

uint8_t * MessageDataHelper::data()
{
    return _messageData->data();
}

uint8_t * MessageDataHelper::header()
{
    return _messageData->header();
}

uint8_t * MessageDataHelper::body()
{
    return _messageData->body();
}

void MessageDataHelper::decode()
{
    auto buffRef = _messageData->_buff;
    auto headerRef = _messageData->_header;
    
    while(_remainDataLength > 0) {
        if (!_decodingBody) {
            if(!decodeHeader()) { return; }
        }
        else {
            if(!decodeBody()) { return; }
        }
    }
}

#define _check_server_msg_type__(x)     \
case MsgType__(s2c_test_data):          \
{                                       \
    break;                              \
}

bool MessageDataHelper::decodeHeader()
{
    adata::zero_copy_buffer stream;
    stream.set_read(header(), _readLength);
    adata::read(stream, *_messageData->_header);
    if (stream.bad()) { return false; }
    
    // todo: check header->type here in debug mode;
    switch (_messageData->_header->type) {
            _check_server_msg_type__(s2c_test_data)
        default:
            log_i__("incorrect data type in MessageDataHelper::decodeHeader(), data is ignored");
            return false;
    }

    _decodingBody = true;
    
    _messageData->_headerLength = adata::size_of(*_messageData->_header);
    _messageData->_bodyLength = _messageData->_header->len;
    _remainDataLength = _readLength - _messageData->_headerLength;
    
    log_i__("decodeHeader, header(%lu) body(%lu) remain(%lu)", _messageData->_headerLength, _messageData->_bodyLength, _remainDataLength);
    
    return true;
}

#define _decode_body_type__(x)                          \
case MsgType__(x):                                      \
{                                                       \
    hlgenesis::x data;                                  \
    adata::read(stream, data);                          \
    dataSize = adata::size_of(data);                    \
    obj2json__<hlgenesis::x>(data, responseString);     \
    break;                                              \
}

bool MessageDataHelper::decodeBody()
{
    adata::zero_copy_buffer stream;
    stream.set_read(body(), _remainDataLength);
    size_t dataSize = 0;
    hlgenesis::ResponseHeader responseHeader;
    responseHeader.type = _messageData->_header->type;
    responseHeader.id = _messageData->_header->id;
    std::string responseString;
    
    switch (_messageData->_header->type) {
            _decode_body_type__(s2c_test_data)
        default:
            log_i__("incorrect data type in MessageData::decodeBody(), data is ignored");
            return false;
    }
    if (stream.bad()) { return false; }
    //assert(dataSize == _bodyLength);
    
    _decodingBody = false;
    assert(_remainDataLength >= _messageData->_bodyLength);
    if (_remainDataLength >= _messageData->_bodyLength) {
        _remainDataLength -= _messageData->_bodyLength;
    }
    else {
        _remainDataLength = 0;
    }
    
    notifyReceiver(responseHeader, responseString);
    std::memcpy(_messageData->_buff.get(), _messageData->_buff.get() + _readLength - _remainDataLength, _remainDataLength);
    _readLength = _remainDataLength;
    
    log_i__("decodeBody, remain(%lu) responseString (%s)", _remainDataLength, responseString.c_str());
    
    return true;
}

void MessageDataHelper::notifyReceiver(const hlgenesis::ResponseHeader &header, const std::string str)
{
    _dataReceiver->onData(header, str);
}
