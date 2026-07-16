import BoldBracketText from "components/BoldBracketText";
import Space from "components/Space";
import Text from "components/Text";
import colors from "configs/colors";
import icons from "configs/icons";
import images from "configs/images";
import React from "react";
import { View, Image, TouchableOpacity } from "react-native";
import { scaledHorizontal, scaledVertical } from "utils/ScaledService";
import { formatTimestamp } from "utils/Utils";

interface ForumNotificationProps {
  isReport?: boolean;
  isRead?: boolean;
  withUser?: boolean;
  text?: string;
  title?: string;
  created_at?: string;
  onPress?: (args: number, id: string, postId: string, text: string) => void;
  index?: number;
  id?: string;
  postId?: string;
}

const ForumNotification = ({
  isReport,
  isRead = true,
  withUser,
  text,
  title,
  created_at,
  onPress,
  index,
  id,
  postId,
}: ForumNotificationProps) => {
  return (
    <TouchableOpacity
      onPress={() =>
        onPress && onPress(index || 0, id || "", postId || "", text || "")
      }
      style={{
        backgroundColor: colors.white,
        paddingHorizontal: scaledHorizontal(25),
        paddingVertical: scaledHorizontal(20),
      }}
    >
      <Text size={16} type="bold" variant="CenturyGothicBold">
        {title}
      </Text>
      <Space height={20} />
      <View style={{ flexDirection: "row", gap: 10 }}>
        <View
          style={{
            padding: 8,
            borderRadius: 100,
            marginLeft: 3,
          }}
        >
          <Image
            source={isReport ? icons.flag : icons.message}
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
                //top: -1,
              }}
            />
          )}
        </View>
        <View style={{ flex: 1 }}>
          <BoldBracketText
            text={
              isReport
                ? "[Postingan] anda mendapat peringatan dari Admin. [Mengandung konten yang menyudutkan satu pihak]"
                : text || ""
            }
          />
          <Space height={5} />
          <Text size={10} color={colors.stone500}>
            {formatTimestamp(created_at)}
          </Text>
        </View>
      </View>
      {withUser ? (
        <View>
          <Space height={20} />
          <View style={{ flexDirection: "row", gap: 10 }}>
            <View
              style={{
                padding: 2,
                borderWidth: 1,
                borderColor: colors.black,
                borderRadius: 40 / 2,
                height: 40,
              }}
            >
              <Image
                source={images.avatar}
                style={{
                  height: 34,
                  width: 34,
                  resizeMode: "contain",
                  borderRadius: 34 / 2,
                }}
              />
            </View>
            <View style={{ marginTop: 2, flex: 1 }}>
              <View style={{ flexDirection: "row", gap: 5 }}>
                <Text size={12} type="bold" variant="CenturyGothicBold">
                  Domingo Flores
                </Text>
                <Text
                  size={10}
                  color={colors.stone500}
                  style={{ marginTop: scaledVertical(4) }}
                >
                  {formatTimestamp(created_at)}
                </Text>
              </View>
              <Space height={3} />
              <Text size={12}>
                Saya akan mengunjungi Ginza besok! Ada rekomendasi tempat makan
                yang bagus di sana?
              </Text>
            </View>
          </View>
        </View>
      ) : null}
    </TouchableOpacity>
  );
};

export default ForumNotification;
