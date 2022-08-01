//
// Created by Hanno Gödecke on 31.07.22.
//

#pragma once

#include <box2d/b2_world.h>
#include <jsi/jsi.h>
#include "jsi/JsiHostObject.h"

namespace Box2d {
    using namespace facebook;

    class JSIBox2dWorld: public RNJsi::JsiHostObject {
    public:
        JSIBox2dWorld(const b2World &world) {

        }

        static const jsi::HostFunctionType
        createCtor() {
            return JSI_HOST_FUNCTION_LAMBDA {
//                auto gravity = JsiB2Vec2::fromValue(runtime, arguments[0]);
                b2World world = { {0, -10} };

                return jsi::Object::createFromHostObject(
                        runtime,
                        std::make_shared<JSIBox2dWorld>(std::move(world))
                );
            };
        };
    };
}
