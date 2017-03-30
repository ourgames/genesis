//
//  LocalTestDataSource.hpp
//  DemoGenesisJS
//
//  Created by hoolai on 16/10/12.
//
//

#ifndef LocalTestDataSource_hpp
#define LocalTestDataSource_hpp

#include "../data/IServerStub.h"
#include "../data/IDataReceiver.h"

class LocalTestDataSource : public IServerStub, public Ref
{
public:
    LocalTestDataSource();
    
    void update(float delta);
    
    virtual bool start() override;
    virtual void stop() override;
    virtual void onRequest(const MessageData &message) override;
    virtual void onResponse(const std::string &data) override;
    virtual void setDataReceiver(IDataReceiver *receiver) override;
    
private:
    void req2res(const MessageData& message);
    IDataReceiver *_dataReceiver;
};

#endif /* LocalTestDataSource_hpp */
