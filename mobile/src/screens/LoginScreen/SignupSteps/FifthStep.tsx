import React, { useEffect, useState } from "react";
import { View, Image, TouchableOpacity } from "react-native";
import Space from "components/Space";
import Text from "components/Text";
import Button from "components/Button";
import { scaledVertical, scaledHorizontal } from "utils/ScaledService";
import icons from "configs/icons";
import globalStyles from "utils/GlobalStyles";

import styles from "../styles";

import Agreement from "./Agreement/Agreement";

interface FifthStepProps {
  onPressSubmit: () => void;
  priceInfo: any;
}

const FifthStep = ({ onPressSubmit, priceInfo }: FifthStepProps) => {
  const [isAgree, setAggrement] = useState(false);
  // check box logic
  const onPressDetail = () => {
    if (isAgree) {
      setAggrement(false);
    } else {
      setAggrement(true);
    }
  };

  return (
    <View style={globalStyles().topSafeArea}>
      <Space height={scaledVertical(20)} />
      <Agreement priceInfo={priceInfo} />

      <Space height={20} />

      <TouchableOpacity
        onPress={() => onPressDetail()}
        style={{
          flexDirection: "row",
          gap: 10,
          marginHorizontal: scaledHorizontal(25),
        }}
      >
        <Image
          source={isAgree ? icons.checklistBox : icons.box}
          style={styles.imageCheckbox}
        />
        <Text size={12} variant="CenturyGothicRegular" style={{ flex: 1 }}>
          Saya sudah membaca dengan teliti dan menyetujui seluruh ketentuan dan
          peraturan di atas.
        </Text>
      </TouchableOpacity>
      <Space height={scaledVertical(20)} />
      <View
        style={{
          marginHorizontal: scaledHorizontal(25),
        }}
      >
        <Space height={10} />
        <Button
          onPress={onPressSubmit}
          title="Selesai"
          style={{ paddingVertical: 12 }}
          textStyle={{ fontSize: 12 }}
          disabled={!isAgree}
          textType="bold"
          variant="CenturyGothicBold"
          withBorder={isAgree ? true : false}
        />
      </View>
    </View>
  );
};

export default FifthStep;
