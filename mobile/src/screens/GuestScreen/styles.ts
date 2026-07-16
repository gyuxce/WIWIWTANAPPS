import colors from "configs/colors";
import { StyleSheet } from "react-native";
import { scaledHorizontal } from "utils/ScaledService";

const styles = StyleSheet.create({
  containerCardButton: {
    borderWidth: 1,
    borderRadius: 0,
    borderTopEndRadius: 12,
    borderTopStartRadius: 12,
    borderColor: colors.black,
    borderStyle: "solid",
  },
  containerCardSection: {
    marginTop: 30,
    marginHorizontal: scaledHorizontal(25),
    paddingHorizontal: -12,
  },
  imageParent: {
    height: 269,
    width: "100%",
    resizeMode: "contain",
  },
});

export default styles;
