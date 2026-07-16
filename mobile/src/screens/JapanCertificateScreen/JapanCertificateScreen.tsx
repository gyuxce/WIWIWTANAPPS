import Button from "components/Button";
import Card from "components/Card";
import Header from "components/Header";
import SectionWithCheck from "components/SectionWithCheck/SectionWithCheck";
import Space from "components/Space";
import colors from "configs/colors";
import icons from "configs/icons";
import images from "configs/images";
import { useCertification } from "hooks/useCertification";
import React, { useEffect, useState } from "react";
import { View, ScrollView, Platform, RefreshControl } from "react-native";
import { ICarouselInstance } from "react-native-reanimated-carousel";
import globalStyles from "utils/GlobalStyles";
import { scaledHorizontal } from "utils/ScaledService";
import TestCertification from "./TestCertification/TestCertification";
import ReviewCertification from "./ReviewCertification/ReviewCertification";
import { useAuth } from "hooks/useAuth";
import { useUser } from "hooks/useUser";
import { useNavigation } from "@react-navigation/core";
import { useTranslation } from "react-i18next";

const JapanCertificateScreen = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { t } = useTranslation();
  const navigation = useNavigation();
  const carouselRef = React.useRef<ICarouselInstance>(null);
  const {
    certificationList,
    getCertificationList,
    getCertificationUser,
    certificationUser,
  } = useCertification();
  const { user } = useAuth();
  const { getUserAdmin, openAdminWhatsapp } = useUser();
  const [sectionCertificate, setSectionCertificate] = useState({
    title: "Daftar Sertifikasi",
    id: "CertificationTest",
  });
  const [isLoading, setIsLoading] = useState(false);
  const dataSertifikasi = [
    {
      title: t("daftar_sertifikasi"),
      isChecklist: certificationUser?.length > 0 ? true : false,
    },
    { title: t("review_kelulusan"), isChecklist: user?.last_phase === 5 },
  ];
  const section = [
    {
      title: t("daftar_sertifikasi"),
      id: "CertificationTest",
    },
    {
      title: t("review_kelulusan"),
      id: "CertificationReview",
    },
  ];

  useEffect(() => {
    navigation.addListener("focus", () => {
      initialData();
    });
  }, []);

  const onPressTest = (section: { title: string; id: string }) => {
    if (section.id !== sectionCertificate.id) {
      setSectionCertificate(section);
    }
  };

  const initialData = () => {
    getCertificationList({
      type: "collection",
      options: [["filter,status,equal,1"]],
    }).then(() => {
      getCertificationUser({
        type: "collection",
        relations: ["file"],
      });
      setIsLoading(false);
      getUserAdmin();
    });
  };
  return (
    <View style={globalStyles().topSafeArea}>
      <Space height={Platform.OS === "android" ? 15 : 0} />
      <Header
        withTextTitle
        textTitleJapanLeft="日本語能力認定書"
        textTitleLeft="Sertifikasi Bahasa Jepang"
        withBurger
        withBell
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={initialData} />
        }
      >
        <Space height={15} />
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
        </Card>
        <Space height={25} />
        <View
          style={{
            marginHorizontal: scaledHorizontal(25),
            flexDirection: "row",
            gap: 5,
          }}
        >
          {section.map((item, index) => {
            return (
              <Button
                key={index}
                onPress={() => onPressTest(item)}
                title={item.title}
                style={{
                  borderWidth: sectionCertificate.id === item.id ? 1 : 0,
                  flex: 1,
                  borderRadius: 6,
                  paddingVertical: 8,
                  backgroundColor:
                    sectionCertificate.id === item.id
                      ? colors.white
                      : colors.stone100,
                }}
                textType="bold"
                variant="CenturyGothicBold"
                textStyle={{ fontWeight: "600", fontSize: 12 }}
                withBorder={false}
              />
            );
          })}
        </View>
        <Space height={30} />
        {sectionCertificate.id === "CertificationTest" && (
          <TestCertification
            carouselRef={carouselRef}
            currentIndex={currentIndex}
            setCurrentIndex={setCurrentIndex}
            certificationList={certificationList}
          />
        )}
        {sectionCertificate.id === "CertificationReview" && (
          <ReviewCertification
            certificationUser={certificationUser}
            openAdminWhatsapp={() => openAdminWhatsapp(false)}
            certificationList={certificationList}
          />
        )}
        <Space height={110} />
      </ScrollView>
    </View>
  );
};

export default JapanCertificateScreen;
