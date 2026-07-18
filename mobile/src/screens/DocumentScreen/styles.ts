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
  docInfoText: {
    flex: 1,
    paddingRight: 8,
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
  buttonUpload: {
    alignSelf: "center",
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
  filterWrapper: {
    flexDirection: "row",
    gap: 8,
    marginTop: 10,
    marginHorizontal: scaledHorizontal(25),
    justifyContent: "center",
    flexWrap: "wrap",
  },
  listDocContainer: {
    marginHorizontal: scaledHorizontal(25),
    marginVertical: 20,
    gap: 20,
  },
  buttonFilter: {
    paddingHorizontal: 2,
    borderRadius: 6,
    paddingVertical: 8,
    backgroundColor: colors.white,
  },
  buttonTextFilter: {
    fontWeight: "600",
    fontSize: 12,
    textAlign: "center",
  },
});

export default styles;
