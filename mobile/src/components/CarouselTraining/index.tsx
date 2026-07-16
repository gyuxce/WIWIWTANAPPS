import Space from "components/Space";
import Text from "components/Text";
import colors from "configs/colors";
import React from "react";
import { Dimensions, View } from "react-native";
import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel";
import { scaledHorizontal } from "utils/ScaledService";

interface CarouselTrainingProps {
  carouselRef: ICarouselInstance | any;
  setCurrentIndex: (index: number) => void;
  listData: { title: string; subtitle: string; description: string }[];
}

const CarouselTraining = ({
  carouselRef,
  setCurrentIndex,
  listData,
}: CarouselTrainingProps) => {
  const { width } = Dimensions.get("window");
  return (
    <Carousel
      loop={false}
      ref={carouselRef}
      width={width - scaledHorizontal(50)}
      height={240}
      autoPlay={false}
      data={listData}
      scrollAnimationDuration={2000}
      snapEnabled={false}
      enabled={false}
      onSnapToItem={index =>
        index < listData.length - 1 ? setCurrentIndex(index) : null
      }
      renderItem={({ item }) => (
        <View style={{ flex: 1, marginHorizontal: scaledHorizontal(25) }}>
          <Space height={20} />
          <Text
            size={32}
            color={colors.accent}
            variant="OpificioNeueRegular"
            textAlign="center"
          >
            {item.title}
          </Text>
          <Text size={12} color={colors.black} textAlign="center">
            {item.subtitle}
          </Text>
          <Space height={30} />
          <Text
            size={12}
            color={colors.black}
            textAlign="center"
            style={{ marginHorizontal: scaledHorizontal(5), lineHeight: 18 }}
          >
            {item.description}
          </Text>
        </View>
      )}
    />
  );
};

export default CarouselTraining;
