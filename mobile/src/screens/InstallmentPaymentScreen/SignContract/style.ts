import colors from "configs/colors";
import { StyleSheet } from "react-native";
import { scaledHorizontal } from "utils/ScaledService";

const styles = StyleSheet.create({
  docInfoWrapper: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: colors.stone50,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  docInfo: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    flex: 1,
  },
  docInfoIcon: {
    width: 24,
    height: 24,
  },
  docDownloadIcon: {
    width: 16,
    height: 16,
    marginLeft: 20,
  },
  iconUpload: {
    height: 24,
    width: 24,
    resizeMode: "contain",
    marginRight: 8,
  },
  buttonStyle: {
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
  },
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
