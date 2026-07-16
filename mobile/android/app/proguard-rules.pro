-keep class com.facebook.hermes.unicode.** { *; }
-keep class com.wiwitanbaru.wiwitan.BuildConfig { *; }
-keep public class net.time4j.android.ApplicationStarter
-keep public class net.time4j.PrettyTime

# Keep RN classes
-keep class com.facebook.react.** { *; }
-keep class com.facebook.react.devsupport.** { *; }

# Keep Native Modules
-keep class com.facebook.react.bridge.** { *; }
-keepclassmembers class * {
    @com.facebook.react.bridge.ReactMethod <methods>;
}
-keepclassmembers class * {
    @com.facebook.react.uimanager.annotations.ReactProp <methods>;
}

# Keep Hermes classes
-keep class com.facebook.hermes.** { *; }
-keep class com.facebook.jni.** { *; }
-keep class com.facebook.proguard.annotations.DoNotStrip { *; }
-keep @com.facebook.proguard.annotations.DoNotStrip class *
-keep @com.facebook.proguard.annotations.DoNotStrip interface *

# Keep BuildConfig if needed
-keep class com.wiwitanbaru.wiwitan.BuildConfig { *; }
-keepclassmembers class kotlin.Metadata { *; }