import { View } from "react-native";
import React from "react";
import { scaledHorizontal } from "utils/ScaledService";
import CardItemClass from "components/CardItemClass";
import Button from "components/Button";
import icons from "configs/icons";

import styles from "./styles";
import { useTranslation } from "react-i18next";

interface Props {
  data?: any[];
  onPressDetail?: () => void;
  hideBtnDetail?: boolean;
}

const SectionNextClass = ({ onPressDetail, hideBtnDetail, data }: Props) => {
  const { t } = useTranslation();
  return (
    <View style={{ marginHorizontal: scaledHorizontal(25) }}>
      {data?.map((item: any, i: number) => (
        <CardItemClass
          key={i.toString()}
          image={item.image}
          headLine={item.headLine}
          title={item.title}
          date={item?.date}
          style={{ marginBottom: data?.length - 1 === i ? 0 : 12 }}
          headLineColor={item.headlineColor}
        />
      ))}
      {!hideBtnDetail && (
        <Button
          onPress={onPressDetail}
          title={t("lihat_semua")}
          style={styles.buttonStyles}
          variant="CenturyGothicBold"
          textType="bold"
          iconRight={icons.arrowRight}
          iconStyle={styles.iconStyles}
          innerStyle={styles.innerStyle}
        />
      )}
    </View>
  );
};

export default SectionNextClass;
