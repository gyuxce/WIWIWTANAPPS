import { StyleSheet } from "react-native";
const styles = StyleSheet.create({
  buttonStyles: {
    paddingVertical: 12,
    width: "60%",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    paddingHorizontal: 6,
    alignSelf: "center",
    marginTop: 20,
  },
  iconStyles: {
    height: 16,
    width: 16,
    resizeMode: "contain",
    alignSelf: "flex-end",
  },
  innerStyle: {
    justifyContent: "space-between",
    flex: 1,
    width: "100%",
  },
});

export default styles;
