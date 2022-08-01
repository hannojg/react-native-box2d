//
// Created by Hanno Gödecke on 01.08.22.
//

#pragma once

#include "jsi/JsiHostObject.h"

#include "JSIBox2dVec2.h"
#include "JSIBox2dWorld.h"
#include "JSIBox2dBodyDef.h"

namespace Box2d {
    using namespace facebook;

    class JSIBox2dApi: public RNJsi::JsiHostObject {
    public:
        JSIBox2dApi(jsi::Runtime &runtime) {
            installFunction("b2Vec2", JSIBox2dVec2::createCtor());
            installFunction("b2World", JSIBox2dWorld::createCtor());
            installFunction("b2BodyDef", JSIBox2dBodyDef::createCtor());
        }
    };
}
