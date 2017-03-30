//
//  MessageData.h
//  DemoGenesisJS
//
//  Created by hoolai on 16/10/12.
//
//

#ifndef MessageData_hpp
#define MessageData_hpp

#include "CommonInclude.h"
#include "DataDefinition.h"

class MessageData
{
public:
    enum { max_read_length = 2048 };
    enum { max_buff_length = 65536 };
    
    MessageData();
    ~MessageData();
    
    shared_ptr<uint8_t> _buff;
    shared_ptr<hlgenesis::msg_header> _header;
    size_t _bodyLength;
    size_t _headerLength;
    
    size_t length();
    size_t bodyLength();
    uint8_t * data();
    uint8_t * header();
    uint8_t * body();
};

typedef std::deque<MessageData> MessageQueue;

#endif /* MessageData_hpp */
