import Card from "components/Card";
import CarouselCertificate from "components/CarouselCertificate";
import Options from "components/CarouselGuest/Options";
import Space from "components/Space";
import Text from "components/Text";
import colors from "configs/colors";
import images from "configs/images";
import React from "react";
import { useTranslation } from "react-i18next";
import { Image, View } from "react-native";
import { CertificationListType } from "types/CertificationTypes";
import { scaledHorizontal } from "utils/ScaledService";

interface TestCertificationProps {
  carouselRef: any;
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  certificationList: CertificationListType[];
}

const TestCertification = ({
  carouselRef,
  currentIndex,
  setCurrentIndex,
  certificationList,
}: TestCertificationProps) => {
  const { t } = useTranslation();
  return (
    <Card
      style={{
        marginHorizontal: scaledHorizontal(25),
        alignItems: "center",
      }}
    >
      {certificationList?.length > 0 ? (
        <View style={{ alignItems: "center" }}>
          <Text
            size={30}
            color={colors.accent}
            variant="OpificioNeueRegular"
            type="reguler"
            textAlign="center"
          >
            {t("sertifikasi_bahasa_jepang")}
          </Text>
          <Space height={30} />

          <Image
            source={images.certification}
            style={{ height: 160, width: 200, resizeMode: "contain" }}
          />
          <CarouselCertificate
            carouselRef={carouselRef}
            setCurrentIndex={setCurrentIndex}
            listData={certificationList}
          />

          <Options
            carouselRef={carouselRef}
            currentIndex={currentIndex}
            guestList={certificationList || []}
            setCurrentIndex={setCurrentIndex}
          />
        </View>
      ) : (
        <View>
          <Image
            source={images.certificationLaptop}
            style={{ height: 160, width: 200, resizeMode: "contain" }}
          />
          <Text
            size={24}
            color={colors.accent}
            variant="OpificioNeueRegular"
            type="reguler"
            textAlign="center"
          >
            {t("sertifikasi_tidak_tersedia")}
          </Text>
        </View>
      )}

      {/*  */}
    </Card>
  );
};

export default TestCertification;
