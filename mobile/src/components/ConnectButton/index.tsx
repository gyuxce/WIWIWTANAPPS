import { Image, Pressable, View } from "react-native";
import type { ImageSourcePropType, ImageStyle, TextStyle } from "react-native";
import Button from "components/Button";
import colors from "configs/colors";
import React, { memo } from "react";
import Text from "components/Text";
import icons from "configs/icons";
import { useTranslation } from "react-i18next";

interface Props {
  title?: string;
  isConnect?: boolean;
  height: number;
  width: number;
  icon: ImageSourcePropType;
  textStyle?: TextStyle | TextStyle[];
  onPress?: () => void;
  onPressDisconnect?: () => void;
  iconStyle?: ImageStyle | ImageStyle[];
  iconSize?: Number;
}

const ConnectButton = ({
  title = "Title",
  icon,
  height,
  width,
  textStyle,
  isConnect = false,
  onPress,
  onPressDisconnect,
  iconStyle,
  iconSize = 20
}: Props) => {
  const { t } = useTranslation();
  return (
    <>
      {isConnect ? (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            backgroundColor: colors.stone50,
            width: 220,
            height: 32,
            alignItems: "center",
            paddingHorizontal: 12,
            borderRadius: 8,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image
              source={icon}
              style={{
                width: width - 4,
                height: height - 4,
                marginRight: 12,
              }}
            />
            <Text size={12}>{t("terkoneksi")}</Text>
          </View>
          <Pressable onPress={onPressDisconnect}>
            <Image
              source={icons.trash}
              style={{ width: width - 4, height: height - 4 }}
            />
          </Pressable>
        </View>
      ) : (
        <Button
          title={title}
          style={[
            {
              borderWidth: 0.5,
              borderRadius: 6,
              backgroundColor: colors.white,
              height: 40,
              width: 220,
              justifyContent: "center",
            },
          ]}
          textType="bold"
          variant="CenturyGothicBold"
          textStyle={textStyle}
          withBorder={false}
          icon={icon}
          iconStyle={{
            width: width,
            height: height,
            marginRight: 12,
            ...iconStyle,
          }}
          onPress={onPress}
        />
      )}
    </>
  );
};

export default memo(ConnectButton);
