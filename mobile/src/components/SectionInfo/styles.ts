import colors from "configs/colors";
import { StyleSheet } from "react-native";
const styles = StyleSheet.create({
  containerNumber: {
    alignSelf: "center",
    paddingVertical: 4,
    paddingHorizontal: 7,
    backgroundColor: colors.red,
    borderRadius: 4,
  },
  containerText: {
    flexDirection: "row",
    gap: 4,
    alignItems: "flex-start",
    marginBottom: 3,
    flex: 1,

    paddingLeft: 6,
  },
});

export default styles;
