/**
 * @format
 */
console.log('✅ index.js starting');
import { AppRegistry } from "react-native";
console.log('✅ imported react-native');

// ---------------------
// 🔥 FCM Background Handler (modular API)
// ---------------------
import { getApp } from "@react-native-firebase/app";
import { 
  getMessaging,
  setBackgroundMessageHandler 
} from "@react-native-firebase/messaging";

try {
  setBackgroundMessageHandler(
    getMessaging(getApp()),
    async remoteMessage => {
      console.log("📩 Background Message:", remoteMessage);
    }
  );
  console.log("✅ FCM background handler registered");
} catch (err) {
  console.log("❌ Failed to register FCM background handler:", err);
}

let App = null;
try {
  App = require('./App').default;
  console.log('✅ App imported successfully');
} catch (err) {
  console.log('❌ Error importing App:', err);
}
import { name as appName } from "./app.json";

// ErrorUtils.setGlobalHandler((error, isFatal) => {
//   console.log('🔥 Global JS Error:', error);
//   if (isFatal) {
//     alert(`Fatal: ${error.name}\n${error.message}`);
//   }
// });

try {
  AppRegistry.registerComponent(appName, () => App);
  console.log('✅ Registered app component');
} catch (err) {
  console.log('❌ Failed to register app:', err);
}