//
// Created by Hanno Gödecke on 14.07.22.
//

#pragma once

#include <box2d/b2_math.h>

#include <jsi/jsi.h>
#include "jsi/JsiWrappingHostObjects.h"

namespace Box2d {
    using namespace facebook;
    using namespace RNJsi;

class JSIBox2dVec2: public JsiWrappingSharedPtrHostObject<b2Vec2> {
    public:
        JSI_PROPERTY_GET(x) { return static_cast<double>(getObject()->x); }
        JSI_PROPERTY_GET(y) { return static_cast<double>(getObject()->y); }

        JSI_EXPORT_PROPERTY_GETTERS(JSI_EXPORT_PROP_GET(JSIBox2dVec2, x),
                                    JSI_EXPORT_PROP_GET(JSIBox2dVec2, y),
        )

        /**
         * Constructor
         */
         JSIBox2dVec2(const b2Vec2 &vec)
            : JsiWrappingSharedPtrHostObject<b2Vec2>(std::make_shared<b2Vec2>(std::move(vec))){}

         /**
         * Returns the underlying object from a host object of this type
         */
         static std::shared_ptr<b2Vec2> fromValue(jsi::Runtime &runtime,
                                                  const jsi::Value &obj) {
             return obj.asObject(runtime)
                     .asHostObject<JSIBox2dVec2>(runtime)
                     ->getObject();
         }

    /**
    * Returns the jsi object from a host object of this type
    */
    static jsi::Value toValue(jsi::Runtime &runtime,
                              const b2Vec2 &vec) {
        return jsi::Object::createFromHostObject(
                runtime, std::make_shared<JSIBox2dVec2>(vec));
    }


    static const jsi::HostFunctionType
        createCtor() {
             return JSI_HOST_FUNCTION_LAMBDA {
                 b2Vec2 vec = {
                     static_cast<float>(arguments[0].asNumber()),
                     static_cast<float>(arguments[1].asNumber())
                 };

                 return jsi::Object::createFromHostObject(
                         runtime,
                            std::make_shared<JSIBox2dVec2>(std::move(vec))
                         );
             };
         };
    };
}
