import fonts from "configs/fonts";
import type { ReactNode } from "react";
import React, { memo } from "react";
import type {
  NativeSyntheticEvent,
  TextLayoutEventData,
  TextStyle,
} from "react-native";
import { Text } from "react-native";

interface Props {
  children: ReactNode;
  style?: TextStyle | TextStyle[];
  numberOfLines?: number | undefined;
  onPress?: () => void;
  type?: "light" | "reguler" | "bold" | "extrabold";
  color?: string;
  size?: number;
  opacity?: number;
  lineHeight?: number;
  textAlign?: "left" | "center" | "right";
  variant?:
    | "CenturyGothicRegular"
    | "CenturyGothicBold"
    | "CenturyGothicItalic"
    | "OpificioNeueRegular";
  onTextLayout?: (e: NativeSyntheticEvent<TextLayoutEventData>) => void;
}

const Component = ({
  style,
  children,
  numberOfLines,
  onPress,
  type = "reguler",
  color = "#000",
  size = 16,
  opacity = 1,
  lineHeight,
  textAlign = "left",
  variant = "CenturyGothicRegular",
  onTextLayout,
}: Props) => {
  const _type = () => {
    if (variant === "CenturyGothicBold" && type === "bold") {
      return fonts.CenturyGothicBold;
    }

    if (variant === "OpificioNeueRegular") {
      return fonts.OpificioNeueRegular;
    }

    if (type === "reguler") {
      return fonts.CenturyGothicRegular;
    }

    return fonts.CenturyGothicRegular;
  };

  return (
    <Text
      onTextLayout={onTextLayout}
      style={[
        {
          fontFamily: `${_type()}`,
          color,
          fontSize: size,
          opacity,
          lineHeight,
          textAlign,
          letterSpacing: 0.5,
        },
        style,
      ]}
      lineBreakMode="tail"
      numberOfLines={numberOfLines}
      onPress={onPress}
    >
      {children}
    </Text>
  );
};

export default memo(Component);
