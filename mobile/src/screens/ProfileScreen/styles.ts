import colors from "configs/colors";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: "center",
    marginTop: 48,
  },
  wrapperImg: {
    alignItems: "center",
    position: "relative",
  },
  wrapperPercent: {
    width: 54,
    borderWidth: 1,
    borderColor: colors.red,
    position: "absolute",
    bottom: -32,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 3,
    backgroundColor: colors.stone100,
  },
  emblem: {
    height: 60,
    width: 60,
    position: "absolute",
    bottom: -24,
  },
  post: {
    backgroundColor: colors.accent,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginTop: 12,
  },
  btn: {
    borderWidth: 0.5,
    borderRadius: 6,
    backgroundColor: colors.white,
    height: 32,
    width: 200,
    marginTop: 12,
  },
  btnGuide: {
    borderWidth: 0.5,
    borderRadius: 12,
    backgroundColor: colors.white,
    width: 200,
    marginTop: 40,
  },
  innerBtnGuide: {
    flexDirection: "column",
    alignItems: "center",
    paddingVertical: 12,
  },
});

export default styles;
