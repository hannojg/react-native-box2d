//
// Created by Hanno Gödecke on 16.07.22.
//

#pragma once

#include "box2d/b2_shape.h"

#include <jsi/jsi.h>

namespace Box2d {
    using namespace facebook;

    class JSIBox2dShape : public JsiWrappingHostObject<b2Shape*> {
    public:
        /**
         * Constructor
         */
        JSIBox2dShape(b2Shape *shape)
        : JsiWrappingHostObject(std::move(shape)){}

        /**
        * Returns the underlying object from a host object of this type
        */
        static b2Shape* fromValue(jsi::Runtime &runtime,
                                                 const jsi::Value &obj) {
            return obj.asObject(runtime)
                    .asHostObject<JSIBox2dShape>(runtime)
                    ->getObject();
        }
    };
}
