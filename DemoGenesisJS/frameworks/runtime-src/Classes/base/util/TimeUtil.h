//
//  TimeUtil.h
//  DemoGenesisJS
//
//  Created by hoolai on 16/10/12.
//
//

#ifndef TimeUtil_h
#define TimeUtil_h

class TimeUtil
{
public:
    static inline uint64_t getNow()
    {
        return std::chrono::duration_cast<std::chrono::milliseconds>(std::chrono::system_clock::now().time_since_epoch()).count();
    }
};
#endif /* TimeUtil_h */
