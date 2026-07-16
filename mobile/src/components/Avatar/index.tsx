import React, { memo } from "react";
import type { ImageSourcePropType, ViewStyle } from "react-native";
import { Image, View } from "react-native";

interface Props {
  size?: number;
  image: ImageSourcePropType;
  borderRadius?: number;
  style?: ViewStyle | ViewStyle[];
}

const Avatar = ({ 
  size = 120, 
  image, 
  style, 
  borderRadius = 999
}: Props) => (
  <View
    style={[
      {
        borderRadius: borderRadius,
        overflow: "hidden",
        borderWidth: 2,
        padding: 2,
      },
      style,
    ]}
  >
    <Image
      source={image}
      style={{
        height: size,
        width: size,
        borderRadius: borderRadius,
      }}
    />
  </View>
);

export default memo(Avatar);