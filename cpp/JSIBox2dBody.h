//
// Created by Hanno Gödecke on 15.07.22.
//

#pragma once

#include <box2d/b2_body.h>

#include "JSIBox2dVec2.h"

#include <jsi/jsi.h>
#include "jsi/JsiWrappingHostObjects.h"
#include <android/log.h>

namespace Box2d {
    using namespace facebook;

// NOTE: i couldn't use this with a shared_ptr because the object has no public constructor.
class JSIBox2dBody: public RNJsi::JsiHostObject {
private:
    b2Body *_body;

public:
        /**
         * Constructor
         */
        JSIBox2dBody(b2Body *body)
            : _body(std::move(body)) {}

        JSI_HOST_FUNCTION(GetPosition) {
            return JSIBox2dVec2::toValue(runtime, _body->GetPosition());
        }
        JSI_HOST_FUNCTION(GetAngle){
            return jsi::Value((double)_body->GetAngle());
        }
//
//        JSI_HOST_FUNCTION(CreateFixture) {
//            b2Shape *shape = Utils::getShape(runtime, arguments[0]);
//            // we couldn't get a shape out of the argument, maybe its a b2FixtureDef?
//            if (shape == nullptr) {
//                if (arguments[0].isObject()) {
//                    const auto obj = arguments[0].asObject(runtime);
//                    if (obj.isHostObject<JsiB2FixtureDef>(runtime)) {
//                        this->body->CreateFixture(JsiB2FixtureDef::fromValue(runtime, arguments[0]).get());
//                        return jsi::Value::undefined();
//                    }
//                }
//
//                jsi::detail::throwJSError(runtime, "Unsupported shape type");
//                return jsi::Value::undefined();
//            }
//
//            this->body->CreateFixture(shape, arguments[1].asNumber());
//            return jsi::Value::undefined();
//        }

//        JSI_EXPORT_FUNCTIONS(JSI_EXPORT_FUNC(JSIBox2dBody, GetPosition),
//                             JSI_EXPORT_FUNC(JSIBox2dBody, CreateFixture),
//                             JSI_EXPORT_FUNC(JSIBox2dBody, GetAngle));

    };
}