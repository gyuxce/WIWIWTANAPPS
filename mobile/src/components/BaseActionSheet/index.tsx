import React from "react";
import BottomSheet from "@gorhom/bottom-sheet";
import colors from "configs/colors";

interface BaseActionSheetProps {
  children: React.ReactNode;
  actionSheetRef: any;
  snapPoints: any;
}

const BaseActionSheet = ({
  children,
  actionSheetRef,
  snapPoints,
}: BaseActionSheetProps) => {
  return (
    <BottomSheet
      ref={actionSheetRef}
      snapPoints={snapPoints}
      enablePanDownToClose
      index={-1}
      bottomInset={0}
      activeOffsetY={[-10, 10]}
      style={{
        backgroundColor: "transparent",
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        elevation: 7,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
      }}
      handleIndicatorStyle={{ backgroundColor: colors.stone400, width: 100 }}
      handleStyle={{ backgroundColor: "transparent", zIndex: 9999999 }}
    >
      {children}
    </BottomSheet>
  );
};

export default BaseActionSheet;
