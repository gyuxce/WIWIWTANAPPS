import BaseModal from "components/BaseModal";
import Button from "components/Button";
import Space from "components/Space";
import Text from "components/Text";
import colors from "configs/colors";
import React from "react";
import { scaledHorizontal, scaledFontSize } from "utils/ScaledService";

interface ModalNotificationProps {
  showModal: boolean;
  onHide?: () => void;
  title?: string;
  subtitle?: string;
  buttonTitle: string;
  onButtonPress: () => void;
  titleJapan?: string;
}

const ModalNotification = ({
  showModal,
  onHide,
  onButtonPress,
  subtitle,
  title,
  titleJapan,
  buttonTitle,
}: ModalNotificationProps) => {
  return (
    <BaseModal
      showModal={showModal}
      onModalHide={onHide}
      onBackdropPress={onHide}
      onBackButtonPress={onHide}
      animation="slide"
    >
      <Text
        size={48}
        textAlign="center"
        color={colors.accent}
        variant={"OpificioNeueRegular"}
      >
        {titleJapan}
      </Text>
      <Text
        size={16}
        textAlign="center"
        color={colors.accent}
        type="bold"
        variant={"CenturyGothicBold"}
      >
        {title}
      </Text>
      <Space height={10} />

      <Text
        size={12}
        textAlign="center"
        color={colors.black}
        style={{ marginHorizontal: scaledHorizontal(25) }}
        lineHeight={15}
      >
        {subtitle}
      </Text>
      <Space height={15} />
      <Button
        onPress={onButtonPress}
        variant="CenturyGothicBold"
        textType="bold"
        title={buttonTitle}
        type="light"
        style={{ paddingVertical: 8, minWidth: "100%" }}
        textStyle={{
          fontSize: scaledFontSize(20),
          lineHeight: 18,
        }}
      />
    </BaseModal>
  );
};

export default ModalNotification;
