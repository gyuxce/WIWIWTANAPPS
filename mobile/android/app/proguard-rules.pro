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

# react-native-pdf (bridge module) + its native dependencies.
# Previous rule below referenced com.shockwave.** which does not exist anywhere
# in this dependency tree -- that was the actual bug behind the "Dokumen belum
# bisa diakses" PDF failure in release builds. The real packages, verified from
# the resolved AARs in the Gradle cache, are:
#   org.wonday.pdf              -- react-native-pdf's own RN bridge
#   com.github.barteksc.pdfviewer -- AndroidPdfViewer (PDF rendering UI)
#   io.legere.pdfiumandroid      -- PDFium JNI bindings (native .so calls into
#                                    these classes by exact name/signature, so
#                                    R8 stripping/renaming breaks it silently)
-keep class org.wonday.pdf.** { *; }
-dontwarn org.wonday.pdf.**
-keep class com.github.barteksc.pdfviewer.** { *; }
-dontwarn com.github.barteksc.pdfviewer.**
-keep class io.legere.pdfiumandroid.** { *; }
-dontwarn io.legere.pdfiumandroid.**

# react-native-blob-util (used by react-native-pdf for file caching)
-keep class com.ReactNativeBlobUtil.** { *; }