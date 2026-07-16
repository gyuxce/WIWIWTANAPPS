import Button from "components/Button";
import Card from "components/Card";
import SectionInfo from "components/SectionInfo";
import Space from "components/Space";
import fonts from "configs/fonts";
import React from "react";
import { View } from "react-native";
import { scaledHorizontal, scaledVertical } from "utils/ScaledService";

import { InfoOptionTwo, InfoOptionOne } from "./infoPayment";

interface PaymentOptionsProps {
  setPaymentOptions: (arg: number) => void;
  setStep: (arg: number) => void;
  setMaxStep: (arg: number) => void;
}

const PaymentOptions = ({
  setPaymentOptions,
  setStep,
}: PaymentOptionsProps) => {
  return (
    <View>
      <Card style={{ marginHorizontal: scaledHorizontal(25) }}>
        {InfoOptionOne.map((item, index) => {
          return (
            <SectionInfo
              title={item.title}
              subtitle={item.subtitle}
              index={index}
              key={index}
              dataLength={InfoOptionOne.length}
              withBullet={item.withBullet}
              textAlign="center"
              withOption={true}
              textOption="1"
            />
          );
        })}
        <Space height={20} />
        <Button
          onPress={() => {
            setPaymentOptions(1);
            setStep(4);
          }}
          title="Langsung Lunas"
          style={{ paddingVertical: scaledVertical(25) }}
          textStyle={{ fontFamily: fonts.CenturyGothicBold, fontSize: 12 }}
        />
      </Card>
      <Space height={20} />
      <Card style={{ marginHorizontal: scaledHorizontal(25) }}>
        {InfoOptionTwo.map((item, index) => {
          return (
            <SectionInfo
              title={item.title}
              subtitle={item.subtitle}
              index={index}
              key={index}
              dataLength={InfoOptionTwo.length}
              withBullet={item.withBullet}
              textAlign="center"
              withOption={true}
              textOption="2"
            />
          );
        })}
        <Space height={20} />
        <Button
          onPress={() => {
            setPaymentOptions(2);
            setStep(4);
          }}
          title="Cicilan Pribadi"
          style={{ paddingVertical: scaledVertical(25) }}
          textStyle={{ fontFamily: fonts.CenturyGothicBold, fontSize: 12 }}
        />
      </Card>
    </View>
  );
};

export default PaymentOptions;
