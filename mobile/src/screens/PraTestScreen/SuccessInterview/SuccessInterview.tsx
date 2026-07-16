import Space from "components/Space";
import Text from "components/Text";
import TextInput from "components/TextInput";
import colors from "configs/colors";
import fonts from "configs/fonts";
import images from "configs/images";
import { t } from "i18next";
import React, { useState } from "react";
import { View, Image } from "react-native";
import { UserType } from "types/UserTypes";
import { scaledHorizontal, scaledVertical } from "utils/ScaledService";

interface SuccessInterview {
  joinReason: string;
  setJoinReason: any;
  user: UserType;
}
const SuccessInterview = ({
  joinReason,
  setJoinReason,
  user,
}: SuccessInterview) => {
  const [textAreaHeight, setTextAreaHeight] = useState(0);
  return (
    <View
      style={{
        alignItems: "center",
        marginHorizontal: scaledHorizontal(25),
      }}
    >
      <Image
        source={images.success}
        style={{
          height: 200,
          width: 200,
          resizeMode: "contain",
        }}
      />
      <Text
        color={colors.accent}
        size={48}
        variant="OpificioNeueRegular"
        style={{ fontWeight: "400" }}
      >
        おめでとう！合格しました！
      </Text>
      <Text color={colors.accent} size={16} style={{ fontWeight: "900" }}>
        {t("selamat_kamu_lolos_seleksi")}
      </Text>
      <Space height={15} />
      <Text
        textAlign="center"
        size={12}
        style={{
          fontWeight: "400",
          paddingHorizontal: scaledHorizontal(20),
        }}
      >
        {t("silahkan_pilih_metode_pembayaran")}
      </Text>
      {!user?.join_reason && (
        <View style={{ alignItems: "center" }}>
          <Space height={20} />
          <Text
            size={16}
            color={colors.accent}
            type="bold"
            variant="CenturyGothicBold"
          >
            {t("informasi_pelatihan")}
          </Text>
          <Space height={20} />
          <Text size={12} color={colors.black}>
            {t("alasan_menjadi_perawat")}
            <Text size={12} color={colors.red}>
              *
            </Text>
          </Text>
          <Space height={8} />
          <TextInput
            value={joinReason}
            onChange={text => {
              setJoinReason(text);
            }}
            type="textarea"
            textAreaHeight={textAreaHeight > 40 ? textAreaHeight : 40}
            borderLess={false}
            textStyle={{
              fontFamily: fonts.CenturyGothicBold,
              textAlignVertical: "center",
              paddingTop: scaledVertical(20),
            }}
            placeholder={t("masukan_alasanmu")}
            onContentSizeChange={e => {
              setTextAreaHeight(e?.nativeEvent?.contentSize?.height + 20 || 40);
            }}
          />

          <Text
            color={colors.red}
            size={12}
            type={"bold"}
            variant="CenturyGothicBold"
          >
            (*) {t("wajib_diisi")}
          </Text>
        </View>
      )}
    </View>
  );
};

export default SuccessInterview;
