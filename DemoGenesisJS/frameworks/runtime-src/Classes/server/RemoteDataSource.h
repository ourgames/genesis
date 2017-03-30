//
//  RemoteDataSource.h
//  DemoGenesisJS
//
//  Created by hoolai on 16/10/12.
//
//

#ifndef RemoteDataSource_hpp
#define RemoteDataSource_hpp

#include "CommonInclude.h"
#include "../Data/IServerStub.h"
#include "asio.hpp"
#include "MessageDataHelper.hpp"

using asio::ip::tcp;

class RemoteDataSource : public IServerStub, public std::enable_shared_from_this<RemoteDataSource>
{
public:
    RemoteDataSource(string server, string port);
    ~RemoteDataSource();
    
#pragma mark -
#pragma mark IServerStub
public:
    virtual void onRequest(const MessageData &message) override;
    virtual void onResponse(const std::string &jsonData) override;
    virtual bool start() override;
    virtual void stop() override;
    virtual void setDataReceiver(IDataReceiver * receiver) override;
    
#pragma mark -

private:
    void doConnect(tcp::resolver::iterator endpointIterator);
    void doClose();
    void doRead();
    void doWrite(const MessageData &message);
    void doWrite();
    
    IDataReceiver * _dataReceiver;
    cocos2d::Size _viewSize;
    shared_ptr<asio::io_service> _ioService;
    shared_ptr<asio::io_service::work> _work;
    tcp::socket *_socket;
    shared_ptr<void> _deletor;
    shared_ptr<MessageDataHelper> _readMessage;
    MessageQueue _writeQueue;
    
    string _server;
    string _port;
};

#endif /* RemoteDataSource_hpp */
