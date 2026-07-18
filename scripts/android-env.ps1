$AndroidSdk = Join-Path $env:LOCALAPPDATA "Android\Sdk"
$AndroidStudioJbrCandidates = @(
    "D:\Android SDK\jbr",
    "C:\Program Files\Android\Android Studio\jbr",
    "C:\Program Files\Android\Android Studio\jre",
    "C:\Program Files\Android\Android Studio\plugins\android\jbr"
)

if (!(Test-Path $AndroidSdk)) {
    throw "Android SDK not found at $AndroidSdk. Open Android Studio and finish the first-run setup first."
}

$env:ANDROID_HOME = $AndroidSdk
$env:ANDROID_SDK_ROOT = $AndroidSdk

$SdkPathEntries = @(
    (Join-Path $AndroidSdk "platform-tools"),
    (Join-Path $AndroidSdk "emulator"),
    (Join-Path $AndroidSdk "cmdline-tools\latest\bin")
) | Where-Object { Test-Path $_ }

$JavaHome = $AndroidStudioJbrCandidates | Where-Object { Test-Path (Join-Path $_ "bin\java.exe") } | Select-Object -First 1
if ($JavaHome) {
    $env:JAVA_HOME = $JavaHome
    $SdkPathEntries = @((Join-Path $JavaHome "bin")) + $SdkPathEntries
} else {
    Write-Warning "Android Studio JDK was not found. If Gradle fails, set JAVA_HOME manually to Android Studio's bundled JDK."
}

$env:PATH = (($SdkPathEntries + $env:PATH) -join ";")

Write-Host "Loaded Android environment"
Write-Host "ANDROID_HOME: $env:ANDROID_HOME"
if ($env:JAVA_HOME) {
    Write-Host "JAVA_HOME:    $env:JAVA_HOME"
}

$Adb = Join-Path $AndroidSdk "platform-tools\adb.exe"
if (Test-Path $Adb) {
    & $Adb version | Select-Object -First 1
}
