import color from "configs/colors";
import { StyleSheet } from "react-native";
import { scaledVertical } from "utils/ScaledService";

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    textAlign: "center",
    position: "relative",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: scaledVertical(9),
    backgroundColor: color.white,
  },
  textInput: {
    fontSize: 12,
    textAlign: "center",
    height: 40,
    color: color.black,
  },
  borderError: {
    borderColor: color.cinnabar,
  },
  borderLess: {
    borderBottomWidth: 1,
    borderColor: color.black,
  },
  borderContainer: {
    borderWidth: 1,
    borderColor: color.black,
    borderRadius: 8,
  },
  label: {
    paddingBottom: 3,
  },
  wrapInput: {
    flexDirection: "row",
  },
  wrapIcon: {
    position: "absolute",
    right: 0,
    bottom: 2,
    top: 0,
    justifyContent: "center",
  },
  icon: {
    height: 24,
    width: 24,
    tintColor: color.black,
  },
  clearIcon: {
    height: 16,
    width: 16,
    tintColor: color.black,
  },
  errorText: {
    alignSelf: "flex-end",

    marginTop: 4,
    fontSize: 12,
    color: color.red600,
    marginBottom: 5,
  },
  iconSvg: {
    height: 20,
    width: 20,
    color: color.black,
  },
  contentSvg: {
    position: "absolute",
  },
});

export default styles;
