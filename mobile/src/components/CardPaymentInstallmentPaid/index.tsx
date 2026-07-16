import { Image, View } from "react-native";
import React, { useEffect, useState } from "react";
import Text from "components/Text";
import { scaledHorizontal, scaledVertical } from "utils/ScaledService";
import Button from "components/Button";
import images from "configs/images";
import Space from "components/Space";
import colors from "configs/colors";
import fonts from "configs/fonts";
import { useUser } from "hooks/useUser";
import { t } from "i18next";
import { usePersist } from "hooks/usePersist";
interface Props {
  type?: "Pelatihan" | "Administrasi";
}

const CardPaymentInstallmentPaid = ({ type = "Administrasi" }: Props) => {
  const { getUserAdmin, openAdminWhatsapp } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const { language } = usePersist();

  useEffect(() => {
    getUserAdmin().then(() => {
      setIsLoading(false);
    });
  }, []);

  return (
    <View style={{ marginHorizontal: scaledHorizontal(25), marginTop: 30 }}>
      <Image
        source={images.perjalananStatus}
        style={{ height: 160, width: "100%", resizeMode: "contain" }}
      />
      <Space height={20} />
      <Text textAlign="center" size={32} color={colors.accent}>
        ありがとうございます！
      </Text>
      <Text
        textAlign="center"
        size={16}
        color={colors.accent}
        type="bold"
        variant="CenturyGothicBold"
      >
        Terima Kasih
      </Text>
      <Space height={20} />
      <Text
        textAlign="center"
        style={{ paddingHorizontal: scaledVertical(45) }}
        size={12}
        color={colors.black}
      >
        {language === "ja"
          ? `今月の分割払いは完了しました！また来月もお待ちしております。`
          : `Pembayaran cicilan bulan ini sudah berhasil dilakukan! Silakan kembali lagi bulan depan.`}
      </Text>
      <Space height={20} />
      <Button
        isLoading={isLoading}
        onPress={openAdminWhatsapp}
        title={t("hubungi_admin_sertifikasi")}
        textStyle={{
          fontFamily: fonts.CenturyGothicBold,
          fontSize: 12,
        }}
        style={{ paddingVertical: scaledVertical(25) }}
      />
    </View>
  );
};

export default CardPaymentInstallmentPaid;
