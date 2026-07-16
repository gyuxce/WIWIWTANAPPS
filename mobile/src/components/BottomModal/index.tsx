import React from "react";
import { View } from "react-native";
import Modal from "react-native-modal";

interface BottomModalProps {
  children: React.JSX.Element;
  isVisible: boolean;
  onClose: () => void;
  style?: any;
  backdropColor?: string;
}

const BottomModal = ({
  children,
  isVisible,
  onClose,
  style,
  backdropColor = "transparency",
}: BottomModalProps) => {
  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      backdropColor={backdropColor}
      avoidKeyboard={true}
      style={[
        style,
        {
          justifyContent: "flex-end",
          margin: 0,
        },
      ]}
    >
      <View>{children}</View>
    </Modal>
  );
};

export default BottomModal;
