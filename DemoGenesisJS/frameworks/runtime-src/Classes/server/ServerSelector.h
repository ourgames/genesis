//
//  ServerSelector.h
//  DemoGenesisJS
//
//  Created by hoolai on 16/10/12.
//
//

#ifndef ServerSelector_hpp
#define ServerSelector_hpp

#include "CommonInclude.h"
#include "chash_map.h"

typedef std::function<void(std::string)> ServerFoundFunction;

struct ServerStatus {
    string server;
    string name;
    uint64_t Latency;
};

typedef chash_map<string, ServerStatus> ServerStatusMap;

class ServerSelector
{
public:
    ServerSelector(ServerFoundFunction onServerFound);
    ~ServerSelector();
    
    string getServer();
    void setSelectServer(string );
    const ServerStatusMap getServerStatus();
    void ping();
    
private:
    void onServerFound();
    void onConnectOK(string server, uint64_t lag);
    void onConnectFailed(string server);
    ServerStatusMap _servers;
    string _fastestServer;
    string _selectedServer;
    std::mutex _mutex;
    ServerFoundFunction _onServerFound;
    
    static uint64_t __timeout; //(ms)
};

#endif /* ServerSelector_hpp */
