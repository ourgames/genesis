#include "base/ccConfig.h"
#ifndef __jsb_pseudo_manager_auto_h__
#define __jsb_pseudo_manager_auto_h__

#include "jsapi.h"
#include "jsfriendapi.h"

extern JSClass  *jsb_PseudoManager_class;
extern JSObject *jsb_PseudoManager_prototype;

bool js_jsb_pseudo_manager_auto_PseudoResponse_constructor(JSContext *cx, uint32_t argc, jsval *vp);
void js_jsb_pseudo_manager_auto_PseudoResponse_finalize(JSContext *cx, JSObject *obj);
bool js_jsb_pseudo_manager_auto_PseudoResponse_getCode(JSContext *cx, uint32_t argc, jsval *vp);
bool js_jsb_pseudo_manager_auto_PseudoResponse_setCode(JSContext *cx, uint32_t argc, jsval *vp);
bool js_jsb_pseudo_manager_auto_PseudoResponse_getContent(JSContext *cx, uint32_t argc, jsval *vp);
bool js_jsb_pseudo_manager_auto_PseudoResponse_setContent(JSContext *cx, uint32_t argc, jsval *vp);
void js_register_jsb_pseudo_manager_auto_PseudoResponse(JSContext *cx, JS::HandleObject global);

bool js_jsb_pseudo_manager_auto_PseudoManager_constructor(JSContext *cx, uint32_t argc, jsval *vp);
void js_jsb_pseudo_manager_auto_PseudoManager_finalize(JSContext *cx, JSObject *obj);
void js_register_jsb_pseudo_manager_auto_PseudoManager(JSContext *cx, JS::HandleObject global);
void register_all_jsb_pseudo_manager_auto(JSContext* cx, JS::HandleObject obj);
bool js_jsb_pseudo_manager_auto_PseudoManager_request(JSContext *cx, uint32_t argc, jsval *vp);
bool js_jsb_pseudo_manager_auto_PseudoManager_getDescription(JSContext *cx, uint32_t argc, jsval *vp);
bool js_jsb_pseudo_manager_auto_PseudoManager_instance(JSContext *cx, uint32_t argc, jsval *vp);


#endif // __jsb_pseudo_manager_auto_h__
