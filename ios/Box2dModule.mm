#import "Box2dModule.h"

#import <React/RCTBridge+Private.h>
#import <React/RCTUtils.h>
#include <jsi/jsi.h>
#include "JSIBox2dApi.h"

@implementation Box2dModule

RCT_EXPORT_MODULE(Box2d)

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(install)
{
    NSLog(@"Installing JSI bindings for react-native-box2d...");
    RCTBridge* bridge = [RCTBridge currentBridge];
    RCTCxxBridge* cxxBridge = (RCTCxxBridge*)bridge;
    if (cxxBridge == nil) {
        return @false;
    }

    using namespace facebook;

    auto jsiRuntime = (jsi::Runtime*) cxxBridge.runtime;
    if (jsiRuntime == nil) {
        return @false;
    }
    auto& runtime = *jsiRuntime;

    // auto hostObject = std::make_shared<margelo::FastCryptoHostObject>();
    // auto object = jsi::Object::createFromHostObject(runtime, hostObject);
    // runtime.global().setProperty(runtime, "__FastCryptoProxy", std::move(object));
    auto box2dApi = std::make_shared<Box2d::JSIBox2dApi>(runtime);
    auto box2dApiHostObject = jsi::Object::createFromHostObject(runtime, box2dApi);
    runtime.global().setProperty(runtime, "Box2dApi", std::move(box2dApiHostObject));

    NSLog(@"Successfully installed JSI bindings for react-native-box2d!");
    return @true;
}

@end
