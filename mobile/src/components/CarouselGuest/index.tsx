import React from "react";
import { View, Dimensions } from "react-native";
import type { ICarouselInstance } from "react-native-reanimated-carousel";
import Carousel from "react-native-reanimated-carousel";
import { scaledHorizontal } from "utils/ScaledService";

interface CarouselGuestProps {
  carouselRef: ICarouselInstance | any;
  setCurrentIndex: (index: number) => void;
  listComponent: { component: any }[];
}

const CarouselGuest = ({
  carouselRef,
  setCurrentIndex,
  listComponent,
}: CarouselGuestProps) => {
  const { width } = Dimensions.get("window");

  return (
    <Carousel
      loop={false}
      ref={carouselRef}
      width={width - scaledHorizontal(50)}
      height={390}
      autoPlay={false}
      data={listComponent}
      scrollAnimationDuration={2000}
      snapEnabled={false}
      enabled={false}
      onSnapToItem={index =>
        index < listComponent.length - 1 ? setCurrentIndex(index) : null
      }
      renderItem={({ item }) => (
        <View style={{ flex: 1, marginHorizontal: scaledHorizontal(25) }}>
          {item?.component}
        </View>
      )}
    />
  );
};

export default CarouselGuest;
