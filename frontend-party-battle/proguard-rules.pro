# Basic ProGuard rules for React Native/Expo apps
# This file will be picked up by Expo prebuild when generating the Android project

# Keep React Native classes
-keep class com.facebook.react.** { *; }
-keep class com.facebook.hermes.** { *; }
-keep class com.facebook.jni.** { *; }

# Keep Expo modules
-keep class expo.** { *; }
-keep class org.unimodules.** { *; }

# Keep your app's package
-keep class ch.thirty_degrees.party_battle.** { *; }

# Keep native methods
-keepclasseswithmembernames class * {
    native <methods>;
}

# Keep all classes that extend React Native components
-keep class * extends com.facebook.react.ReactPackage
-keep class * extends com.facebook.react.bridge.NativeModule
-keep class * extends com.facebook.react.bridge.JavaScriptModule

# Keep annotations
-keepattributes *Annotation*
-keepattributes Exceptions
-keepattributes InnerClasses
-keepattributes Signature
-keepattributes SourceFile
-keepattributes LineNumberTable
-keepattributes EnclosingMethod

# Keep source file info for better crash reports
-keepattributes SourceFile,LineNumberTable

# Keep generic signatures
-keepattributes Signature

# Don't obfuscate public APIs
-keep public class * {
    public protected *;
}

# Don't obfuscate enum values and methods
-keepclassmembers enum * {
    public static **[] values();
    public static ** valueOf(java.lang.String);
}

# Don't optimize or obfuscate these packages
-dontoptimize
-dontshrink
-dontobfuscate
