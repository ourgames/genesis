//
//  DataManager.hpp
//  DemoGenesisJS
//
//  Created by hoolai on 16/10/12.
//
//

#ifndef DataManager_hpp
#define DataManager_hpp

#include "CommonInclude.h"
#include "chash_map.h"
#include "IDataReceiver.h"
#include "IServerStub.h"
#include <mutex>

typedef std::function<void(int, std::string)> ConnectCallback;
typedef std::function<void(int, std::string)> DataCallback;

class DataManager : public IDataReceiver
{
public:
    static DataManager *instance();
    
// ----remote---------------------
    void connect(string ip, string port, ConnectCallback callback);
    bool request(std::string header, std::string request, DataCallback callback);
    void onResponse(const hlgenesis::ResponseHeader &header, std::string response);
    void update(float delta);
    std::mutex _mutex;
    
    // IDataReceiver
    virtual void onData(const hlgenesis::ResponseHeader &header, const string &data) override;
    virtual void onDataSourceStop (IServerStub *dataSource, int code) override;
    virtual void onDataSourceStart(IServerStub *dataSource, int code) override;

private:
    chash_map<unsigned int, DataCallback> _callbacksInProgress;
    struct responseEntry{
        DataCallback callback;
        hlgenesis::ResponseHeader header;
        string data;
    };
    chash_map<unsigned int, responseEntry> _callbacksDone;
    shared_ptr<IServerStub> _server;
    unsigned int _requestId;
    
// ----local---------------------
public:
private:
    
// singleton
private:
    DataManager();
    ~DataManager();
    static DataManager * _instance;
};

#endif /* DataManager_hpp */
