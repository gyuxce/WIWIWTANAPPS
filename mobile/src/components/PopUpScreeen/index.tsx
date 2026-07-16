import BaseModal from "components/BaseModal";
import colors from "configs/colors";
import type { ReactNode } from "react";
import React, { memo, useEffect } from "react";

interface Props {
  showModal?: boolean;
  animation?: "zoom" | "slide";
  closeTimer?: number;
  children?: ReactNode;
  onClose?: () => void;
}

const PopUpScreen = ({
  showModal = false,
  children,
  animation = "zoom",
  closeTimer = 3000,
  onClose,
}: Props) => {
  useEffect(() => {
    if (showModal === true) {
      setTimeout(() => {
        onClose && onClose();
      }, closeTimer);
    }
  }, [closeTimer, onClose, showModal]);

  return (
    <BaseModal
      animation={animation}
      showModal={showModal}
      containerStyle={{ marginHorizontal: 0 }}
      contentStyle={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingTop: 0,
        backgroundColor: colors.stone100,
        borderRadius: 0,
      }}
    >
      {children}
    </BaseModal>
  );
};

export default memo(PopUpScreen);
