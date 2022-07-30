cmake_minimum_required(VERSION 3.9.0)

set (PACKAGE_NAME "react-native-fast-crypto")
set (BUILD_DIR ${CMAKE_SOURCE_DIR}/build)

include_directories(
        ../cpp
        "${NODE_MODULES_DIR}/react-native/React"
        "${NODE_MODULES_DIR}/react-native/React/Base"
        "${NODE_MODULES_DIR}/react-native/ReactCommon/jsi"
)

if(${REACT_NATIVE_VERSION} LESS 66)
        set (
                INCLUDE_JSI_CPP
                "${NODE_MODULES_DIR}/react-native/ReactCommon/jsi/jsi/jsi.cpp"
        )
endif()

add_library(reactnativefastcrypto  # <-- Library name
        SHARED
        "src/main/cpp/cpp-adapter.cpp"
        "../cpp/FastCryptoHostObject.cpp"
        "../cpp/JSI Utils/TypedArray.cpp"
        ${INCLUDE_JSI_CPP} # only on older RN versions
)

set_target_properties(
        reactnativefastcrypto PROPERTIES
        CXX_STANDARD 17
        CXX_EXTENSIONS OFF
        POSITION_INDEPENDENT_CODE ON
)

file (GLOB LIBRN_DIR "${PREBUILT_DIR}/${ANDROID_ABI}")

find_library(
        log-lib
        log
)
find_library(
        REACT_NATIVE_JNI_LIB
        reactnativejni
        PATHS ${LIBRN_DIR}
        NO_CMAKE_FIND_ROOT_PATH
)
if(${REACT_NATIVE_VERSION} LESS 66)
        # JSI lib didn't exist on RN 0.65 and before. Simply omit it.
        set (JSI_LIB "")
else()
        # RN 0.66 distributes libjsi.so, can be used instead of compiling jsi.cpp manually.
        find_library(
                JSI_LIB
                jsi
                PATHS ${LIBRN_DIR}
                NO_CMAKE_FIND_ROOT_PATH
        )
endif()

#### region: add box2d
target_include_directories(
        reactnativefastcrypto
        PRIVATE

        cpp/box2d/include/
)

set (BOX2D_LIB "box2d")
link_directories(../package/libs/android/${ANDROID_ABI}/)
set (LIBS_PATH "${CMAKE_CURRENT_SOURCE_DIR}/../package/libs/android/${ANDROID_ABI}")
add_library(box2d STATIC IMPORTED)
set_property(TARGET box2d PROPERTY IMPORTED_LOCATION "${LIBS_PATH}/libbox2d.a")
### endregion


target_link_libraries(
        reactnativefastcrypto
        ${log-lib}
        ${JSI_LIB}
        ${REACT_NATIVE_JNI_LIB}
        android
        ${BOX2D_LIB}
)
