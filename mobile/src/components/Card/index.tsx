import React from "react";
import type { ViewStyle } from "react-native";
import { View } from "react-native";

interface CardProps {
  children: any;
  style?: ViewStyle | ViewStyle[];
}

const Card = ({ children, style }: CardProps) => {
  return (
    <View
      style={[
        { backgroundColor: "white", borderRadius: 12, padding: 16 },
        style,
      ]}
    >
      {children}
    </View>
  );
};

export default Card;
