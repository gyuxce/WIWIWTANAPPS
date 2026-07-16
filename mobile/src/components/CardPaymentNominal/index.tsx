import Card from "components/Card";
import Space from "components/Space";
import Text from "components/Text";
import colors from "configs/colors";
import React from "react";
import type { ViewStyle } from "react-native";
import { scaledHorizontal } from "utils/ScaledService";

interface CardPaymentNominalProps {
  text?: string;
  nominal: string;
  style?: ViewStyle | any;
}

const CardPaymentNominal = ({
  text = "Total Biaya Pelatihan",
  nominal,
  style,
}: CardPaymentNominalProps) => {
  return (
    <Card style={[{ marginHorizontal: scaledHorizontal(25) }, style]}>
      <Text size={12} textAlign="center" color={colors.accent}>
        {text}
      </Text>
      <Space height={5} />
      <Text
        size={24}
        textAlign="center"
        color={colors.accent}
        variant="OpificioNeueRegular"
      >
        IDR {nominal}
      </Text>
    </Card>
  );
};

export default CardPaymentNominal;
