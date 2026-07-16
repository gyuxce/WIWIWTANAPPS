import { StyleSheet } from "react-native";
import color from "configs/colors";

const styles = StyleSheet.create({
  container: {
    //height: 40,
    backgroundColor: color.black,
    alignItems: "center",
    borderRadius: 12,
    justifyContent: "center",
    fontWeight: "700",
  },
  wrapTitle: {
    flexDirection: "row",
    paddingHorizontal: 5,
  },
  icon: {
    // height: 15,
    // marginRight: 5,
    alignSelf: "center",
  },
  btnText: {
    fontSize: 12,
  },
});

export default styles;
