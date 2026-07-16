import colors from "configs/colors";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  containerName: {
    height: 40,
    width: 40,
    borderWidth: 1,
    borderColor: colors.black,
    borderRadius: 40 / 2,

    alignItems: "center",
    justifyContent: "center",
    alignContent: "center",
    padding: 2,
  },
  containerImage: {
    height: 36,
    width: 36,
    borderWidth: 2,
    borderColor: colors.white,
    borderRadius: 36 / 2,

    alignItems: "center",
    justifyContent: "center",
    alignContent: "center",
  },
  imageAvatar: {
    height: 31,
    width: 31,
    resizeMode: "contain",
    borderRadius: 30 / 2,
  },
  categoryContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: colors.stone100,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 12,
  },
});

export default styles;
