import BaseModal from "components/BaseModal";
import Space from "components/Space";
import Text from "components/Text";
import colors from "configs/colors";
import React from "react";
import { ActivityIndicator, View } from "react-native";
import { scaledHorizontal } from "utils/ScaledService";

interface LoadingModalProps {
  showModal: boolean;
  onCloseModal?: () => void;
  isCustomMessage?: boolean;
}

const LoadingModal = ({
  showModal,
  onCloseModal,
  isCustomMessage,
}: LoadingModalProps) => {
  return (
    <BaseModal
      showModal={showModal}
      //onBackButtonPress={onCloseModal}
      //onBackdropPress={onCloseModal}
      containerStyle={{
        marginHorizontal: scaledHorizontal(-25),
      }}
      contentStyle={{ backgroundColor: "transparent" }}
    >
      <ActivityIndicator size={"large"} color={colors.white} />
      {isCustomMessage && (
        <View>
          <Space height={20} />
          <Text
            textAlign="center"
            type="bold"
            variant="CenturyGothicBold"
            color={colors.white}
          >
            Silahkan tunggu...
          </Text>
        </View>
      )}
    </BaseModal>
  );
};

export default LoadingModal;
