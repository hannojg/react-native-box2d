//
// Created by Hanno Gödecke on 31.07.22.
//

#pragma once

#include <box2d/b2_world.h>
#include "JSIBox2dVec2.h"
#include "JSIBox2dBodyDef.h"
#include "JSIBox2dBody.h"

#include <jsi/jsi.h>
#include "jsi/JsiHostObject.h"

namespace Box2d {
    using namespace facebook;

    class JSIBox2dWorld: public JsiWrappingSharedPtrHostObject<b2World> {
    public:
        JSI_HOST_FUNCTION(CreateBody) {
            b2Body *body = getObject()->CreateBody(JSIBox2dBodyDef::fromValue(runtime, arguments[0]).get());
            return jsi::Object::createFromHostObject(
                    runtime,
                    std::make_shared<JSIBox2dBody>(body)
            );
        }

        JSI_HOST_FUNCTION(Step) {
            getObject()->Step(
                    arguments[0].asNumber(),
                    arguments[1].asNumber(),
                    arguments[2].asNumber()
            );
            return jsi::Value::undefined();
        }

        JSI_EXPORT_FUNCTIONS(JSI_EXPORT_FUNC(JSIBox2dWorld, CreateBody),
                             JSI_EXPORT_FUNC(JSIBox2dWorld, Step))

        JSIBox2dWorld(const b2World &world):
                JsiWrappingSharedPtrHostObject<b2World>(std::make_shared<b2World>(std::move(world))) {}

        static const jsi::HostFunctionType
        createCtor() {
            return JSI_HOST_FUNCTION_LAMBDA {
                auto gravity = JSIBox2dVec2::fromValue(runtime, arguments[0]);
                b2World world = { *gravity };

                return jsi::Object::createFromHostObject(
                        runtime,
                        std::make_shared<JSIBox2dWorld>(std::move(world))
                );
            };
        };
    };
}
