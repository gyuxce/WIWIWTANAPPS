import BaseModal from "components/BaseModal";
import Space from "components/Space";
import Text from "components/Text";
import colors from "configs/colors";
import icons from "configs/icons";
import React from "react";
import { Image, TouchableOpacity } from "react-native";

interface ModalButtonListProps {
  showModal: boolean;
  listButton: { id: string; title: string }[];

  onClose: () => void;
  onPressButtonList: (args1: string) => void;
}

const ModalButtonList = ({
  showModal,
  listButton,

  onClose,
  onPressButtonList,
}: ModalButtonListProps) => {
  return (
    <BaseModal
      showModal={showModal}
      onBackButtonPress={onClose}
      onBackdropPress={onClose}
      containerStyle={{ borderRadius: 12 }}
    >
      <TouchableOpacity
        onPress={onClose}
        style={{
          alignItems: "flex-end",
          marginTop: -10,
        }}
      >
        <Image
          source={icons.close}
          style={{ height: 20, width: 20, tintColor: colors.black }}
          resizeMode={"contain"}
        />
      </TouchableOpacity>
      <Space height={5} />
      {listButton.map((item, index) => {
        return (
          <TouchableOpacity
            key={index}
            onPress={() => onPressButtonList(item.id)}
          >
            <Text
              textAlign="center"
              type="bold"
              variant="CenturyGothicBold"
              color={colors.black}
              size={12}
            >
              {item.title}
            </Text>
            {listButton?.length - 1 === index ? null : <Space height={20} />}
          </TouchableOpacity>
        );
      })}
    </BaseModal>
  );
};

export default ModalButtonList;
