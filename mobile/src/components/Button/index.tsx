import React, { memo } from "react";
import type { ImageStyle, TextStyle, ViewStyle } from "react-native";
import { ActivityIndicator, Image, TouchableOpacity, View } from "react-native";
import color from "configs/colors";
import Text from "components/Text";

import styles from "./ButtonStyles";

interface Props {
  title?: string;
  type?: "dark" | "light" | "disabled";
  isLoading?: boolean;
  disabled?: boolean;
  icon?: any;
  onPress?: () => void;
  style?: ViewStyle | ViewStyle[];
  fontSize?: number;
  iconStyle?: ImageStyle | ImageStyle[];
  textStyle?: TextStyle | TextStyle[];
  textType?: "bold" | "reguler" | "light" | "extrabold";
  ButtonChange?: ViewStyle | ViewStyle[];
  numberOfLines?: number;
  withBorder?: boolean;
  iconRight?: any;
  innerStyle?: ViewStyle | ViewStyle[];
  variant?:
    | "CenturyGothicRegular"
    | "CenturyGothicBold"
    | "CenturyGothicItalic"
    | "OpificioNeueRegular";
}

const Component = ({
  ButtonChange,
  title,
  type = 'light',
  isLoading = false,
  icon,
  onPress,
  disabled = false,
  style,
  fontSize,
  iconStyle,
  textStyle,
  textType = "bold",
  numberOfLines,
  withBorder = true,
  iconRight,
  innerStyle,
  variant = "CenturyGothicRegular",
}: Props) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      disabled={disabled || isLoading}
      onPress={() => onPress && onPress()}
      style={[
        styles.container,

        // type === "disabled" && { backgroundColor: color.underlay },
        type === "light" &&
          !withBorder && {
            backgroundColor: color.white,
            borderWidth: 0,
          },
        type === "light" &&
          withBorder && {
            backgroundColor: color.white,
            borderWidth: 1,
            borderLeftWidth: 3,
            borderBottomWidth: 3,
          },
        disabled && { backgroundColor: color.stone200 },
        style,
        ButtonChange,
      ]}
    >
      {isLoading ? (
        <ActivityIndicator
          size={30}
          color={type === "light" ? color.black : color.white}
        />
      ) : (
        <View style={[styles.wrapTitle, innerStyle]}>
          {icon && <Image source={icon} style={[styles.icon, iconStyle]} />}

          <Text
            color={disabled ? color.stone400 : color.black}
            type={textType ? textType : "reguler"}
            size={fontSize || 14}
            style={textStyle}
            numberOfLines={numberOfLines}
            variant={variant}
          >
            {title}
          </Text>
          {iconRight && (
            <Image
              source={iconRight}
              style={[
                styles.icon,
                // {
                //   tintColor: type === "light" ? color.black : color.white,
                // },
                iconStyle,
              ]}
            />
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

export default memo(Component);
