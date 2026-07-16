import colors from "configs/colors";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: "center",
    marginTop: 48,
    paddingHorizontal: 32,
  },
  btn: {
    borderWidth: 0.5,
    borderRadius: 6,
    backgroundColor: colors.white,
    height: 32,
    width: 120,
    marginTop: 8,
  },
  inputKatakana: {
    height: 44,
    backgroundColor: colors.stone200,
    borderWidth: 1,
    borderColor: colors.white,
  },
  btnUpload: {
    height: 48,
    width: "100%",
    marginBottom: 2,
  },
});

export default styles;
