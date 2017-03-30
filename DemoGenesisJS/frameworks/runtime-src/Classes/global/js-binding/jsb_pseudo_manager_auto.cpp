#include "jsb_pseudo_manager_auto.hpp"
#include "cocos2d_specifics.hpp"
#include "PseudoManager.hpp"

template<class T>
static bool dummy_constructor(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS_ReportError(cx, "Constructor for the requested class is not available, please refer to the API reference.");
    return false;
}

static bool empty_constructor(JSContext *cx, uint32_t argc, jsval *vp) {
    return false;
}

static bool js_is_native_obj(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    args.rval().setBoolean(true);
    return true;    
}
JSClass *jsb_PseudoManager_class;
JSObject *jsb_PseudoManager_prototype;

bool js_jsb_pseudo_manager_auto_PseudoManager_request(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    PseudoManager* cobj = (PseudoManager *)(proxy ? proxy->ptr : NULL);
    bool ok = true;
    JSB_PRECONDITION2( cobj, cx, false, "js_jsb_pseudo_manager_auto_PseudoManager_request : Invalid Native Object");
    if (argc == 2) {
        std::string arg0;
        ok &= jsval_to_std_string(cx, args.get(0), &arg0);
        std::function<void(unsigned int, PseudoResponse *)> arg1;
        do {
            if(JS_TypeOfValue(cx, args.get(1)) == JSTYPE_FUNCTION)
            {
                JS::RootedObject jstarget(cx, args.thisv().toObjectOrNull());
                std::shared_ptr<JSFunctionWrapper> func(new JSFunctionWrapper(cx, jstarget, args.get(1)));
                auto lambda = [=](unsigned int larg0, PseudoResponse * larg1) -> void {
                    JSB_AUTOCOMPARTMENT_WITH_GLOBAL_OBJCET
                    jsval largv[2];
                    largv[0] = UINT_TO_JSVAL(larg0);
                    largv[1] = OBJECT_TO_JSVAL(js_get_or_create_jsobject<PseudoResponse>(cx, larg1));
                    JS::RootedValue rval(cx);
                    bool succeed = func->invoke(2, &largv[0], &rval);
                    if (!succeed && JS_IsExceptionPending(cx)) {
                        JS_ReportPendingException(cx);
                    }
                };
                arg1 = lambda;
            }
            else
            {
                arg1 = nullptr;
            }
        } while(0);
        JSB_PRECONDITION2(ok, cx, false, "js_jsb_pseudo_manager_auto_PseudoManager_request : Error processing arguments");
        
        cobj->request(arg0, arg1);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportError(cx, "js_jsb_pseudo_manager_auto_PseudoManager_request : wrong number of arguments: %d, was expecting %d", argc, 2);
    return false;
}
bool js_jsb_pseudo_manager_auto_PseudoManager_getDescription(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    PseudoManager* cobj = (PseudoManager *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_jsb_pseudo_manager_auto_PseudoManager_getDescription : Invalid Native Object");
    if (argc == 0) {
        std::string ret = cobj->getDescription();
        jsval jsret = JSVAL_NULL;
        jsret = std_string_to_jsval(cx, ret);
        args.rval().set(jsret);
        return true;
    }

    JS_ReportError(cx, "js_jsb_pseudo_manager_auto_PseudoManager_getDescription : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_jsb_pseudo_manager_auto_PseudoManager_instance(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    if (argc == 0) {

        PseudoManager* ret = PseudoManager::instance();
        jsval jsret = JSVAL_NULL;
        if (ret) {
        jsret = OBJECT_TO_JSVAL(js_get_or_create_jsobject<PseudoManager>(cx, (PseudoManager*)ret));
    } else {
        jsret = JSVAL_NULL;
    };
        args.rval().set(jsret);
        return true;
    }
    JS_ReportError(cx, "js_jsb_pseudo_manager_auto_PseudoManager_instance : wrong number of arguments");
    return false;
}


void js_register_jsb_pseudo_manager_auto_PseudoManager(JSContext *cx, JS::HandleObject global) {
    jsb_PseudoManager_class = (JSClass *)calloc(1, sizeof(JSClass));
    jsb_PseudoManager_class->name = "PseudoManager";
    jsb_PseudoManager_class->addProperty = JS_PropertyStub;
    jsb_PseudoManager_class->delProperty = JS_DeletePropertyStub;
    jsb_PseudoManager_class->getProperty = JS_PropertyStub;
    jsb_PseudoManager_class->setProperty = JS_StrictPropertyStub;
    jsb_PseudoManager_class->enumerate = JS_EnumerateStub;
    jsb_PseudoManager_class->resolve = JS_ResolveStub;
    jsb_PseudoManager_class->convert = JS_ConvertStub;
    jsb_PseudoManager_class->finalize = jsb_ref_finalize;
    jsb_PseudoManager_class->flags = JSCLASS_HAS_RESERVED_SLOTS(2);

    static JSPropertySpec properties[] = {
        JS_PSG("__nativeObj", js_is_native_obj, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_PS_END
    };

    static JSFunctionSpec funcs[] = {
        JS_FN("request", js_jsb_pseudo_manager_auto_PseudoManager_request, 2, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        // JS_FN("getType", js_jsb_pseudo_manager_auto_PseudoManager_getType, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getDescription", js_jsb_pseudo_manager_auto_PseudoManager_getDescription, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };

    static JSFunctionSpec st_funcs[] = {
        JS_FN("instance", js_jsb_pseudo_manager_auto_PseudoManager_instance, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };

    jsb_PseudoManager_prototype = JS_InitClass(
        cx, global,
        JS::NullPtr(),
        jsb_PseudoManager_class,
        dummy_constructor<PseudoManager>, 0, // no constructor
        properties,
        funcs,
        NULL, // no static properties
        st_funcs);

    // add the proto and JSClass to the type->js info hash table
    JS::RootedObject proto(cx, jsb_PseudoManager_prototype);
    jsb_register_class<PseudoManager>(cx, jsb_PseudoManager_class, proto, JS::NullPtr());
}

JSClass *jsb_PseudoResponse_class;
JSObject *jsb_PseudoResponse_prototype;

bool js_jsb_pseudo_manager_auto_PseudoResponse_getCode(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    PseudoResponse* cobj = (PseudoResponse *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_jsb_pseudo_manager_auto_PseudoResponse_getCode : Invalid Native Object");
    if (argc == 0) {
        unsigned int ret = cobj->getCode();
        jsval jsret = JSVAL_NULL;
        jsret = UINT_TO_JSVAL(ret);
        args.rval().set(jsret);
        return true;
    }
    
    JS_ReportError(cx, "js_jsb_pseudo_manager_auto_PseudoResponse_getCode : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}

bool js_jsb_pseudo_manager_auto_PseudoResponse_getContent(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    PseudoResponse* cobj = (PseudoResponse *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_jsb_pseudo_manager_auto_PseudoResponse_getContent : Invalid Native Object");
    if (argc == 0) {
        std::string ret = cobj->getContent();
        jsval jsret = JSVAL_NULL;
        jsret = std_string_to_jsval(cx, ret);
        args.rval().set(jsret);
        return true;
    }
    
    JS_ReportError(cx, "js_jsb_pseudo_manager_auto_PseudoResponse_getContent : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_jsb_pseudo_manager_auto_PseudoResponse_setCode(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    PseudoResponse* cobj = (PseudoResponse *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_jsb_pseudo_manager_auto_PseudoResponse_setCode : Invalid Native Object");
    bool ok = true;
    JSB_PRECONDITION2( cobj, cx, false, "js_jsb_pseudo_manager_auto_PseudoResponse_setCode : Invalid Native Object");
    if (argc == 1) {
        unsigned int arg0;
        ok &= jsval_to_uint(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_jsb_pseudo_manager_auto_PseudoResponse_setCode : Error processing arguments");
        
        cobj->setCode(arg0);
        args.rval().setUndefined();
    }
    
    JS_ReportError(cx, "js_jsb_pseudo_manager_auto_PseudoResponse_setCode : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_jsb_pseudo_manager_auto_PseudoResponse_setContent(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    PseudoResponse* cobj = (PseudoResponse *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_jsb_pseudo_manager_auto_PseudoResponse_setContent : Invalid Native Object");
    bool ok = true;
    JSB_PRECONDITION2( cobj, cx, false, "js_jsb_pseudo_manager_auto_PseudoResponse_setContent : Invalid Native Object");
    if (argc == 1) {
        std::string arg0;
        ok &= jsval_to_std_string(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_jsb_pseudo_manager_auto_PseudoResponse_setContent : Error processing arguments");
        
        cobj->setContent(arg0);
        args.rval().setUndefined();
    }
    
    JS_ReportError(cx, "js_jsb_pseudo_manager_auto_PseudoResponse_setContent : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
void js_register_jsb_pseudo_manager_auto_PseudoResponse(JSContext *cx, JS::HandleObject global) {
    jsb_PseudoResponse_class = (JSClass *)calloc(1, sizeof(JSClass));
    jsb_PseudoResponse_class->name = "PseudoResponse";
    jsb_PseudoResponse_class->addProperty = JS_PropertyStub;
    jsb_PseudoResponse_class->delProperty = JS_DeletePropertyStub;
    jsb_PseudoResponse_class->getProperty = JS_PropertyStub;
    jsb_PseudoResponse_class->setProperty = JS_StrictPropertyStub;
    jsb_PseudoResponse_class->enumerate = JS_EnumerateStub;
    jsb_PseudoResponse_class->resolve = JS_ResolveStub;
    jsb_PseudoResponse_class->convert = JS_ConvertStub;
    jsb_PseudoResponse_class->finalize = jsb_ref_finalize;
    jsb_PseudoResponse_class->flags = JSCLASS_HAS_RESERVED_SLOTS(2);
    
    static JSPropertySpec properties[] = {
        JS_PSG("__nativeObj", js_is_native_obj, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_PS_END
    };
    static JSFunctionSpec funcs[] = {
        JS_FN("getCode", js_jsb_pseudo_manager_auto_PseudoResponse_getCode, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getContent", js_jsb_pseudo_manager_auto_PseudoResponse_getContent, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setCode", js_jsb_pseudo_manager_auto_PseudoResponse_setCode, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setContent", js_jsb_pseudo_manager_auto_PseudoResponse_setContent, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };

    jsb_PseudoResponse_prototype = JS_InitClass(
                                               cx, global,
                                               JS::NullPtr(),
                                               jsb_PseudoResponse_class,
                                               dummy_constructor<PseudoResponse>, 0, // no constructor
                                               properties,
                                               funcs, // member functions
                                               NULL, // no static properties
                                               NULL); // no static functions
    
    // add the proto and JSClass to the type->js info hash table
    JS::RootedObject proto(cx, jsb_PseudoResponse_prototype);
    jsb_register_class<PseudoResponse>(cx, jsb_PseudoResponse_class, proto, JS::NullPtr());
}
void register_all_jsb_pseudo_manager_auto(JSContext* cx, JS::HandleObject obj) {
    // Get the global ns
    JS::RootedObject ns(cx, ScriptingCore::getInstance()->getGlobalObject());

    js_register_jsb_pseudo_manager_auto_PseudoManager(cx, ns);
    js_register_jsb_pseudo_manager_auto_PseudoResponse(cx, ns);
}

