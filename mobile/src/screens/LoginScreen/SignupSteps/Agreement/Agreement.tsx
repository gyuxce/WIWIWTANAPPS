import Card from "components/Card";
import SectionInfo from "components/SectionInfo";
import React from "react";
import { scaledHorizontal } from "utils/ScaledService";

import getInfo from "./info";

const Agreement = ({ priceInfo }: { priceInfo: any }) => {
  return (
    <Card style={{ marginHorizontal: scaledHorizontal(25) }}>
      {getInfo(priceInfo)?.map((item, index) => {
        return (
          <SectionInfo
            title={item.title}
            subtitle={item.subtitle}
            index={index}
            key={index}
            dataLength={getInfo(priceInfo)?.length}
            withBullet={item.withBullet}
            textAlign="center"
          />
        );
      })}
    </Card>
  );
};

export default Agreement;
