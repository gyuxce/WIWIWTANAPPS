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
  post: {
    backgroundColor: colors.white,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginTop: 12,
  },
});

export default styles;
