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

#include <android/log.h>

namespace Box2d {
    using namespace facebook;

    class JSIBox2dWorld : public JsiHostObject {
    private:
        b2World *world;
    public:
        JSI_HOST_FUNCTION(CreateBody) {
            b2Body *body = world->CreateBody(
                    JSIBox2dBodyDef::fromValue(runtime, arguments[0]).get());
            return jsi::Object::createFromHostObject(
                    runtime,
                    std::make_shared<JSIBox2dBody>(std::move(body))
            );
        }

        JSI_HOST_FUNCTION(Step) {
            world->Step(
                    arguments[0].asNumber(),
                    arguments[1].asNumber(),
                    arguments[2].asNumber()
            );
            return jsi::Value::undefined();
        }

        JSI_HOST_FUNCTION(DestroyBody) {
            world->DestroyBody(
                    JSIBox2dBody::fromValue(runtime, arguments[0])
            );
            return jsi::Value::undefined();
        }

        JSI_EXPORT_FUNCTIONS(JSI_EXPORT_FUNC(JSIBox2dWorld, CreateBody),
                             JSI_EXPORT_FUNC(JSIBox2dWorld, Step),
                             JSI_EXPORT_FUNC(JSIBox2dWorld, DestroyBody));

        JSIBox2dWorld(b2Vec2 *gravity) {
            this->world = new b2World(*gravity);
        }

        static const jsi::HostFunctionType
        createCtor() {
            return JSI_HOST_FUNCTION_LAMBDA {
                auto gravity = JSIBox2dVec2::fromValue(runtime, arguments[0]);

                return jsi::Object::createFromHostObject(
                        runtime,
                        std::make_shared<JSIBox2dWorld>(gravity.get())
                );
            };
        };
    };
}
