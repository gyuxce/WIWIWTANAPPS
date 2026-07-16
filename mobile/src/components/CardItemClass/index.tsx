import React, { memo } from "react";
import type { ImageSourcePropType, ViewStyle } from "react-native";
import { View, Image, StyleSheet } from "react-native";
import Card from "components/Card";
import Text from "components/Text";
import colors from "configs/colors";
import icons from "configs/icons";

interface Props {
  title: string;
  headLine: string;
  date: string;
  headLineColor?: string;
  image: ImageSourcePropType;
  style?: ViewStyle | ViewStyle[];
}

const CardItemClass = ({
  headLine,
  title,
  date,
  image,
  style,
  headLineColor = colors.orange,
}: Props) => (
  <Card style={{ padding: 12, flexDirection: "row", ...style }}>
    <Image style={{ height: 118, width: 92 }} source={image} />
    <View style={{ flex: 1, marginLeft: 12 }}>
      <View style={{ flex: 1 }}>
        <View style={[styles.wrapHeadline, { backgroundColor: headLineColor }]}>
          <Text
            size={10}
            type="bold"
            variant="CenturyGothicBold"
            color={colors.white}
          >
            {headLine}
          </Text>
        </View>
        <Text numberOfLines={2} size={20} color={colors.accent}>
          {title}
        </Text>
      </View>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Image
          source={icons.clock}
          style={{ height: 13, width: 13, marginRight: 4 }}
        />
        <Text size={12}>{date}</Text>
      </View>
    </View>
  </Card>
);

const styles = StyleSheet.create({
  wrapHeadline: {
    backgroundColor: colors.orange,
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 2,
    marginBottom: 8,
  },
});

export default memo(CardItemClass);
