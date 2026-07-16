import BoldBracketText from "components/BoldBracketText";
import Space from "components/Space";
import Text from "components/Text";
import colors from "configs/colors";
import React from "react";
import { View, Image, TouchableOpacity } from "react-native";
import { scaledHorizontal } from "utils/ScaledService";
import { formatTimestamp } from "utils/Utils";

interface PriorityNotificationProps {
  iconType?: any | string;
  isRead?: boolean;
  text: string;
  date: string;
  onPress: () => void;
}

const PriorityNotification = ({
  iconType,
  isRead = true,
  text,
  date,
  onPress,
}: PriorityNotificationProps) => {
  return (
    <TouchableOpacity
      style={{
        paddingHorizontal: scaledHorizontal(25),
      }}
      onPress={onPress}
    >
      <Space height={10} />
      <View style={{ flexDirection: "row", gap: 10 }}>
        <View
          style={{
            padding: 8,
            borderRadius: 100,
            marginLeft: 3,
            backgroundColor: colors.white,
            height: 40,
            justifyContent: "center",
          }}
        >
          <Image
            source={iconType}
            style={{
              height: 24,
              width: 24,
              resizeMode: "contain",
              marginTop: 2,
            }}
          />
          {!isRead && (
            <View
              style={{
                width: 12,
                height: 12,
                position: "absolute",
                backgroundColor: colors.red,
                borderRadius: 100,
                left: -2,
                top: 0,
              }}
            />
          )}
        </View>
        <View style={{ flex: 1 }}>
          <BoldBracketText text={text} />
          <Space height={5} />
          <Text size={10} color={colors.stone500}>
            {formatTimestamp(date)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default PriorityNotification;
