import Button from "components/Button";
import Card from "components/Card";
import Space from "components/Space";
import Text from "components/Text";
import colors from "configs/colors";
import icons from "configs/icons";
import images from "configs/images";
import React from "react";
import { View, Image } from "react-native";
import { scaledHorizontal } from "utils/ScaledService";
import CheckbooxLoop from "components/CheckboxLoop";

import styles from "./styles";
import NavigationService from "utils/NavigationService";
import { useDispatch } from "react-redux";
import { onChangeRoute } from "stores/app/appSlice";
import { useTranslation } from "react-i18next";

interface SectionPraTestProps {
  dataTest: {
    title: string;
    onPressDetail?: () => void;
    isChecklist?: boolean;
    status: number;
  }[];
}

const SectionPraTest = ({ dataTest }: SectionPraTestProps) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const onPressDetailNavigation = () => {
    dispatch(onChangeRoute("PraTestScreen"));
    return NavigationService.navigate("PraTestScreen");
    // return Alert.alert("Something went wrong");
  };
  return (
    <View style={{ marginHorizontal: scaledHorizontal(25) }}>
      <Card
        style={{
          alignItems: "center",
          paddingHorizontal: scaledHorizontal(30),
        }}
      >
        <Image
          source={images.imagePerjalanan}
          style={{ width: 130, height: 105, resizeMode: "cover" }}
        />
        <Space height={20} />
        <Image
          source={icons.japanBook}
          style={{ width: 40, height: 40, resizeMode: "cover" }}
        />
        <Space height={10} />
        <Text size={20} color={colors.accent}>
          {t("pratest")}
        </Text>
        <Space height={20} />

        <CheckbooxLoop data={dataTest} />
        <Space height={20} />
        <Button
          onPress={onPressDetailNavigation}
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

export default SectionPraTest;
