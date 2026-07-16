import { StyleSheet } from "react-native";
import { scaledHorizontal } from "utils/ScaledService";

const styles = StyleSheet.create({
  containerCheckbox: {
    marginHorizontal: scaledHorizontal(25),
    flexDirection: "row",
    gap: 5,
    alignItems: "flex-start",
    flex: 1,
  },
  imageCheckbox: {
    width: 18,
    height: 18,
    resizeMode: "cover",
  },
});

export default styles;
