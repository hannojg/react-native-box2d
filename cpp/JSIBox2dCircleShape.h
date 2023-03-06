//
// Created by Tomek Zawadzki on 26.02.23.
//

#pragma once

#include "box2d/b2_circle_shape.h"

namespace Box2d {
    using namespace facebook;

    class JSIBox2dCircleShape : public JsiWrappingSharedPtrHostObject<b2CircleShape> {
    public:

        JSI_HOST_FUNCTION(SetRadius) {
            getObject()->m_radius = arguments[0].asNumber();
            return jsi::Value::undefined();
        }

        JSI_EXPORT_FUNCTIONS(JSI_EXPORT_FUNC(JSIBox2dCircleShape, SetRadius))

        /**
         * Constructor
         */
        JSIBox2dCircleShape(const b2CircleShape &shape)
                : JsiWrappingSharedPtrHostObject<b2CircleShape>(
                std::make_shared<b2CircleShape>(std::move(shape))) {}

        /**
        * Returns the underlying object from a host object of this type
        */
        static std::shared_ptr<b2CircleShape> fromValue(jsi::Runtime &runtime,
                                                         const jsi::Value &obj) {
            return obj.asObject(runtime)
                    .asHostObject<JSIBox2dCircleShape>(runtime)
                    ->getObject();
        }

        static const jsi::HostFunctionType
        createCtor() {
            return JSI_HOST_FUNCTION_LAMBDA {
                b2CircleShape shape;

                return jsi::Object::createFromHostObject(
                        runtime,
                        std::make_shared<JSIBox2dCircleShape>(
                                std::move(shape)
                        )
                );
            };
        };
    };
}
