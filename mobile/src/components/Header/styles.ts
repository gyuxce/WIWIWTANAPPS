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
  containerName: {
    height: 52,
    width: 52,
    borderWidth: 2,
    borderColor: colors.black,
    borderRadius: 52 / 2,

    alignItems: "center",
    justifyContent: "center",
    alignContent: "center",
    padding: 2,
  },
  containerImage: {
    height: 46,
    width: 46,
    borderWidth: 2,
    borderColor: colors.white,
    borderRadius: 46 / 2,

    alignItems: "center",
    justifyContent: "center",
    alignContent: "center",
  },
  imageAvatar: {
    height: 41,
    width: 41,
    resizeMode: "contain",
    borderRadius: 40 / 2,
  },
  containerNotificationNumber: {
    //position: "absolute",
    paddingVertical: 3,
    paddingHorizontal: 6,
    backgroundColor: colors.red600,
    borderRadius: 4,
    top: -30,
    right: -15,
  },
  imageNotification: {
    height: 20,
    width: 20,
    resizeMode: "contain",
    alignSelf: "center",
  },
});

export default styles;
