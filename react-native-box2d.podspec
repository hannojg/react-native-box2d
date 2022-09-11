require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "react-native-box2d"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.homepage     = package["homepage"]
  s.license      = package["license"]
  s.authors      = package["author"]

  s.platforms    = { :ios => "11.0", :tvos => "12.0", :osx => "10.14" }
  s.source       = { :git => "https://github.com/hannojg/react-native-box2d.git", :tag => "#{s.version}" }

  s.ios.vendored_frameworks = ['package/libs/ios/libbox2d.xcframework']

  # All source files that should be publicly visible
  # Note how this does not include headers, since those can nameclash.
  s.source_files = [
    "ios/**/*.{m,mm}",
    "cpp/**/*.{cpp,h}",
    "ios/Box2dModule.h"
  ]
  # Any private headers that are not globally unique should be mentioned here.
  # Otherwise there will be a nameclash, since CocoaPods flattens out any header directories
  # See https://github.com/firebase/firebase-ios-sdk/issues/4035 for more details.
  s.preserve_paths = [
    'ios/**/*.h',
    'cpp/**/*.h'
  ]
  
  s.subspec 'Box2dHeaders' do |ss|
    ss.header_mappings_dir = 'cpp/box2d'
    ss.source_files = "cpp/box2d/**/*.{h,cpp}"
  end

  s.dependency "React-Core"
end
