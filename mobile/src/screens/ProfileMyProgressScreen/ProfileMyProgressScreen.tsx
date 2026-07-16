import Button from "components/Button";
import Card from "components/Card";
import Header from "components/Header";
import SectionLesson from "components/SectionLesson";
import SectionWithCheck from "components/SectionWithCheck/SectionWithCheck";
import Space from "components/Space";
import Text from "components/Text";
import colors from "configs/colors";
import icons from "configs/icons";
import images from "configs/images";
import { useAuth } from "hooks/useAuth";
import { useCertification } from "hooks/useCertification";
import { useExam } from "hooks/useExam";
import { usePayment } from "hooks/usePayment";
import { useUser } from "hooks/useUser";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { View, ScrollView, Platform } from "react-native";
import globalStyles from "utils/GlobalStyles";
import NavigationService from "utils/NavigationService";
import { scaledHorizontal } from "utils/ScaledService";
import { getStatus } from "utils/Utils";

const ProfileMyProgressScreen = () => {
  const {
    trainingModuleProgress,
    getTrainingModuleProgress,
    getExamProgress,
    examProgress,
  } = useExam();
  const { getPaymentStatusType, paymentStatusType } = usePayment();
  const { certificationUser, getCertificationUser } = useCertification();
  const { statusTest } = useUser();
  const { user } = useAuth();
  const { t } = useTranslation();
  const topOption = [
    {
      title: "Program Pelatihan",
      value: `${(user?.last_phase / 5) * 100}%`,
    },
    {
      title: "Level Bahasa Jepang",
      value: user?.last_level_label,
    },
  ];

  const dataSertifikasi = [
    {
      title: t("daftar_sertifikasi"),
      isChecklist: certificationUser?.length > 0 ? true : false,
    },
    { title: t("review_kelulusan"), isChecklist: user?.last_phase === 5 },
  ];

  const dataInterview = [
    {
      title: t("wawancara_kerja"),
      isChecklist: user?.interview_status === 1 ? true : false,
    },
    {
      title: t("keberangkatan"),
      isChecklist: user?.interview_status === 1 ? true : false,
    },
  ];

  useEffect(() => {
    getTrainingModuleProgress().then(() => {
      getExamProgress().then(() => {
        getPaymentStatusType();
        getCertificationUser({
          type: "collection",
          relations: ["file"],
        });
      });
    });
  }, []);

  return (
    <View style={globalStyles().topSafeArea}>
      <Space height={Platform.OS === "android" ? 15 : 0} />
      <Header
        withBell
        totalNotification={4}
        textJapan="自分の進捗"
        textTitle="Progress Saya"
        withTextTitle
        withBackButton
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <Space height={15} />
        {topOption.map((item, index) => {
          return (
            <View key={index}>
              <Text
                textAlign="center"
                size={16}
                type="bold"
                variant="CenturyGothicBold"
              >
                {item.title}
              </Text>
              <Space height={5} />
              <Text
                textAlign="center"
                variant="OpificioNeueRegular"
                size={24}
                color={colors.red}
              >
                {item.value}
              </Text>
              <Space height={15} />
            </View>
          );
        })}
        <Card
          style={{
            marginHorizontal: scaledHorizontal(25),
          }}
        >
          <SectionWithCheck
            // @ts-ignore
            data={getStatus(examProgress, statusTest, t)}
            imageLeft={images.imagePerjalanan}
            imageJapan={icons.japanBook}
            title={t("pratest")}
          />
          <Button
            onPress={() => NavigationService.navigate("PraTestScreen")}
            title={
              user?.last_phase === 1 ? t("lanjut_proses") : t("detail_pratest")
            }
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
          />
        </Card>
        <Space height={20} />
        <Card
          style={{
            marginHorizontal: scaledHorizontal(25),
          }}
        >
          <SectionWithCheck
            data={[
              {
                title: t("biaya_administrasi"),
                isChecklist:
                  paymentStatusType?.is_administration_payment_completed,
              },
              {
                title: t("biaya_pelatihan"),
                isChecklist: paymentStatusType?.is_training_payment_completed,
              },
            ]}
            imageLeft={images.perjalananStatus}
            imageJapan={icons.paymentJapan}
            title={t("pembayaran")}
          />
          <Button
            onPress={() => NavigationService.navigate("PaymentAdministration")}
            title={
              user?.last_phase === 2
                ? t("lanjut_proses")
                : t("detail_pembayaran")
            }
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
            disabled={user?.last_phase < 2}
            withBorder={user?.last_phase >= 2}
          />
        </Card>
        <Space height={20} />
        <SectionLesson data={trainingModuleProgress} isCustom />
        <Space height={20} />
        <Card
          style={{
            marginHorizontal: scaledHorizontal(25),
          }}
        >
          <SectionWithCheck
            data={dataSertifikasi}
            imageLeft={images.sertifikasi}
            imageJapan={icons.sertifikasiJapan}
            title={t("sertifikasi_bahasa_jepang")}
          />
          <Button
            onPress={() => NavigationService.navigate("JapanCertificateScreen")}
            title={
              user?.last_phase === 4
                ? t("lanjut_proses")
                : t("detail_sertifikasi")
            }
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
            disabled={user?.last_phase < 4}
            withBorder={user?.last_phase >= 4}
          />
        </Card>
        <Space height={20} />
        <Card
          style={{
            marginHorizontal: scaledHorizontal(25),
          }}
        >
          <SectionWithCheck
            data={dataInterview}
            imageLeft={icons.wawancara}
            imageJapan={icons.wawancaraJapan}
            title={t("interview_final")}
          />
          <Button
            onPress={() => NavigationService.navigate("PaymentAdministration")}
            title={
              user?.last_phase === 5
                ? t("lanjut_proses")
                : t("detail_interview")
            }
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
            disabled={user?.last_phase < 5}
            withBorder={user?.last_phase >= 5}
          />
        </Card>
        <Space height={70} />
      </ScrollView>
    </View>
  );
};

export default ProfileMyProgressScreen;
