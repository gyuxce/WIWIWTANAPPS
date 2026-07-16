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
  moduleContainer: {
    marginBottom: 12,
  },
  mainContentContainer: {
    paddingHorizontal: 12,
    paddingVertical: 20,
    borderRadius: 20,
    backgroundColor: "white",
  },
  childContentContainer: {
    paddingHorizontal: 12,
    marginTop: 12,
    paddingVertical: 20,
    borderRadius: 20,
    backgroundColor: "#FAFAFA",
  },
  contentContainer: {
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 20,
    borderRadius: 20,
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rightContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: "auto",
  },
  mainTitle: {
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "Century Gothic",
    color: "black",
  },
  childTitle: {
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "Century Gothic",
    color: "black",
    flex: 1,
  },
  contentTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "Century Gothic",
    color: "black",
    marginLeft: 8,
    marginRight: 12,
    overflow: "hidden",
    //textOverflow: "ellipsis",
    //whiteSpace: "nowrap",
  },
  finishedContentTitle: {
    fontSize: 12,
    fontFamily: "Century Gothic",
    color: "black",
    marginLeft: 8,
    marginRight: 12,
    flex: 1,
    overflow: "hidden",
    //textOverflow: "ellipsis",
    //whiteSpace: "nowrap",
  },
  totalText: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "Century Gothic",
    marginRight: 4,
  },
  totalTextRed: {
    color: "#C63838",
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "Century Gothic",
    marginRight: 4,
  },
  arrowIcon: {
    height: 24,
    width: 24,
    resizeMode: "contain",
  },
  bookIcon: {
    height: 24,
    width: 24,
    resizeMode: "contain",
  },
  checklistIcon: {
    height: 24,
    width: 24,
    resizeMode: "contain",
  },
  divider: {
    height: 24,
    width: "100%",
    resizeMode: "contain",
  },
});

export default styles;
