import colors from "configs/colors";
import { StyleSheet } from "react-native";
import { scaledHorizontal } from "utils/ScaledService";
const styles = StyleSheet.create({
  card: {
    marginHorizontal: scaledHorizontal(25),
    marginTop: 12,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  categoryContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: colors.stone100,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 12,
  },
  containerName: {
    flexDirection: "row",
    alignItems: "center",
    gap: 13,
  },
});

export default styles;
