import Card from "components/Card";
import Space from "components/Space";
import Text from "components/Text";
import colors from "configs/colors";
import { t } from "i18next";
import React from "react";
import { View } from "react-native";
import { scaledHorizontal, scaledVertical } from "utils/ScaledService";

interface CardInfoProps {}

const CardInfo = (props: CardInfoProps) => {
  return (
    <Card style={{ marginHorizontal: scaledHorizontal(25) }}>
      <View
        style={{
          backgroundColor: colors.red,
          alignSelf: "center",
          paddingVertical: scaledVertical(3),
          paddingHorizontal: scaledHorizontal(5),
          borderRadius: 4,
        }}
      >
        <Text
          textAlign="center"
          type="bold"
          variant="CenturyGothicBold"
          size={14}
          color={colors.white}
        >
          1
        </Text>
      </View>
      <Space height={10} />
      <View>
        <Text
          textAlign="center"
          type="bold"
          variant="CenturyGothicBold"
          color={colors.accent}
        >
          {t("batas_waktu")}
        </Text>
      </View>
      <Space height={15} />

      <View style={{ flexDirection: "row", gap: 5 }}>
        <Text style={{ marginTop: scaledVertical(-3) }}>{"\u2022"}</Text>
        <Text size={12}>{t("asesmen_soal")}:</Text>
      </View>
      <Text size={12} style={{ paddingLeft: 15, flex: 1 }}>
        {t("batas_waktu_1")}
      </Text>
      <Space height={10} />
      <View style={{ flexDirection: "row", gap: 5 }}>
        <Text style={{ marginTop: scaledVertical(-3) }}>{"\u2022"}</Text>
        <Text size={12}>{t("asesmen_lisan")}:</Text>
      </View>
      <Text size={12} style={{ paddingLeft: 15, flex: 1 }}>
        {t("batas_waktu_2")}
      </Text>
      <Space height={20} />

      <View
        style={{
          backgroundColor: colors.red,
          alignSelf: "center",
          paddingVertical: scaledVertical(3),
          paddingHorizontal: scaledHorizontal(5),
          borderRadius: 4,
        }}
      >
        <Text
          textAlign="center"
          type="bold"
          variant="CenturyGothicBold"
          size={14}
          color={colors.white}
        >
          2
        </Text>
      </View>
      <Space height={10} />
      <View>
        <Text
          textAlign="center"
          type="bold"
          variant="CenturyGothicBold"
          color={colors.accent}
        >
          {t("jenis_soal")}
        </Text>
      </View>
      <Space height={15} />

      <View style={{ flexDirection: "row", gap: 5 }}>
        <Text style={{ marginTop: scaledVertical(-3) }}>{"\u2022"}</Text>
        <Text size={12}>{t("asesmen_soal")}:</Text>
      </View>
      <Text size={12} style={{ paddingLeft: 15 }}>
        {t("jenis_soal_soal")}
      </Text>
      <View style={{ flexDirection: "row", paddingLeft: 15 }}>
        <Text size={12}>a. </Text>
        <Text size={12} style={{ flex: 1 }}>
          {t("jenis_soal_1")}
        </Text>
      </View>
      <Space height={5} />
      <View style={{ flexDirection: "row", paddingLeft: 15 }}>
        <Text size={12}>b. </Text>
        <Text size={12} style={{ flex: 1 }}>
          {t("jenis_soal_2")}
        </Text>
      </View>
      <Space height={5} />
      <View style={{ flexDirection: "row", paddingLeft: 15 }}>
        <Text size={12}>c. </Text>
        <Text size={12} style={{ flex: 1 }}>
          {t("jenis_soal_3")}
        </Text>
      </View>
      <Space height={5} />
      <View style={{ flexDirection: "row", paddingLeft: 15 }}>
        <Text size={12}>d. </Text>
        <Text size={12} style={{ flex: 1 }}>
          {t("jenis_soal_4")}
        </Text>
      </View>
      <Space height={5} />
      <Space height={10} />
      <View style={{ flexDirection: "row", gap: 5 }}>
        <Text style={{ marginTop: scaledVertical(-3) }}>{"\u2022"}</Text>
        <Text size={12}>Asesmen Lisan:</Text>
      </View>
      <Text size={12} style={{ paddingLeft: 15, flex: 1 }}>
        {t("jenis_soal_5")}
      </Text>
      <Space height={20} />
      <View
        style={{
          backgroundColor: colors.red,
          alignSelf: "center",
          paddingVertical: scaledVertical(3),
          paddingHorizontal: scaledHorizontal(5),
          borderRadius: 4,
        }}
      >
        <Text
          textAlign="center"
          type="bold"
          variant="CenturyGothicBold"
          size={14}
          color={colors.white}
        >
          3
        </Text>
      </View>
      <Space height={10} />
      <View>
        <Text
          textAlign="center"
          type="bold"
          variant="CenturyGothicBold"
          color={colors.accent}
        >
          {t("menyelesaikan_asesmen")}
        </Text>
      </View>
      <Space height={15} />

      <View style={{ flexDirection: "row", gap: 5 }}>
        <Text style={{ marginTop: scaledVertical(-3) }}>{"\u2022"}</Text>
        <Text size={12} style={{ flex: 1 }}>
          {t("menyelesaikan_asesmen_1")}
        </Text>
      </View>

      <Space height={10} />
      <View style={{ flexDirection: "row", gap: 5 }}>
        <Text style={{ marginTop: scaledVertical(-3) }}>{"\u2022"}</Text>
        <Text size={12} style={{ flex: 1 }}>
          {t("menyelesaikan_asesmen_2")}
        </Text>
      </View>
      <Space height={10} />
    </Card>
  );
};

export default CardInfo;
