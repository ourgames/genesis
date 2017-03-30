//
//  DataRequestBuilder.cpp
//  DemoGenesisJS
//
//  Created by hoolai on 16/10/12.
//
//

#include "DataRequestBuilder.hpp"
#include "DataDefinition.h"
#include "MessageDataHelper.hpp"

#define _build_request_type__(x)                        \
        case MsgType__(x):                              \
        {                                               \
            hlgenesis::x data;                          \
            json2obj__<hlgenesis::x>(request, data);    \
            messgeHelper->encode(data, header.type);    \
            break;                                      \
        }

bool DataRequestBuilder::build(hlgenesis::RequestHeader header, std::string request, MessageData &message)
{
    auto messgeHelper = new MessageDataHelper(&message);
    switch (header.type) {
            _build_request_type__(c2s_test_data)
            _build_request_type__(s2c_test_data)
        default: return false;
    }

    return true;
}
