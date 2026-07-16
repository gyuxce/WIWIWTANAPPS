import Card from "components/Card";
import React from "react";
import { View } from "react-native";
import SectionInfo from "components/SectionInfo";
import Space from "components/Space";
import { scaledHorizontal } from "utils/ScaledService";

import Info from "./info";
interface FullPaymentProps {}

const FullPayment = (props: FullPaymentProps) => {
  return (
    <View>
      <Card style={{ marginHorizontal: scaledHorizontal(25) }}>
        {Info.map((item, index) => {
          return (
            <SectionInfo
              title={item.title}
              subtitle={item.subtitle}
              index={index}
              key={index}
              dataLength={Info.length}
              withBullet={item.withBullet}
              textAlign="center"
              alignParagraph="center"
            />
          );
        })}
        <Space height={20} />
      </Card>
    </View>
  );
};

export default FullPayment;
