import Card from "components/Card";
import React from "react";
import { View } from "react-native";
import { scaledHorizontal, scaledVertical } from "utils/ScaledService";
import SectionInfo from "components/SectionInfo";
import Space from "components/Space";
import Button from "components/Button";
import fonts from "configs/fonts";

import { InfoCooperative } from "./info";

interface CooperativeOptionProps {
  setStep: (arg: number) => void;
}

const CooperativeOption = ({ setStep }: CooperativeOptionProps) => {
  return (
    <View>
      <Card style={{ marginHorizontal: scaledHorizontal(25) }}>
        {InfoCooperative.map((item, index) => {
          return (
            <SectionInfo
              title={item.title}
              subtitle={item.subtitle}
              index={index}
              key={index}
              dataLength={InfoCooperative.length}
              withBullet={item.withBullet}
              textAlign="center"
            />
          );
        })}
        <Space height={20} />
      </Card>
      <Space height={20} />
      <Button
        onPress={() => setStep(6)}
        title="Lanjutkan"
        style={{
          paddingVertical: scaledVertical(25),
          marginHorizontal: scaledHorizontal(25),
        }}
        textStyle={{ fontFamily: fonts.CenturyGothicBold, fontSize: 12 }}
      />
    </View>
  );
};

export default CooperativeOption;
