import colors from "configs/colors";
import { StyleSheet } from "react-native";
import { scaledHorizontal } from "utils/ScaledService";

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: "center",
    marginTop: 48,
    marginHorizontal: scaledHorizontal(25),
  },
  btn: {
    borderWidth: 0.5,
    borderRadius: 6,
    backgroundColor: colors.white,
    height: 32,
    width: 200,
    marginTop: 12,
  },
  borderLine: {
    borderBottomWidth: 0.5,
    borderTopWidth: 0.5,
    width: "100%",
    alignItems: "center",
    paddingVertical: 16,
    marginTop: 24,
  },
});

export default styles;
