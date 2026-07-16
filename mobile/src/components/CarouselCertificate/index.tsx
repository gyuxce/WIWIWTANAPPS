import Button from "components/Button";
import Space from "components/Space";
import Text from "components/Text";
import colors from "configs/colors";
import icons from "configs/icons";
import React from "react";
import { useTranslation } from "react-i18next";
import { Dimensions, Linking, ScrollView } from "react-native";
import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel";
import { CertificationListType } from "types/CertificationTypes";
import { scaledHorizontal, scaledVertical } from "utils/ScaledService";

interface CarouselTrainingProps {
  carouselRef: ICarouselInstance | any;
  setCurrentIndex: (index: number) => void;
  listData: CertificationListType[];
}

const CarouselCertificate = ({
  carouselRef,
  setCurrentIndex,
  listData,
}: CarouselTrainingProps) => {
  const { width } = Dimensions.get("window");
  const { t } = useTranslation();
  return (
    <Carousel
      loop={false}
      ref={carouselRef}
      width={width - scaledHorizontal(50)}
      height={320}
      //style={{ height: "40%" }}
      autoPlay={false}
      data={listData}
      scrollAnimationDuration={2000}
      snapEnabled={false}
      enabled={false}
      onSnapToItem={index =>
        index < listData.length - 1 ? setCurrentIndex(index) : null
      }
      renderItem={({ item }) => (
        <ScrollView
          nestedScrollEnabled
          style={{
            marginHorizontal: scaledHorizontal(25),
          }}
          showsVerticalScrollIndicator={false}
        >
          <Space height={20} />
          <Text
            //numberOfLines={2}
            size={32}
            color={colors.accent}
            variant="OpificioNeueRegular"
            textAlign="center"
          >
            {item.name}
          </Text>
          <Text
            size={12}
            color={colors.black}
            textAlign="center"
            numberOfLines={2}
          >
            ({item.detail})
          </Text>
          <Space height={15} />
          <Text
            numberOfLines={6}
            size={12}
            color={colors.black}
            textAlign="center"
            style={{ marginHorizontal: scaledHorizontal(5), lineHeight: 18 }}
          >
            {item.description}
          </Text>
          <Space height={20} />
          <Button
            onPress={() => Linking.openURL(item?.link)}
            title={t("daftar_sekarang")}
            style={{
              paddingVertical: scaledVertical(20),
              width: "75%",
              alignSelf: "center",
            }}
            innerStyle={{
              justifyContent: "space-between",
              width: "90%",
            }}
            textType="bold"
            variant="CenturyGothicBold"
            textStyle={{ textAlign: "left" }}
            iconRight={icons.arrowRight}
            iconStyle={{ height: 16, width: 16, resizeMode: "contain" }}
          />
          <Space height={20} />
        </ScrollView>
      )}
    />
  );
};

export default CarouselCertificate;
