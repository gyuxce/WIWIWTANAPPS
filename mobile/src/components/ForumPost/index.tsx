import Space from "components/Space";
import Text from "components/Text";
import icons from "configs/icons";
import images from "configs/images";
import React from "react";
import { View, Image } from "react-native";
import { ForumPostType } from "types/ForumTypes";
import { scaledVertical } from "utils/ScaledService";

interface ForumPostProps {
  post: ForumPostType;
}

const ForumPost = ({ post }: ForumPostProps) => {
  return (
    <View
      style={{
        flexDirection: "row",
        gap: 10,
        marginBottom: scaledVertical(15),
      }}
    >
      <View style={{ marginTop: 2 }}>
        <View>
          <Image
            source={icons.likeBorder}
            style={{ height: 16, width: 16, resizeMode: "contain" }}
          />
        </View>
        <Space height={5} />
        <Text
          size={12}
          type="bold"
          variant="CenturyGothicBold"
          textAlign="center"
        >
          {post?.count_like}
        </Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text type="bold" variant="CenturyGothicBold">
          {post?.title}
        </Text>
        <Space height={10} />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            flex: 1,
          }}
        >
          <Image
            source={
              post?.user?.profilePicture
                ? { uri: post?.user?.profilePicture.url }
                : images.userDefault
            }
            style={{
              height: 20,
              width: 20,
              resizeMode: "contain",
              borderRadius: 10,
            }}
          />
          <Space width={10} />

          <Text
            size={10}
            type="bold"
            variant="CenturyGothicBold"
            numberOfLines={1}
            style={{ flexShrink: 1 }}
          >
            {post?.user?.name}
          </Text>

          <Space width={15} />
          <View style={{ flexDirection: "row" }}>
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
              {post?.count_comment}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default ForumPost;
