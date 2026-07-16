import Space from "components/Space";
import Text from "components/Text";
import colors from "configs/colors";
import React from "react";
import { View, Image } from "react-native";
import type { ImageSourcePropType } from "react-native";
import { scaledHorizontal, scaledVertical } from "utils/ScaledService";

interface ListCarouselProps {
  dataTest: { title: string }[];
  imageHeader: ImageSourcePropType;
  imageTitle: ImageSourcePropType;
  title: string;
}

const ListCarousel = ({
  dataTest,
  imageHeader,
  imageTitle,
  title,
}: ListCarouselProps) => {
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
      }}
    >
      <Space height={25} />
      <Image
        source={imageHeader}
        style={{ width: 201, height: 160, resizeMode: "cover" }}
      />
      <Space height={20} />
      <Image
        source={imageTitle}
        style={{ width: 40, height: 40, resizeMode: "cover" }}
      />
      <Space height={10} />
      <Text size={20} color={colors.accent}>
        {title}
      </Text>
      <Space height={20} />
      {dataTest.map((item, index) => {
        return (
          <View
            key={index}
            style={{
              alignSelf: "flex-start",
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              marginLeft: 30,
              paddingBottom: scaledHorizontal(8),
            }}
          >
            <Text style={{ marginTop: scaledVertical(-2) }}>{"\u2022"}</Text>
            <Text size={12} variant="CenturyGothicBold" type="bold">
              {item.title}
            </Text>
          </View>
        );
      })}
      <Space height={20} />
    </View>
  );
};

export default ListCarousel;
