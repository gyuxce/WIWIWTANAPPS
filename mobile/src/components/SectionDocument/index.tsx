import Button from "components/Button";
import Card from "components/Card";
import icons from "configs/icons";
import images from "configs/images";
import React from "react";
import { Image } from "react-native";
import { scaledHorizontal } from "utils/ScaledService";
import Text from "components/Text";
import Space from "components/Space";
import colors from "configs/colors";
import NavigationService from "utils/NavigationService";
import { useDispatch } from "react-redux";
import { onChangeRoute } from "stores/app/appSlice";

import styles from "../SectionStatus/styles";
import { useTranslation } from "react-i18next";

const SectionDocument = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  return (
    <Card style={{ marginHorizontal: scaledHorizontal(25) }}>
      <Image
        source={images.homeDocument}
        style={{ height: 160, width: "100%", resizeMode: "contain" }}
      />
      <Space height={20} />
      <Text textAlign="center" size={48} color={colors.accent}>
        を要する
      </Text>
      <Text
        textAlign="center"
        size={16}
        color={colors.accent}
        type="bold"
        variant="CenturyGothicBold"
      >
        {t("lengkapi_dokumen")}
      </Text>
      <Space height={20} />
      <Text textAlign="center" size={12} color={colors.black}>
        {t("proses_dokumen_selanjutnya")}
      </Text>
      <Button
        onPress={() => {
          dispatch(onChangeRoute("DocumentScreen"));
          NavigationService.navigate("DocumentScreen");
        }}
        title={t("lihat_detail")}
        style={styles.buttonStyles}
        variant="CenturyGothicBold"
        textType="bold"
        iconRight={icons.arrowRight}
        iconStyle={styles.iconStyles}
        innerStyle={styles.innerStyle}
      />
    </Card>
  );
};

export default SectionDocument;
