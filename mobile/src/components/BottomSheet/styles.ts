import colors from "configs/colors";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  wrapper: {
    justifyContent: "flex-end",
    margin: 0,
  },
  innerWrap: {
    minHeight: 200,
    backgroundColor: "white",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    overflow: "hidden",
    paddingTop: 12,
    paddingHorizontal: 16,
    marginTop: 20,
  },
  line: {
    backgroundColor: colors.stone400,
    height: 3,
    width: 91,
    borderRadius: 10,
    alignSelf: "center",
    marginBottom: 24,
  },
});

export default styles;
