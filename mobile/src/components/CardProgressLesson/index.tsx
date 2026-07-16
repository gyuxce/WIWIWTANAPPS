import { Image, Pressable, StyleSheet, View } from "react-native";
import Text from "components/Text";
import React, { memo } from "react";
import type { ImageSourcePropType, ViewStyle } from "react-native";
import colors from "configs/colors";

interface Props {
  title: string;
  progress?: number;
  total?: number;
  image: ImageSourcePropType;
  color?: string;
  style: ViewStyle | ViewStyle[];
  onPress?: () => void;
}

const CardProgressLesson = ({
  title,
  progress = 0,
  total = 0,
  image,
  color = colors.orange,
  style,
  onPress,
}: Props) => {
  const getPercentage = () => {
    if (total === 0) {
      return 0;
    }
    const result = (progress / total) * 100;
    return result.toFixed(0);
  };
  return (
    <Pressable style={[styles.wrapCard, style]} onPress={onPress}>
      <Image
        style={{ height: 80, width: 64, marginRight: 12, borderRadius: 10 }}
        source={image}
      />
      <View style={{ flex: 1 }}>
        <View style={styles.wrapTitle}>
          <Text numberOfLines={2} size={16} style={{ flex: 1 }}>
            {title}
          </Text>
          <View style={[styles.wrapPercentage, { backgroundColor: color }]}>
            <Text size={20} color={colors.white} variant="OpificioNeueRegular">
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
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View style={styles.wrapProgress}>
            <View
              style={[
                styles.progress,
                { backgroundColor: color, width: `${getPercentage()}%` },
              ]}
            />
          </View>
          <Text size={12} type="bold" variant="CenturyGothicBold">
            {`${progress} / ${total}`}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  wrapCard: {
    borderWidth: 0.5,
    width: "100%",
    borderRadius: 12,
    padding: 12,
    flexDirection: "row",
  },
  wrapTitle: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
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

export default memo(CardProgressLesson);
