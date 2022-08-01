//
// Created by Hanno Gödecke on 14.07.22.
//

#pragma once

#include <box2d/b2_math.h>
#include <box2d/b2_body.h>

#include <jsi/jsi.h>
#include "jsi/JsiWrappingHostObjects.h"

namespace Box2d {
    using namespace facebook;

    class JSIBox2dBodyDef: public JsiWrappingSharedPtrHostObject<b2BodyDef> {
    public:
        JSI_PROPERTY_GET(position) {
            return JSIBox2dVec2::toValue(runtime, getObject()->position);
        }

        JSI_EXPORT_PROPERTY_GETTERS(JSI_EXPORT_PROP_GET(JSIBox2dBodyDef, position));

        JSI_PROPERTY_SET(position) {
            if(value.isObject() && value.asObject(runtime).isHostObject<JSIBox2dVec2>(runtime)) {
                getObject()->position = *JSIBox2dVec2::fromValue(runtime, value);
            } else {
                jsi::detail::throwJSError(runtime, "Parameter was not recognized as b2vec2.");
            }
        }
        JSI_PROPERTY_SET(type) {
            auto typeNum = value.asNumber();
            if (typeNum == 0) {
                getObject()->type = b2_staticBody;
            } else if (typeNum == 1) {
                getObject()->type = b2_kinematicBody;
            } else if (typeNum == 2) {
                getObject()->type = b2_dynamicBody;
            } else {
                jsi::detail::throwJSError(runtime, "Only type 0 (static), 1 (kinematic), 2 (dynamic) are supported");
            }
        }

        JSI_EXPORT_PROPERTY_SETTERS(JSI_EXPORT_PROP_SET(JSIBox2dBodyDef, position),
                                    JSI_EXPORT_PROP_SET(JSIBox2dBodyDef, type),
        );

        /**
         * Constructor
         */
        JSIBox2dBodyDef(const b2BodyDef &bodyDef)
                : JsiWrappingSharedPtrHostObject<b2BodyDef>(
                std::make_shared<b2BodyDef>(std::move(bodyDef))){}

        /**
        * Returns the underlying object from a host object of this type
        */
        static std::shared_ptr<b2BodyDef> fromValue(jsi::Runtime &runtime,
                                                  const jsi::Value &obj) {
            return obj.asObject(runtime)
                    .asHostObject<JSIBox2dBodyDef>(runtime)
                    ->getObject();
        }

        static const jsi::HostFunctionType
        createCtor() {
            return JSI_HOST_FUNCTION_LAMBDA {
                    b2BodyDef bodyDef;

                    return jsi::Object::createFromHostObject(
                    runtime,
                    std::make_shared<JSIBox2dBodyDef>(
                            std::move(bodyDef))
                        );
            };
        };
    };
}
