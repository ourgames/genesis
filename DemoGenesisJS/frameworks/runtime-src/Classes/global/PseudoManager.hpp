//
//  PseudoManager.hpp
//  DemoGenesisJS
//
//  Created by hoolai on 16/9/28.
//
//

#ifndef PseudoManager_hpp
#define PseudoManager_hpp

#include <string>
#include <functional>
#include "cocos2d.h"

class PseudoResponse// : public cocos2d::Ref
{
public:
    unsigned int getCode();
    void setCode(unsigned int code);
    std::string getContent();
    void setContent(std::string content);
    
private:
    unsigned int _code;
    std::string _content;
};

typedef std::function<void(unsigned int, PseudoResponse *)> responseCallback;

class PseudoManager
{
public:
    static PseudoManager * instance();
    std::string getDescription();
    void request(std::string url, const responseCallback& callback);
    
private:
    void sendRequest(std::string url);
    responseCallback _requestCallback;
    
    PseudoManager();
    ~PseudoManager();
    
    static PseudoManager * _instance;
};

#endif /* PseudoManager_hpp */
