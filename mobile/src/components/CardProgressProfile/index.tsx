import { StyleSheet, View } from "react-native";
import Text from "components/Text";
import React, { memo } from "react";
import type {
  DimensionValue,
  ImageSourcePropType,
  ViewStyle,
} from "react-native";
import colors from "configs/colors";
import Avatar from "components/Avatar";
import Space from "components/Space";

interface Props {
  name: string;
  nameJapan: string;
  progress?: number;
  total?: number;
  image: ImageSourcePropType;
  color?: string;
  style?: ViewStyle | ViewStyle[];
}
const CardProgressProfile = ({
  name,
  nameJapan,
  progress = 0,
  total = 0,
  image,
  color = colors.orange,
  style,
}: Props) => {
  const safeProgress = Number.isFinite(Number(progress)) ? Number(progress) : 0;
  const safeTotal = Number.isFinite(Number(total)) ? Number(total) : 0;

  const getPercentage = () => {
    if (safeTotal <= 0) {
      return 0;
    }
    const result = (safeProgress / safeTotal) * 100;
    return Math.min(Math.max(Math.round(result), 0), 100);
  };
  return (
    <View style={[styles.wrapCard, style]}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View style={{ flexDirection: "row", flex: 1 }}>
          <Avatar image={image} size={40} style={{ borderWidth: 1 }} />
          <View style={{ marginLeft: 8, justifyContent: "center" }}>
            <Text color={colors.red} type="bold" variant="CenturyGothicBold">
              {name}
            </Text>
            <Space height={4} />
            <Text color={colors.accent} size={12}>
              {nameJapan}
            </Text>
          </View>
        </View>
        <View style={[styles.wrapPercentage, { backgroundColor: color }]}>
          <Text color={colors.white} variant="OpificioNeueRegular">
            {getPercentage()}
            <Text
              type="bold"
              variant="CenturyGothicBold"
              color={colors.white}
              size={10}
            >
              %
            </Text>
          </Text>
        </View>
      </View>
      <Space height={8} />
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View style={styles.wrapProgress}>
          <View
            style={[
              styles.progress,
              {
                backgroundColor: color,
                width: `${getPercentage()}%` as DimensionValue,
              },
            ]}
          />
        </View>
        <Text size={12} type="bold" variant="CenturyGothicBold">
          {`${safeProgress} / ${safeTotal}`}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapCard: {
    borderWidth: 0.5,
    width: "100%",
    borderRadius: 12,
    padding: 12,
  },
  wrapPercentage: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    alignSelf: "flex-start",
    borderRadius: 8,
  },
  wrapProgress: {
    flex: 1,
    backgroundColor: colors.stone300,
    height: 8,
    marginRight: 12,
    borderRadius: 6,
  },
  progress: {
    height: 8,
    borderRadius: 6,
  },
});

export default memo(CardProgressProfile);
