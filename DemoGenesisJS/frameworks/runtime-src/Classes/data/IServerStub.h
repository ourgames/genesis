//
//  IServerStub.h
//  DemoGenesisJS
//
//  Created by hoolai on 16/10/12.
//
//

#ifndef IServerStub_h
#define IServerStub_h

#include "MessageData.h"

class IDataReceiver;
class IServerStub
{
public:
    virtual bool start() = 0;
    virtual void stop() = 0;
    virtual void onRequest(const MessageData &) = 0;
    virtual void onResponse(const std::string &) = 0;
    virtual void setDataReceiver(IDataReceiver * receiver) = 0;
    
    virtual ~IServerStub() {};
};

#endif /* IServerStub_h */
