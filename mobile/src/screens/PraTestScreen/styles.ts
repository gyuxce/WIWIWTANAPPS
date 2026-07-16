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
  iconDownload: {
    height: 20,
    width: 20,
    resizeMode: "contain",
    marginRight: 8,
  },
  buttonDownload: {
    fontWeight: "900",
    fontSize: 12,
    alignSelf: "center",
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
});

export default styles;
