//
//  CommonInclude.h
//  DemoGenesisJS
//
//  Created by hoolai on 16/10/12.
//
//

#ifndef CommonInclude_h
#define CommonInclude_h

#include "cocos2d.h"
#include "cocos-ext.h"
#include <iostream>
#include <limits>
#include <string>
#include <functional>
#include "util/TimeUtil.h"

using namespace std;
using namespace cocos2d;

#ifndef ASIO_STANDALONE
#define ASIO_STANDALONE
#endif //#ifndef ASIO_STANDALONE

// 日志宏
#define log_i__ CCLOG
#define log_w__ CCLOGWARN
#define log_e__ CCLOGERROR

// 数据源定义
#define DATA_LOCAL_TEST_START           0x001
#define DATA_LOCAL_TEST_END             0x010
#define DATA_LOCAL_MAX                  0x050
#define DATA_REMOTE_TEST_SERVER_START   0x100
#define DATA_REMOTE_TEST_SERVER_END     0x14F
#define DATA_REMOTE_ONLINE_SERVER_START 0x150

// 数据源切换开关
#define data_source__ DATA_LOCAL_TEST_START

#endif /* CommonInclude_h */
