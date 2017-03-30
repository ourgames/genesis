//
//  DataDefinition.h
//  DemoGenesisJS
//
//  Created by hoolai on 16/10/12.
//
//

#ifndef DataDefinition_h
#define DataDefinition_h

#include "adata.hpp"
#include "ajson.hpp"
#include "proto.adl.h"
#include "NetProtocol.h"

#define MsgType__(x) (unsigned int)(PackageType::x)

namespace hlgenesis
{
    struct RequestHeader
    {
        int type;
        int id;
    };
    struct ResponseHeader
    {
        int type;
        int id;
    };
}
AJSON(hlgenesis::RequestHeader, v.type, v.id);
AJSON(hlgenesis::ResponseHeader, v.type, v.id);
AJSON(hlgenesis::c2s_test_data, v.color, v.name, v.temp, v.weight, v.halo, v.trail);
AJSON(hlgenesis::s2c_test_data, v.code, v.message);
AJSON(hlgenesis::msg_header, v.len, v.type);

#endif /* DataDefinition_h */
