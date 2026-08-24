import {
  getCrashlytics,
  log as crashlyticsLog,
  recordError,
  setCrashlyticsCollectionEnabled,
  setUserId,
} from "@react-native-firebase/crashlytics";

const crashlytics = getCrashlytics();

export const initCrashReporting = () => {
  setCrashlyticsCollectionEnabled(crashlytics, true);

  const previousHandler = ErrorUtils.getGlobalHandler();
  ErrorUtils.setGlobalHandler((error, isFatal) => {
    crashlyticsLog(crashlytics, isFatal ? "Fatal JS error" : "JS error");
    recordError(crashlytics, error);
    previousHandler(error, isFatal);
  });
};

export const setCrashReportingUser = (userId?: string) => {
  setUserId(crashlytics, userId || "");
};

export const reportError = (error: unknown, context?: string) => {
  if (context) {
    crashlyticsLog(crashlytics, context);
  }
  recordError(
    crashlytics,
    error instanceof Error ? error : new Error(String(error)),
  );
};
