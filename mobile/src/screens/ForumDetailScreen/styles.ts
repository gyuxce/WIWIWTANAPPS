import colors from "configs/colors";
import { StyleSheet } from "react-native";
import { scaledHorizontal, scaledVertical } from "utils/ScaledService";
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: scaledHorizontal(25),
    marginTop: scaledVertical(10),
    width: "100%",
    alignItems: "center",
    paddingBottom: scaledVertical(10),
  },

  containerNotificationNumber: {
    position: "absolute",
    paddingVertical: 3,
    paddingHorizontal: 6,
    backgroundColor: colors.red600,
    borderRadius: 4,
    top: -11,
    right: -1,
  },
  imageNotification: {
    height: 20,
    width: 20,
    resizeMode: "contain",
  },
});

export default styles;
