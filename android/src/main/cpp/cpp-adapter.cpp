#include <jni.h>
#include <jsi/jsi.h>
#include "FastCryptoHostObject.h"
#include "JSIBox2dApi.h"

using namespace facebook;

void install(jsi::Runtime& runtime) {
    auto hostObject = std::make_shared<margelo::FastCryptoHostObject>();
    auto object = jsi::Object::createFromHostObject(runtime, hostObject);
    runtime.global().setProperty(runtime, "__FastCryptoProxy", std::move(object));

    // add box2d api
    auto box2dApi = std::make_shared<Box2d::JSIBox2dApi>(runtime);
    auto box2dApiHostObject = jsi::Object::createFromHostObject(runtime, box2dApi);
    runtime.global().setProperty(runtime, "Box2dApi", std::move(box2dApiHostObject));
}

extern "C"
JNIEXPORT void JNICALL
Java_com_reactnativefastcrypto_FastCryptoModule_nativeInstall(JNIEnv *env, jobject clazz, jlong jsiPtr) {
    auto runtime = reinterpret_cast<jsi::Runtime*>(jsiPtr);
    if (runtime) {
        install(*runtime);
    }
    // if runtime was nullptr, FastCrypto will not be installed. This should only happen while Remote Debugging (Chrome), but will be weird either way.
}
