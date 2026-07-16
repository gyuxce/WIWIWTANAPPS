if (__DEV__) {
  require("./ReactotronConfig");
}

import React, { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { RootSiblingParent } from "react-native-root-siblings";
import { enableScreens } from "react-native-screens";
import AppNavigator from "navigations/AppNavigator";
import { Provider } from "react-redux";
import { store, persistor } from "stores";
import { PersistGate } from "redux-persist/integration/react";
import { GlobalDebug } from "utils/GlobalDebug";
import { Settings } from "react-native-fbsdk-next";
import { SheetProvider } from "react-native-actions-sheet";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { STATUS, FB_APP_ID, FB_CLIENT_TOKEN } from '@env';

import FCMManager from "utils/FCMManager";
import ScreenUsage from "utils/ScreenUsage";

//console.log('DEBUG: which env: ' + TEST);

const App = () => {
  enableScreens(true);
  useEffect(() => {
    if (STATUS === "PRODUCTION") {
      GlobalDebug(false, true);
    }
    if (FB_APP_ID) {
      Settings.setAppID(FB_APP_ID);
    }
    if (FB_CLIENT_TOKEN) {
      Settings.setClientToken(FB_CLIENT_TOKEN);
    }

    try {
      Settings.initializeSDK();
    } catch (e) {
      console.warn("FB SDK init failed", e);
    }
  }, []);
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SheetProvider>
        <SafeAreaProvider>
          <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
              <BottomSheetModalProvider>
                <RootSiblingParent>
                  <ScreenUsage />
                  <FCMManager />
                  <AppNavigator />
                </RootSiblingParent>
              </BottomSheetModalProvider>
            </PersistGate>
          </Provider>
        </SafeAreaProvider>
      </SheetProvider>
    </GestureHandlerRootView>
  );
};

export default App;
