import Space from "components/Space";
import Text from "components/Text";
import colors from "configs/colors";
import images from "configs/images";
import { usePersist } from "hooks/usePersist";
import React from "react";
import { useTranslation } from "react-i18next";
import { View, Image } from "react-native";
import { scaledHorizontal } from "utils/ScaledService";

interface EmptyCertificationProps {}

const EmptyCertification = (props: EmptyCertificationProps) => {
  const { language } = usePersist();
  const { t } = useTranslation();
  return (
    <View>
      <View style={{ alignSelf: "center" }}>
        {language === "id" && (
          <View>
            <Text size={24} textAlign="center">
              Status Tes
            </Text>
            <View
              style={{
                borderBottomWidth: 1,
                borderBottomColor: colors.black,
                marginVertical: 5,
              }}
            />
          </View>
        )}

        <Text textAlign="center" size={16}>
          テストの進捗
        </Text>
      </View>
      <View>
        <Image
          source={images.certificationLaptop}
          style={{
            height: 200,
            width: 200,
            resizeMode: "contain",
            alignSelf: "center",
          }}
        />
        <Space height={20} />
        <Text textAlign="center" size={40} color={colors.accent}>
          準備しましょう!
        </Text>
        <Text
          textAlign="center"
          color={colors.accent}
          variant="CenturyGothicBold"
          type="bold"
        >
          {t("persiapkan_dirimu")}
        </Text>
        <Space height={20} />
        <Text
          size={12}
          style={{ paddingHorizontal: scaledHorizontal(25) }}
          textAlign="center"
        >
          {t("daftarkan_sertifikasi")}
        </Text>
      </View>
    </View>
  );
};

export default EmptyCertification;
