#!/usr/bin/env bash

# Build process:
# 1. Compile a static lib for arm64 (iphone), arm64 (simulator) and x86_64 (simulator)
# 2. Build a FAT lib for the simulator comibing the two simulator libs
# 3. Create a XCFramework, which we can include in the podspec

rm -rf package/libs/ios
mkdir -p package/libs/ios
cd package/libs/ios/

function build {
    mkdir -p build
    cd build

    # We create a cmake project, using a toolchain file to compile for the different ios archs
    # using https://github.com/leetal/ios-cmake

    # Build up array of arguments...
    args=()
    args+=( 
        '-DBOX2D_BUILD_DOCS=OFF'
        '-DBOX2D_BUILD_UNIT_TESTS=OFF'
        '-DBOX2D_BUILD_TESTBED=OFF'
        '-G Xcode'
        '-DCMAKE_TOOLCHAIN_FILE=../../../../scripts/ios.toolchain.cmake'
        "-DPLATFORM=$1"
    )

    # When not setting a deployment target it will add a "EXCLUDE_ARCHS=arm64" to the build settings
    # We only want that setting to be there when building for the x86_64 simulator
    if [[ $1 != "SIMULATOR64" ]]; then
        args+=( '-DDEPLOYMENT_TARGET=11.0' )
    fi    
    args+=( '../../../../externals/box2d' )

    cmake "${args[@]}"

    cmake --build . --config Release
    mkdir -p ../bin/$2
    mv bin/Release/** ../bin/$2
    cd ..
    rm -rf build
}

build "OS64" "arm64-iphoneos"
build "SIMULATORARM64" "arm64-iphonesimulator"
build "SIMULATOR64" "x86_64-iphonesimulator"

# Building fat binary for iphone simulator:
lipo -create \
    ./bin/x86_64-iphonesimulator/libbox2d.a \
    ./bin/arm64-iphonesimulator/libbox2d.a \
    -output ./bin/libbox2d.a

# Building xcframework:
xcodebuild -create-xcframework \
 -library ./bin/libbox2d.a \
 -library ./bin/arm64-iphoneos/libbox2d.a \
 -output ./libbox2d.xcframework

rm -rf bin
cd ../../../