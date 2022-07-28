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

#### region: add box2d to build
## TODO: when shipping this as lib, i need to fix this. One cheap possibility would be
##       to copy over the box2d dir and literally ship it with the code.
## https://developer.android.com/static/studio/projects/configure-cmake#include-other-cmake-projects
## Sets lib_src_DIR to the path of the target CMake project.
#set( lib_src_DIR ../externals/box2d/src )
#
## Sets lib_build_DIR to the path of the desired output directory.
#set( lib_build_DIR ../externals/box2d/build )
#file(MAKE_DIRECTORY ${lib_build_DIR})
#
## Adds the CMakeLists.txt file located in the specified directory
## as a build dependency.
#add_subdirectory( # Specifies the directory of the CMakeLists.txt file.
#        ${lib_src_DIR}
#
#        # Specifies the directory for the build outputs.
#        ${lib_build_DIR} )
#
## Adds the output of the additional CMake build as a prebuilt static
## library and names it libbox2d.
#add_library( libbox2d STATIC IMPORTED )
#set_target_properties( libbox2d PROPERTIES IMPORTED_LOCATION
#        ${lib_build_DIR}/${ANDROID_ABI}/libbox2d.a )
#include_directories( ${lib_src_DIR}/include )
#### endregion

if (CMAKE_VERSION VERSION_LESS 3.2)
        set(UPDATE_DISCONNECTED_IF_AVAILABLE "")
else()
        set(UPDATE_DISCONNECTED_IF_AVAILABLE "UPDATE_DISCONNECTED 1")
endif()

include(../scripts/DownloadProject.cmake)
download_project(PROJ       box2d
        GIT_REPOSITORY      https://github.com/hannojg/box2d.git
        GIT_TAG             main
        ${UPDATE_DISCONNECTED_IF_AVAILABLE}
        # TODO: make this work and use original repo
        CMAKE_ARGS          -DBOX2D_BUILD_TESTBED=OFF
        )

add_subdirectory(${box2d_SOURCE_DIR} ${box2d_BINARY_DIR})
include_directories("${box2d_SOURCE_DIR}/include")


target_link_libraries(
        reactnativefastcrypto
        ${log-lib}
        ${JSI_LIB}
        ${REACT_NATIVE_JNI_LIB}
        android
        box2d
)
