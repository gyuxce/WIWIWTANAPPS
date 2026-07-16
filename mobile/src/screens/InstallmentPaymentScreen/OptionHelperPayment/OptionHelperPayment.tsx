import Card from "components/Card";
import React from "react";
import { View } from "react-native";
import SectionInfo from "components/SectionInfo";
import Space from "components/Space";
import { scaledHorizontal, scaledVertical } from "utils/ScaledService";
import fonts from "configs/fonts";
import Button from "components/Button";

import Info from "./info";

interface OptionHelperPaymentProps {
  setStep: (arg: number) => void;
  setInstallmentType: (arg: number) => void;
  setMaxStep: (arg: number) => void;
}

const OptionHelperPayment = ({
  setStep,
  setInstallmentType,
  setMaxStep,
}: OptionHelperPaymentProps) => {
  return (
    <View>
      {Info.map((item, index) => {
        return (
          <View key={index}>
            <Card style={{ marginHorizontal: scaledHorizontal(25) }}>
              <SectionInfo
                title={item.title}
                subtitle={item.subtitle}
                index={1}
                dataLength={Info.length}
                withBullet={item.withBullet}
                textAlign="center"
                withOption={true}
                textOption={String(index + 1)}
                textColor={item.titleColor}
                titleBackground={item.titleBackground}
              />
              <Button
                onPress={() => {
                  if (index + 1 === 2) {
                    setMaxStep(6);
                  }
                  setStep(5);
                  setInstallmentType(index + 1);
                }}
                title="Pilih Opsi"
                style={{ paddingVertical: scaledVertical(25) }}
                textStyle={{
                  fontFamily: fonts.CenturyGothicBold,
                  fontSize: 12,
                  fontWeight: "bold",
                }}
              />
            </Card>
            <Space height={20} />
          </View>
        );
      })}
    </View>
  );
};

export default OptionHelperPayment;
