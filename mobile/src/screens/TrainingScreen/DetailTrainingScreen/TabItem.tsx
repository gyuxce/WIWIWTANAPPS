import { StyleSheet, Pressable } from "react-native";
import React from "react";
import Text from "components/Text";
import colors from "configs/colors";

interface Props {
  title: string;
  progress: number;
  total: number;
  isSelected: boolean;
  onPress: () => void;
}

const TabDetail = ({ title, progress, total, isSelected, onPress }: Props) => {
  return (
    <Pressable
      style={[
        styles.wrapItem,
        isSelected && {
          backgroundColor: colors.white,
          borderColor: colors.black,
        },
      ]}
      onPress={onPress}
    >
      <Text size={12} type="bold" variant="CenturyGothicBold">
        {title}
      </Text>
      <Text size={10}>{`${progress}/${total}`}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  wrapItem: {
    flex: 1,
    borderRadius: 8,
    height: 58,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 0.5,
    borderColor: "transparent",
  },
});

export default TabDetail;
