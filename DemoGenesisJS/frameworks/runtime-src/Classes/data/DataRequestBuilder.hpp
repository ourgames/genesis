//
//  DataRequestBuilder.hpp
//  DemoGenesisJS
//
//  Created by hoolai on 16/10/12.
//
//

#ifndef DataRequestBuilder_hpp
#define DataRequestBuilder_hpp

#include <stdio.h>
#include "MessageData.h"
#include "DataDefinition.h"

class DataRequestBuilder
{
public:
    static bool build(hlgenesis::RequestHeader header, std::string request, MessageData &message);
};

#endif /* DataRequestBuilder_hpp */
