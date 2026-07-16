import React, { useCallback } from "react";
import type { BottomSheetBackdropProps } from "@gorhom/bottom-sheet";
import { BottomSheetBackdrop, BottomSheetModal } from "@gorhom/bottom-sheet";
import colors from "configs/colors";

interface BaseActionSheetProps {
  children: React.ReactNode;
  actionSheetRef: any;
  snapPoints: any;
  onDismiss?: () => void;
  onClose?: () => void;
  onBackdropPress?: () => void;
}

const BaseActionSheetModal = ({
  children,
  actionSheetRef,
  snapPoints,
  onDismiss,
  onBackdropPress,
}: BaseActionSheetProps) => {
  const renderBackdrop = useCallback(
    (props_: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props_}
        pressBehavior="close"
        opacity={0.5}
        disappearsOnIndex={-1}
        onPress={onBackdropPress}
      />
    ),
    [],
  );
  return (
    <BottomSheetModal
      ref={actionSheetRef}
      snapPoints={snapPoints}
      onDismiss={onDismiss}
      enableDismissOnClose
      enablePanDownToClose
      enableHandlePanningGesture
      enableContentPanningGesture={false}
      enableOverDrag
      index={0}
      backdropComponent={renderBackdrop}
      bottomInset={0}
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
    </BottomSheetModal>
  );
};

export default BaseActionSheetModal;
