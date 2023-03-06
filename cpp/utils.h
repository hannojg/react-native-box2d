//
// Created by Hanno Gödecke on 16.07.22.
//

#pragma once

#include "box2d/b2_shape.h"
#include "JSIBox2dShape.h"
#include "JSIBox2dPolygonShape.h"
#include "JSIBox2dCircleShape.h"

namespace Box2d {
    class Utils {
    public:
        static b2Shape *getShape(jsi::Runtime &runtime, const jsi::Value &value) {
            if (value.isObject()) {
                auto obj = value.asObject(runtime);
                if (obj.isHostObject<JSIBox2dPolygonShape>(runtime)) {
                    return JSIBox2dPolygonShape::fromValue(runtime, value).get();
                }
                if (obj.isHostObject<JSIBox2dCircleShape>(runtime)) {
                    return JSIBox2dCircleShape::fromValue(runtime, value).get();
                }
            }
            return nullptr;
        }
    };
}
