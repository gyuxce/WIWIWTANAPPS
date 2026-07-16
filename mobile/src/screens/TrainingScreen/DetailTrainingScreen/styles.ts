import colors from "configs/colors";
import fonts from "configs/fonts";
import { StyleSheet } from "react-native";
import { scaledHorizontal } from "utils/ScaledService";

const styles = StyleSheet.create({
  container: {
    marginHorizontal: scaledHorizontal(25),
    flex: 1,
    marginTop: 8,
  },
  wrapImg: {
    width: 128,
    height: 160,
    alignSelf: "center",
  },
  wrapSearch: {
    backgroundColor: colors.white,
    padding: 8,
    borderRadius: 8,
    flexDirection: "row",
  },
  input: {
    textAlign: "left",
    marginLeft: 24,
    height: 32,
    fontFamily: fonts.CenturyGothicRegular,
    marginBottom: 2,
    fontSize: 10,
  },
  inputBox: {
    backgroundColor: colors.stone100,
    paddingVertical: 0,
    flex: 1,
    marginRight: 12,
  },
  filter: {
    height: 32,
    borderWidth: 0.5,
    borderRadius: 8,
    width: 72,
  },
});

export default styles;
