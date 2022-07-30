#!/usr/bin/env bash

cd externals/box2d

rm -rf build
mkdir build
cd build

function build {
    mkdir "$1"

    cmake \
        -H.. \
        -B./$1 \
        -DANDROID_ABI=$1 \
        -DANDROID_PLATFORM=android-21 \
        -DANDROID_NDK=$NDK \
        -DCMAKE_TOOLCHAIN_FILE=$NDK/build/cmake/android.toolchain.cmake \
        -DBOX2D_BUILD_UNIT_TESTS=off \
        -DBOX2D_BUILD_TESTBED=off \
        -G Ninja
    ninja -C ./$1
}

build "arm64-v8a"
build "armeabi-v7a"
build "x86_64"
build "x86"
cd ../../..

function copy {
    mkdir -p "package/libs/android/$1/"
    cp "externals/box2d/build/$1/bin/libbox2d.a" "package/libs/android/$1/libbox2d.a"
}
copy "arm64-v8a"
copy "armeabi-v7a"
copy "x86_64"
copy "x86"

### copy header files
yarn rimraf ./cpp/box2d
mkdir -p ./cpp/box2d && 
cp -a ./externals/box2d/include/box2d ./cpp/