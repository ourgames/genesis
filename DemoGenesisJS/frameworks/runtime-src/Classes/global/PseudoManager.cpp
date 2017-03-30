//
//  PseudoManager.cpp
//  DemoGenesisJS
//
//  Created by hoolai on 16/9/28.
//
//

#include "PseudoManager.hpp"
#include "cocos2d.h"

#pragma mark -
#pragma mark class PseudoResponse

unsigned int PseudoResponse::getCode()
{
    return this->_code;
}
void PseudoResponse::setCode(unsigned int code)
{
    this->_code = code;
}
std::string PseudoResponse::getContent()
{
    return this->_content;
}
void PseudoResponse::setContent(std::string content)
{
    this->_content = content;
}

#pragma mark -
#pragma mark class PseudoManager

PseudoManager * PseudoManager::_instance = nullptr;

PseudoManager::PseudoManager() {}
PseudoManager::~PseudoManager() {}

PseudoManager * PseudoManager::instance()
{
    if(!_instance) { _instance = new PseudoManager(); }
    return _instance;
}

std::string PseudoManager::getDescription()
{
    return "PseudoManager.description";
}

void PseudoManager::request(std::string url, const responseCallback &callback)
{
    this->_requestCallback = callback;
    this->sendRequest(url);
}

void PseudoManager::sendRequest(std::string url)
{
    (void)(url);
    
    if (this->_requestCallback) {
        auto response = new PseudoResponse();
        response->setCode(200);
        response->setContent("Status OK");
        this->_requestCallback(200, response);
        
        delete response;
    }
}
