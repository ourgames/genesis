//
//  IClientManager.h
//  DemoGenesisJS
//
//  Created by hoolai on 16/10/12.
//
//

#ifndef IClientManager_h
#define IClientManager_h

class NetClient;

class IClientManager
{
public:
    virtual void onClientClose(NetClient * client, int code) = 0;
};

#endif /* IClientManager_h */
