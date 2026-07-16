import Button from "components/Button";
import icons from "configs/icons";
import React from "react";
import type { ICarouselInstance } from "react-native-reanimated-carousel";

interface OptionsProps {
  carouselRef: ICarouselInstance | any;
  currentIndex: number;
  guestList: any[];
  setCurrentIndex: (currentIndex: number) => void;
}

const Options = ({
  carouselRef,
  currentIndex,
  guestList,
  setCurrentIndex,
}: OptionsProps) => {
  return (
    <>
      {currentIndex !== 0 ? (
        <Button
          onPress={() => {
            carouselRef.current?.scrollTo({ count: -1, animated: true });
            setCurrentIndex(currentIndex - 1);
          }}
          style={{
            paddingHorizontal: 4,
            paddingVertical: 7,
            position: "absolute",
            left: 20,
            top: 265,
          }}
          icon={icons.arrowLeft}
          iconStyle={{ height: 20, width: 20, resizeMode: "contain" }}
        />
      ) : null}

      {currentIndex !== guestList.length - 1 ? (
        <Button
          onPress={() => {
            carouselRef.current?.scrollTo({ count: 1, animated: true });
            setCurrentIndex(currentIndex + 1);
          }}
          style={{
            paddingHorizontal: 4,
            paddingVertical: 7,
            position: "absolute",
            right: 20,
            top: 265,
          }}
          icon={icons.arrowRight}
          iconStyle={{ height: 20, width: 20, resizeMode: "contain" }}
        />
      ) : null}
    </>
  );
};

export default Options;
