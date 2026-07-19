import { Image, View } from "react-native";
import React from "react";
import Text from "components/Text";
import { scaledHorizontal } from "utils/ScaledService";
import Button from "components/Button";
import icons from "configs/icons";
import Card from "components/Card";
import images from "configs/images";
import Space from "components/Space";
import CardProgressLesson from "components/CardProgressLesson";
import colors from "configs/colors";
import type { TraningModuleProgressType } from "types/ExamTypes";
import { getCourseImageAndColor } from "utils/Utils";

import styles from "./styles";
import NavigationService from "utils/NavigationService";
import { useAuth } from "hooks/useAuth";
import { useTranslation } from "react-i18next";

interface Props {
  data?: TraningModuleProgressType[];
  hideBtnDetail?: boolean;
  onPressItem?: () => void;
  isCustom?: boolean;
}

const SectionLesson = ({
  hideBtnDetail,
  onPressItem,
  data,
  isCustom = false,
}: Props) => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const toSafeNumber = (value?: number | string | null) => {
    const numericValue = Number(value);

    return Number.isFinite(numericValue) ? numericValue : 0;
  };

  return (
    <View style={{ marginHorizontal: scaledHorizontal(25) }}>
      <Card style={{ alignItems: "center" }}>
        <Image
          source={images.lessonStatus}
          style={{ width: 210, height: 160 }}
        />
        <Space height={20} />
        <View
          style={{ flexDirection: "column", alignItems: "center", gap: 10 }}
        >
          <Image source={icons.markLesson} style={{ width: 28, height: 28 }} />
          <Text color={colors.accent} size={20}>
            {t("pelatihan")}
          </Text>
        </View>

        <Space height={20} />

        {data?.map((item, i) => (
          <CardProgressLesson
            key={i.toString()}
            color={getCourseImageAndColor(item?.type_label)?.color}
            title={item.title}
            total={
              toSafeNumber(item.materi_count) +
              toSafeNumber(item?.virtual_count) +
              toSafeNumber(item?.assesment_count)
            }
            progress={
              toSafeNumber(item.materi_count_progress) +
              toSafeNumber(item?.virtual_count_progress) +
              toSafeNumber(item?.assesment_count_progress)
            }
            style={{
              marginBottom: data.length - 1 === i ? 0 : 12,
              opacity: user?.last_phase >= 3 ? 1 : 0.2,
            }}
            image={
              item?.cover === null
                ? getCourseImageAndColor(item?.type_label)?.image
                : { uri: item?.cover?.url }
            }
            onPress={() => {
              //if (user?.last_phase >= 3) {
              NavigationService.navigate("DetailTrainingScreen", {
                categoryCourse: item,
              });
              //}
            }}
          />
        ))}

        {!isCustom ? (
          <Button
            onPress={() => {
              if (onPressItem) {
                onPressItem();
                return;
              }

              NavigationService.navigate("TrainingScreen");
            }}
            title={t("lihat_detail")}
            style={styles.buttonStyles}
            variant="CenturyGothicBold"
            textType="bold"
            iconRight={icons.arrowRight}
            iconStyle={styles.iconStyles}
            innerStyle={styles.innerStyle}
            disabled={user?.last_phase < 3}
            withBorder={user?.last_phase >= 3}
          />
        ) : (
          <Button
            onPress={() => {
              if (onPressItem) {
                onPressItem();
                return;
              }

              NavigationService.navigate("TrainingScreen");
            }}
            title={t("lihat_detail")}
            style={{
              paddingVertical: 12,
              width: "100%",
              alignItems: "center",
              justifyContent: "center",
              paddingHorizontal: 6,
              alignSelf: "center",
              marginTop: 20,
            }}
            variant="CenturyGothicBold"
            textType="bold"
            disabled={user?.last_phase < 3}
            withBorder={user?.last_phase >= 3}
          />
        )}
      </Card>
    </View>
  );
};

export default SectionLesson;
