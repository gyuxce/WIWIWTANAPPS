import colors from "configs/colors";
import fonts from "configs/fonts";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    padding: 12,
    borderRadius: 12,
  },
  detailWrapImg: {
    height: 170,
    overflow: "hidden",
    borderRadius: 4,
  },
  wrapNumber: {
    marginBottom: 5,
    alignSelf: "center",
    backgroundColor: colors.stone100,
    height: 26,
    width: 52,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  iconDownload: {
    height: 20,
    width: 20,
    resizeMode: "contain",
    marginRight: 8,
  },
  buttonDownload: {
    fontSize: 12,
    alignSelf: "center",
    fontFamily: fonts.CenturyGothicBold,
    color: colors.black,
  },
  buttonStyle: {
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 20,
  },
});

export default styles;
