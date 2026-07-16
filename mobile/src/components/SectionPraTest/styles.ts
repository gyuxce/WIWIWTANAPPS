import { StyleSheet } from "react-native";
import { scaledHorizontal } from "utils/ScaledService";
const styles = StyleSheet.create({
  containerText: {
    flex: 1,
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingBottom: scaledHorizontal(8),
  },
  buttonStyles: {
    paddingVertical: 12,
    width: "65%",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    paddingHorizontal: 6,
  },
  iconStyles: {
    height: 16,
    width: 16,
    resizeMode: "contain",
    alignSelf: "flex-end",
  },
  innerStyle: {
    justifyContent: "space-between",
    flex: 1,
    width: "100%",
  },
});

export default styles;
