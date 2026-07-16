import { StyleSheet } from "react-native";
import { scaledHorizontal } from "utils/ScaledService";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    marginTop: 12,
    marginHorizontal: scaledHorizontal(25),
  },
  imageHeader: {
    height: 81,
    width: 102,
  },
  content: {
    alignItems: "center",
    paddingHorizontal: 10,
  },
});

export default styles;
