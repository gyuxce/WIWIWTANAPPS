import { StyleSheet } from "react-native";
import { scaledVertical, widthPercentage } from "utils/ScaledService";
import colors from "configs/colors";
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: scaledVertical(10),
    width: "100%",
    alignItems: "center",
  },
  containerInner: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: scaledVertical(10),
  },
  containerNumber: {
    height: widthPercentage(8),
    width: widthPercentage(8),
    backgroundColor: colors.red,
    borderColor: colors.red,
    borderRadius: widthPercentage(8) / 2,

    alignItems: "center",
    justifyContent: "center",
  },
  containerNumberDisabled: {
    height: widthPercentage(8),
    width: widthPercentage(8),
    backgroundColor: colors.stone100,
    borderRadius: widthPercentage(8) / 2,

    borderWidth: 1,
    borderColor: colors.stone300,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default styles;
