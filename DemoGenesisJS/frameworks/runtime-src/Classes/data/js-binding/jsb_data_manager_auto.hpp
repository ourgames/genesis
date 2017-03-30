#include "base/ccConfig.h"
#ifndef __jsb_data_manager_auto_h__
#define __jsb_data_manager_auto_h__

#include "jsapi.h"
#include "jsfriendapi.h"

extern JSClass  *jsb_DataManager_class;
extern JSObject *jsb_DataManager_prototype;

bool js_jsb_data_manager_auto_DataManager_constructor(JSContext *cx, uint32_t argc, jsval *vp);
void js_jsb_data_manager_auto_DataManager_finalize(JSContext *cx, JSObject *obj);
void js_register_jsb_data_manager_auto_DataManager(JSContext *cx, JS::HandleObject global);
void register_all_jsb_data_manager_auto(JSContext* cx, JS::HandleObject obj);
bool js_jsb_data_manager_auto_DataManager_request(JSContext *cx, uint32_t argc, jsval *vp);
bool js_jsb_data_manager_auto_DataManager_connect(JSContext *cx, uint32_t argc, jsval *vp);
bool js_jsb_data_manager_auto_DataManager_instance(JSContext *cx, uint32_t argc, jsval *vp);


#endif // __jsb_data_manager_auto_h__
