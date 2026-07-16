import { StyleSheet } from "react-native";
import colors from "configs/colors";

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    padding: 16,
    paddingBottom: 0,
    borderRadius: 12,
  },
  wrapMonth: {
    backgroundColor: colors.stone100,
    width: 112,
    height: 32,
    borderRadius: 8,
    marginBottom: 8,
    justifyContent: "center",
    marginRight: 8,
    alignItems: "center",
  },
  btnArrow: {
    height: 32,
    width: 32,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 0.5,
    borderRadius: 8,
  },
  wrapDay: {
    flex: 1,
    alignItems: "center",
    height: 36,
    justifyContent: "center",
  },
  lineDay: {
    height: 0.5,
    width: "104%",
    backgroundColor: colors.grey300,
    alignSelf: "center",
  },
  containerItemDate: {
    flex: 1,
    alignItems: "center",
    height: 40,
    marginBottom: 15,
  },
  wrapItemDate: {
    marginTop: 5,
    width: 26,
    height: 26,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 99,
    marginBottom: 2,
  },
  wrapMenuFilter: {
    borderRadius: 8,
    borderWidth: 0.5,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    width: 64,
  },
  btn: {
    borderWidth: 0.5,
    borderRadius: 8,
    backgroundColor: colors.white,
    height: 32,
    width: 140,
    marginTop: 12,
    alignSelf: "center",
  },
  detailWrapHeaderDate: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    alignItems: "center",
  },
});

export default styles;
