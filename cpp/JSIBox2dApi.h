//
// Created by Hanno Gödecke on 01.08.22.
//

#pragma once

#include "jsi/JsiHostObject.h"

#include "JSIBox2dWorld.h"

namespace Box2d {
    using namespace facebook;

    class JSIBox2dApi: public RNJsi::JsiHostObject {
    public:
        JSIBox2dApi(jsi::Runtime &runtime) {
            installFunction("b2World", JSIBox2dWorld::createCtor());
        }
    };
}
