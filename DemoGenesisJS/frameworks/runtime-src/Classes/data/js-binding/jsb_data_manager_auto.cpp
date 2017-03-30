#include "jsb_data_manager_auto.hpp"
#include "cocos2d_specifics.hpp"
#include "DataManager.hpp"

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
JSClass *jsb_DataManager_class;
JSObject *jsb_DataManager_prototype;

bool js_jsb_data_manager_auto_DataManager_request(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    DataManager* cobj = (DataManager *)(proxy ? proxy->ptr : NULL);
    bool ok = true;
    JSB_PRECONDITION2( cobj, cx, false, "js_jsb_data_manager_auto_DataManager_request : Invalid Native Object");
    if (argc == 3) {
        std::string arg0;
        ok &= jsval_to_std_string(cx, args.get(0), &arg0);
        std::string arg1;
        ok &= jsval_to_std_string(cx, args.get(1), &arg1);
        std::function<void(int, std::string)> arg2;
        do {
            if(JS_TypeOfValue(cx, args.get(2)) == JSTYPE_FUNCTION)
            {
                JS::RootedObject jstarget(cx, args.thisv().toObjectOrNull());
                std::shared_ptr<JSFunctionWrapper> func(new JSFunctionWrapper(cx, jstarget, args.get(2)));
                auto lambda = [=](int larg0, std::string larg1) -> void {
                    JSB_AUTOCOMPARTMENT_WITH_GLOBAL_OBJCET
                    jsval largv[2];
                    largv[0] = UINT_TO_JSVAL(larg0);
                    largv[1] = std_string_to_jsval(cx, larg1);
                    JS::RootedValue rval(cx);
                    bool succeed = func->invoke(2, &largv[0], &rval);
                    if (!succeed && JS_IsExceptionPending(cx)) {
                        JS_ReportPendingException(cx);
                    }
                };
                arg2 = lambda;
            }
            else
            {
                arg2 = nullptr;
            }
        } while(0);
        JSB_PRECONDITION2(ok, cx, false, "js_jsb_data_manager_auto_DataManager_request : Error processing arguments");
        
        cobj->request(arg0, arg1, arg2);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportError(cx, "js_jsb_data_manager_auto_DataManager_request : wrong number of arguments: %d, was expecting %d", argc, 2);
    return false;
}
bool js_jsb_data_manager_auto_DataManager_connect(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    DataManager* cobj = (DataManager *)(proxy ? proxy->ptr : NULL);
    bool ok = true;
    JSB_PRECONDITION2( cobj, cx, false, "js_jsb_data_manager_auto_DataManager_connect : Invalid Native Object");
    if (argc == 3) {
        std::string arg0;
        ok &= jsval_to_std_string(cx, args.get(0), &arg0);
        std::string arg1;
        ok &= jsval_to_std_string(cx, args.get(1), &arg1);
        std::function<void(int, std::string)> arg2;
        do {
            if(JS_TypeOfValue(cx, args.get(2)) == JSTYPE_FUNCTION)
            {
                JS::RootedObject jstarget(cx, args.thisv().toObjectOrNull());
                std::shared_ptr<JSFunctionWrapper> func(new JSFunctionWrapper(cx, jstarget, args.get(2)));
                auto lambda = [=](int larg0, std::string larg1) -> void {
                    JSB_AUTOCOMPARTMENT_WITH_GLOBAL_OBJCET
                    jsval largv[2];
                    largv[0] = UINT_TO_JSVAL(larg0);
                    largv[1] = std_string_to_jsval(cx, larg1);
                    JS::RootedValue rval(cx);
                    bool succeed = func->invoke(2, &largv[0], &rval);
                    if (!succeed && JS_IsExceptionPending(cx)) {
                        JS_ReportPendingException(cx);
                    }
                };
                arg2 = lambda;
            }
            else
            {
                arg2 = nullptr;
            }
        } while(0);
        JSB_PRECONDITION2(ok, cx, false, "js_jsb_data_manager_auto_DataManager_connect : Error processing arguments");
        
        cobj->connect(arg0, arg1, arg2);
        args.rval().setUndefined();
        return true;
    }
    
    JS_ReportError(cx, "js_jsb_data_manager_auto_DataManager_connect : wrong number of arguments: %d, was expecting %d", argc, 2);
    return false;
}
bool js_jsb_data_manager_auto_DataManager_instance(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    if (argc == 0) {

        DataManager* ret = DataManager::instance();
        jsval jsret = JSVAL_NULL;
        if (ret) {
        jsret = OBJECT_TO_JSVAL(js_get_or_create_jsobject<DataManager>(cx, (DataManager*)ret));
    } else {
        jsret = JSVAL_NULL;
    };
        args.rval().set(jsret);
        return true;
    }
    JS_ReportError(cx, "js_jsb_data_manager_auto_DataManager_instance : wrong number of arguments");
    return false;
}


void js_register_jsb_data_manager_auto_DataManager(JSContext *cx, JS::HandleObject global) {
    jsb_DataManager_class = (JSClass *)calloc(1, sizeof(JSClass));
    jsb_DataManager_class->name = "DataManager";
    jsb_DataManager_class->addProperty = JS_PropertyStub;
    jsb_DataManager_class->delProperty = JS_DeletePropertyStub;
    jsb_DataManager_class->getProperty = JS_PropertyStub;
    jsb_DataManager_class->setProperty = JS_StrictPropertyStub;
    jsb_DataManager_class->enumerate = JS_EnumerateStub;
    jsb_DataManager_class->resolve = JS_ResolveStub;
    jsb_DataManager_class->convert = JS_ConvertStub;
    jsb_DataManager_class->finalize = jsb_ref_finalize;
    jsb_DataManager_class->flags = JSCLASS_HAS_RESERVED_SLOTS(2);

    static JSPropertySpec properties[] = {
        JS_PSG("__nativeObj", js_is_native_obj, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_PS_END
    };

    static JSFunctionSpec funcs[] = {
        JS_FN("request", js_jsb_data_manager_auto_DataManager_request, 3, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        // JS_FN("getType", js_jsb_data_manager_auto_DataManager_getType, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("connect", js_jsb_data_manager_auto_DataManager_connect, 3, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };

    static JSFunctionSpec st_funcs[] = {
        JS_FN("instance", js_jsb_data_manager_auto_DataManager_instance, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };

    jsb_DataManager_prototype = JS_InitClass(
        cx, global,
        JS::NullPtr(),
        jsb_DataManager_class,
        dummy_constructor<DataManager>, 0, // no constructor
        properties,
        funcs,
        NULL, // no static properties
        st_funcs);

    // add the proto and JSClass to the type->js info hash table
    JS::RootedObject proto(cx, jsb_DataManager_prototype);
    jsb_register_class<DataManager>(cx, jsb_DataManager_class, proto, JS::NullPtr());
}

void register_all_jsb_data_manager_auto(JSContext* cx, JS::HandleObject obj) {
    // Get the global ns
    JS::RootedObject ns(cx, ScriptingCore::getInstance()->getGlobalObject());

    js_register_jsb_data_manager_auto_DataManager(cx, ns);
}

