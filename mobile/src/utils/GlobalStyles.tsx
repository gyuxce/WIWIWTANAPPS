/* eslint-disable react-hooks/rules-of-hooks */
import colors from "configs/colors";
import { StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const globalStyles = (backgroundColor?: string) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: backgroundColor || colors.stone100,
    },
    bottomSafeArea: {
      flex: 1,
      backgroundColor: backgroundColor || colors.stone100,
    },
    topSafeArea: {
      flex: 1,
      backgroundColor: backgroundColor || colors.stone100,
      paddingTop: useSafeAreaInsets().top,
    },
    topSafeAreaNoflex: {
      backgroundColor: backgroundColor || colors.stone100,
      paddingTop: useSafeAreaInsets().top,
    },
    //  Font
  });
};

export default globalStyles;
