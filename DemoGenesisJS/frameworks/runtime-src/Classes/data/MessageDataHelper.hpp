//
//  MessageDataHelper.hpp
//  DemoGenesisJS
//
//  Created by hoolai on 16/10/12.
//
//  Encoder/Decoder for MessageData

#ifndef MessageDataHelper_hpp
#define MessageDataHelper_hpp

#include "adata.hpp"
#include "ajson.hpp"
#include "DataDefinition.h"
#include "MessageData.h"
#include "IDataReceiver.h"

class MessageDataHelper
{
public:
    template<typename T>
    static void str2obj(const std::string &str, T& obj)
    {
        auto headerLength = str.size();
        char * buff = new char[headerLength + 1];
        str.copy(buff, headerLength);
        buff[headerLength] = '\0';
        ajson::load_from_buff<T>(obj, buff);
        delete[] buff; // todo: optimize memory
    };
    
    template<typename T>
    static void obj2str(T &obj, std::string &str)
    {
        ajson::string_stream ss;
        ajson::save_to<T, ajson::string_stream>(ss, obj);
        str = ss.str();
    };

    MessageDataHelper(MessageData * messageData);
    
    template <class DataT>
    void encode(const DataT& data, uint32_t type)
    {
        adata::zero_copy_buffer stream;
        uint32_t length = adata::size_of(data);
        
        // header
        auto head = _messageData->_header;
        head->len = length;
        head->type = type;
        
        auto headerLength = adata::size_of(*head);
        _messageData->_headerLength = headerLength;
        
        CCASSERT(length + headerLength <= MessageData::max_buff_length, "buff is not long enough in MessageData::encode");
        
        stream.set_write(header(), headerLength + length);
        adata::write(stream, *head);
        _messageData->_bodyLength = length;
        
        // body
        adata::write(stream, data);
    };
    
    template <class T>
    void fakeResponse(const T&data, uint32_t type)
    {
        encode(data, type);
        this->_readLength = this->_remainDataLength = length();
    };
    
    void decode();
    void notifyReceiver(const hlgenesis::ResponseHeader &header, const std::string str);
    void setDataReceiver(IDataReceiver *);
    
    size_t length();
    size_t bodyLength();
    uint8_t * data();
    uint8_t * header();
    uint8_t * body();
    uint8_t * readPosition();
    void onRead(size_t length);

private:
    bool decodeHeader();
    bool decodeBody();

    MessageData * _messageData;
    bool _decodingBody;
    size_t _readLength;
    size_t _remainDataLength;
    IDataReceiver * _dataReceiver;
};

#ifndef json2obj__
    #define json2obj__ MessageDataHelper::str2obj
    #define obj2json__ MessageDataHelper::obj2str
#endif

#endif /* MessageDataHelper_hpp */
