import Text from "components/Text";
import colors from "configs/colors";
import icons from "configs/icons";
import React from "react";
import { Image, TouchableOpacity, View } from "react-native";
import { scaledHorizontal } from "utils/ScaledService";
import Space from "components/Space";
import type { ForumPostType } from "types/ForumTypes";
import { formatTimestamp } from "utils/Utils";

import styles from "./styles";
import images from "configs/images";
interface ForumHeaderProps {
  onPressSetting: () => void;
  post: ForumPostType;
}

const ForumHeader = ({ onPressSetting, post }: ForumHeaderProps) => {
  return (
    <View>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View style={{ flexDirection: "row" }}>
          <View style={styles.containerName}>
            <View style={styles.containerImage}>
              <Image
                source={
                  post?.user?.profilePicture
                    ? { uri: post?.user?.profilePicture.url }
                    : images.userDefault
                }
                style={styles.imageAvatar}
              />
            </View>
          </View>
          <View
            style={{
              marginLeft: scaledHorizontal(15),
              alignSelf: "center",
            }}
          >
            <Text
              color={colors.black}
              size={14}
              numberOfLines={1}
              type="bold"
              variant={"CenturyGothicBold"}
            >
              {post?.user?.name}
            </Text>
          </View>
        </View>
        <TouchableOpacity style={{ top: -5 }} onPress={onPressSetting}>
          <Image
            source={icons.report}
            style={{
              height: 28,
              width: 28,
              resizeMode: "contain",
            }}
          />
        </TouchableOpacity>
      </View>
      <Space height={10} />
      <View>
        <Text type="bold" variant="CenturyGothicBold">
          {post?.title}
        </Text>
        <Space height={12} />
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View style={{ alignItems: "center" }}>
            <Image
              source={icons.likeBorder}
              style={{ height: 16, width: 16, resizeMode: "contain" }}
            />
          </View>
          <Text
            size={10}
            style={{ marginLeft: 5, marginRight: 10 }}
            type="bold"
            variant="CenturyGothicBold"
          >
            {post?.count_like || 0}
          </Text>
          <View style={{ alignItems: "center" }}>
            <Image
              source={icons.comment}
              style={{ height: 16, width: 16, resizeMode: "contain" }}
            />
          </View>
          <Text
            size={10}
            style={{ marginLeft: 5 }}
            type="bold"
            variant="CenturyGothicBold"
          >
            {post?.count_comment || 0}
          </Text>
          <Text
            size={10}
            style={{ fontWeight: "400", marginLeft: 12 }}
            color={colors.zinc500}
          >
            {formatTimestamp(post?.created_at)}
          </Text>
          <View style={styles.categoryContainer}>
            <Text
              size={10}
              type="bold"
              variant="CenturyGothicBold"
              color={colors.black}
              textAlign="center"
            >
              {post?.topic?.name}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default ForumHeader;
