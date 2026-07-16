import { StyleSheet } from "react-native";
import { scaledHorizontal } from "utils/ScaledService";
import colors from "configs/colors";

const styles = StyleSheet.create({
  containerCheckbox: {
    marginHorizontal: scaledHorizontal(25),
    flexDirection: "row",
    gap: 5,
    alignItems: "flex-start",
    flex: 1,
  },
  buttonStyle: {
    paddingVertical: 12,
    marginHorizontal: scaledHorizontal(25),
    alignItems: "center",
  },
  imageCheckbox: {
    width: 18,
    height: 18,
    resizeMode: "cover",
  },
  containerList: {
    alignItems: "center",
    justifyContent: "center",
    gap: 15,
    paddingLeft: scaledHorizontal(15),
  },
  containerNumber: {
    alignSelf: "center",
    paddingVertical: 4,
    paddingHorizontal: 7,
    backgroundColor: colors.red,
    borderRadius: 4,
  },
});

export default styles;
