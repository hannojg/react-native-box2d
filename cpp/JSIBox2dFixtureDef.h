//
// Created by Hanno Gödecke on 14.07.22.
//

#pragma once

#include "box2d/b2_math.h"
#include "box2d/b2_fixture.h"

#include <jsi/jsi.h>
#include "utils.h"

namespace Box2d {
    using namespace facebook;

    class JSIBox2dFixtureDef : public JsiWrappingSharedPtrHostObject<b2FixtureDef> {
    public:
        JSI_PROPERTY_SET(shape) {
            getObject()->shape = Utils::getShape(runtime, value);
        }

        JSI_PROPERTY_SET(density) {
            getObject()->density = value.asNumber();
        }

        JSI_PROPERTY_SET(friction) {
            getObject()->friction = value.asNumber();
        }

        JSI_EXPORT_PROPERTY_SETTERS(
                JSI_EXPORT_PROP_SET(JSIBox2dFixtureDef, shape),
                JSI_EXPORT_PROP_SET(JSIBox2dFixtureDef, density),
                JSI_EXPORT_PROP_SET(JSIBox2dFixtureDef, friction))

        /**
         * Constructor
         */
        JSIBox2dFixtureDef(const b2FixtureDef &bodyDef)
                : JsiWrappingSharedPtrHostObject<b2FixtureDef>(
                std::make_shared<b2FixtureDef>(std::move(bodyDef))) {}

        /**
        * Returns the underlying object from a host object of this type
        */
        static std::shared_ptr<b2FixtureDef> fromValue(jsi::Runtime &runtime,
                                                       const jsi::Value &obj) {
            return obj.asObject(runtime)
                    .asHostObject<JSIBox2dFixtureDef>(runtime)
                    ->getObject();
        }

        static const jsi::HostFunctionType
        createCtor() {
            return JSI_HOST_FUNCTION_LAMBDA {
                b2FixtureDef bodyDef;

                return jsi::Object::createFromHostObject(
                        runtime,
                        std::make_shared<JSIBox2dFixtureDef>(
                                std::move(bodyDef))
                );
            };
        };
    };
}
