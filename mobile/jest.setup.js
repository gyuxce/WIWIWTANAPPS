require("react-native-gesture-handler/jestSetup");

jest.mock("react-native-reanimated", () =>
  require("react-native-reanimated/mock"),
);

jest.mock(
  "@react-native-async-storage/async-storage",
  () => require("@react-native-async-storage/async-storage/jest/async-storage-mock"),
);

jest.mock("expo-calendar", () => ({
  AlarmMethod: { ALARM: "alarm" },
  CalendarAccessLevel: { OWNER: "owner" },
  CalendarType: { LOCAL: "local" },
  EntityTypes: { EVENT: "event" },
  requestCalendarPermissionsAsync: jest
    .fn()
    .mockResolvedValue({ status: "denied" }),
  requestRemindersPermissionsAsync: jest
    .fn()
    .mockResolvedValue({ status: "denied" }),
  getDefaultCalendarAsync: jest.fn().mockResolvedValue({ source: {} }),
  getCalendarsAsync: jest.fn().mockResolvedValue([]),
  createCalendarAsync: jest.fn().mockResolvedValue("test-calendar"),
  createEventAsync: jest.fn().mockResolvedValue("test-event"),
}));

jest.mock("react-native-fbsdk-next", () => ({
  AccessToken: {
    getCurrentAccessToken: jest.fn().mockResolvedValue(null),
  },
  LoginManager: {
    logInWithPermissions: jest.fn().mockResolvedValue({ isCancelled: true }),
  },
  Settings: {
    setAppID: jest.fn(),
    setClientToken: jest.fn(),
    initializeSDK: jest.fn(),
  },
}));

jest.mock("@react-native-google-signin/google-signin", () => ({
  GoogleSignin: {
    configure: jest.fn(),
    signOut: jest.fn().mockResolvedValue(null),
    signIn: jest.fn().mockResolvedValue(null),
    getTokens: jest.fn().mockResolvedValue({ idToken: null, accessToken: null }),
    hasPlayServices: jest.fn().mockResolvedValue(true),
  },
  statusCodes: {},
}));

jest.mock("@react-native-firebase/app", () => ({
  getApp: jest.fn().mockReturnValue({}),
}));

jest.mock("@react-native-firebase/auth", () => ({
  getAuth: jest.fn().mockReturnValue({}),
  getIdToken: jest.fn().mockResolvedValue(null),
  signInWithCredential: jest.fn().mockResolvedValue({ user: {} }),
  AppleAuthProvider: { credential: jest.fn() },
  FacebookAuthProvider: { credential: jest.fn() },
  GoogleAuthProvider: { credential: jest.fn() },
}));

jest.mock("@react-native-firebase/messaging", () => ({
  AuthorizationStatus: { AUTHORIZED: 1, PROVISIONAL: 2 },
  getMessaging: jest.fn().mockReturnValue({}),
  requestPermission: jest.fn().mockResolvedValue(0),
  getToken: jest.fn().mockResolvedValue(null),
  onMessage: jest.fn().mockReturnValue(jest.fn()),
}));

jest.mock("@invertase/react-native-apple-authentication", () => ({
  Operation: { LOGIN: "LOGIN" },
  Scope: { EMAIL: "EMAIL", FULL_NAME: "FULL_NAME" },
  performRequest: jest.fn().mockResolvedValue({}),
}));

jest.mock("react-native-webview", () => {
  const { View } = require("react-native");
  return { __esModule: true, default: View, WebView: View };
});

jest.mock("react-native-render-html", () => {
  const { View } = require("react-native");
  return { __esModule: true, default: View };
});

jest.mock("react-native-image-crop-picker", () => ({
  __esModule: true,
  default: {
    openCamera: jest.fn().mockRejectedValue(new Error("camera unavailable in Jest")),
    openPicker: jest.fn().mockRejectedValue(new Error("picker unavailable in Jest")),
  },
}));

jest.mock("expo-file-system", () => ({
  documentDirectory: "file:///tmp/",
  getInfoAsync: jest.fn().mockResolvedValue({ exists: false }),
  createDownloadResumable: jest.fn().mockReturnValue({
    downloadAsync: jest.fn().mockResolvedValue({ uri: "file:///tmp/test" }),
  }),
}));

jest.mock("expo-av", () => {
  const { View } = require("react-native");
  class Sound {
    loadAsync = jest.fn().mockResolvedValue({});
    playAsync = jest.fn().mockResolvedValue({});
    unloadAsync = jest.fn().mockResolvedValue({});
    setOnPlaybackStatusUpdate = jest.fn();
  }
  class Recording {
    prepareToRecordAsync = jest.fn().mockResolvedValue({});
    startAsync = jest.fn().mockResolvedValue({});
    stopAndUnloadAsync = jest.fn().mockResolvedValue({});
    getURI = jest.fn().mockReturnValue("file:///tmp/test-recording");
    setOnRecordingStatusUpdate = jest.fn();
  }
  const Audio = {
    Sound,
    Recording,
    RecordingOptionsPresets: { HIGH_QUALITY: {} },
    setAudioModeAsync: jest.fn().mockResolvedValue({}),
  };
  return {
    __esModule: true,
    Audio,
    Video: View,
    ResizeMode: { CONTAIN: "contain" },
  };
});

jest.mock("expo-av/build/Audio", () => ({
  Recording: class {},
  usePermissions: jest.fn(() => [
    { status: "denied" },
    jest.fn().mockResolvedValue({ status: "granted" }),
  ]),
}));

jest.mock("react-native-document-picker", () => ({
  __esModule: true,
  default: {
    types: { images: "image/*", pdf: "application/pdf" },
    pickSingle: jest.fn().mockRejectedValue(new Error("picker unavailable in Jest")),
    isCancel: jest.fn().mockReturnValue(true),
  },
}));

jest.mock("@react-native-clipboard/clipboard", () => ({
  __esModule: true,
  default: { setString: jest.fn(), getString: jest.fn().mockResolvedValue("") },
}));

jest.mock("react-native-share", () => ({
  __esModule: true,
  default: { open: jest.fn().mockResolvedValue({}) },
}));

jest.mock("react-native-device-info", () => ({
  getVersion: jest.fn().mockReturnValue("test"),
  getIpAddress: jest.fn().mockResolvedValue("127.0.0.1"),
}));

jest.mock("react-native-qrcode-svg", () => {
  const { View } = require("react-native");
  return { __esModule: true, default: View };
});

jest.mock("react-native-actions-sheet", () => {
  const React = require("react");
  return {
    SheetProvider: ({ children }) => React.createElement(React.Fragment, null, children),
  };
});

jest.mock("@gorhom/bottom-sheet", () => {
  const React = require("react");
  const { FlatList, ScrollView, View } = require("react-native");
  const Provider = ({ children }) => React.createElement(React.Fragment, null, children);
  return {
    __esModule: true,
    default: View,
    BottomSheet: View,
    BottomSheetBackdrop: View,
    BottomSheetFlatList: FlatList,
    BottomSheetModal: View,
    BottomSheetModalProvider: Provider,
    BottomSheetScrollView: ScrollView,
  };
});

jest.mock("reactotron-react-native", () => {
  const reactotron = {
    configure: jest.fn(() => reactotron),
    useReactNative: jest.fn(() => reactotron),
    use: jest.fn(() => reactotron),
    connect: jest.fn(() => reactotron),
  };
  return { __esModule: true, default: reactotron, networking: jest.fn(() => ({})) };
});
