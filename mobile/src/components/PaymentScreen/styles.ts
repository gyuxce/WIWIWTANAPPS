import colors from "configs/colors";
import { StyleSheet } from "react-native";
import { scaledHorizontal } from "utils/ScaledService";

const styles = StyleSheet.create({
  logoContainer: {
    height: 30, // or whatever fixed height you want
    width: 100, // or any max width you prefer
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    borderWidth: 1
  },
  containerCardButton: {
    borderWidth: 1,
    borderRadius: 0,
    borderTopEndRadius: 12,
    borderTopStartRadius: 12,
    borderColor: colors.black,
    borderStyle: "solid",
  },
  containerCardSection: {
    marginTop: 30,
    marginHorizontal: scaledHorizontal(25),
    paddingHorizontal: -12,
  },
  imageParent: {
    height: 269,
    width: "100%",
    resizeMode: "contain",
  },
});

export default styles;
