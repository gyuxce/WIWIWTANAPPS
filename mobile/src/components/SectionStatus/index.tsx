import Button from "components/Button";
import Card from "components/Card";
import icons from "configs/icons";
import React from "react";
import { View, Image } from "react-native";
import { scaledHorizontal } from "utils/ScaledService";
import Text from "components/Text";
import Space from "components/Space";
import colors from "configs/colors";
import CheckbooxLoop from "components/CheckboxLoop";

import styles from "./styles";
import { useTranslation } from "react-i18next";

interface SectionStatusProps {
  dataPayment: {
    title: string;
    onPressDetail?: () => void;
    isChecklist: boolean;
    status?: number;
  }[];
  image: any;
  icon: any;
  title: any;
  onPressDetail: () => void;
}

const SectionStatus = ({
  dataPayment,
  image,
  title,
  icon,
  onPressDetail,
}: SectionStatusProps) => {
  const { t } = useTranslation();
  return (
    <View style={{ marginHorizontal: scaledHorizontal(25) }}>
      <Card style={{ alignItems: "center" }}>
        <Image source={image} style={{ width: 210, height: 160 }} />
        <Space height={20} />
        <Image
          source={icon}
          style={{ width: 40, height: 40, resizeMode: "cover" }}
        />
        <Space height={10} />
        <Text size={20} color={colors.accent}>
          {title}
        </Text>
        <Space height={20} />
        <CheckbooxLoop data={dataPayment} />
        <Space height={20} />
        <Button
          onPress={onPressDetail}
          title={t("lihat_detail")}
          style={styles.buttonStyles}
          variant="CenturyGothicBold"
          textType="bold"
          iconRight={icons.arrowRight}
          iconStyle={styles.iconStyles}
          innerStyle={styles.innerStyle}
        />
      </Card>
    </View>
  );
};

export default SectionStatus;
