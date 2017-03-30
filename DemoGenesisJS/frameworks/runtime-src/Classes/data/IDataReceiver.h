//
//  IDataReceiver.h
//  DemoGenesisJS
//
//  Created by hoolai on 16/10/12.
//
//

#ifndef IDataReceiver_h
#define IDataReceiver_h

#include "MessageData.h"
#include "IServerStub.h"
#include "DataDefinition.h"

class IDataReceiver
{
public:
    virtual void onData(const hlgenesis::ResponseHeader &header, const string &data) = 0;
    virtual void onDataSourceStop (IServerStub *dataSource, int code) = 0;
    virtual void onDataSourceStart(IServerStub *dataSource, int code) = 0;
};

#endif /* IDataReceiver_h */
