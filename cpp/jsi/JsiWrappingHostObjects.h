//
// Created by Hanno Gödecke on 01.08.22.
//

#pragma once

#include "JsiHostObject.h"

template <typename T>
class JsiWrappingHostObject : public RNJsi::JsiHostObject {
public:
    /**
     * Default constructor
     * @param context Platform context
     */
    JsiWrappingHostObject(T&& object)
            : _object(std::move(object)){}

    JsiWrappingHostObject(const T& object)
            : _object(object){}

    /**
     * Returns the underlying object exposed by this host object. This object
     * should be wrapped in a shared pointer of some kind
     * @return Underlying object
     */
    T& getObject() { return _object; }
    const T& getObject() const { return _object; }


private:
    /**
     * Wrapped object
     */
    T _object;
};

template <typename T>
class JsiWrappingSharedPtrHostObject
        : public JsiWrappingHostObject<std::shared_ptr<T>> {
public:
    JsiWrappingSharedPtrHostObject(std::shared_ptr<T> object)
            : JsiWrappingHostObject<std::shared_ptr<T>>(std::move(object)) {}
};
