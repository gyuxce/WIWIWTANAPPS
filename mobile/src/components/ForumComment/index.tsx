import Card from "components/Card";
import Space from "components/Space";
import Text from "components/Text";
import colors from "configs/colors";
import icons from "configs/icons";
import React from "react";
import { Image, View, TouchableOpacity } from "react-native";
import NavigationService from "utils/NavigationService";
import type { ForumPostType } from "types/ForumTypes";
import { formatTimestamp } from "utils/Utils";
import { useAuth } from "hooks/useAuth";
import type { UserType } from "types/UserTypes";

import styles from "./styles";

type ForumCommentProps = {
  post?: ForumPostType;
  onlyView?: boolean;
};

const ForumComment = ({ post, onlyView = false }: ForumCommentProps) => {
  const { auth } = useAuth();
  return (
    <Card style={styles.card}>
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => {
            if (auth?.accessToken) {
              NavigationService.navigate("UserForumDetailScreen", {
                user: post?.user as UserType,
              });
            } else {
              NavigationService.navigate("LoginScreen");
            }
          }}
          style={styles.containerName}
        >
          <Image
            source={post?.user?.profilePicture?.url || icons.avatar}
            style={{ height: 28, width: 28, resizeMode: "contain" }}
          />
          <Text size={12} type="bold" variant="CenturyGothicBold">
            {post?.user?.name}
          </Text>
        </TouchableOpacity>
        <View
          style={{
            alignItems: "center",
          }}
        >
          <View style={{ alignItems: "center" }}>
            <Image
              source={icons.thumb}
              style={{ height: 16, width: 16, resizeMode: "contain" }}
            />
          </View>
          <Space height={5} />
          <Text size={10} type="bold" variant="CenturyGothicBold">
            {post?.count_like || 0}
          </Text>
        </View>
      </View>
      <Space height={15} />
      <TouchableOpacity
        disabled={onlyView}
        onPress={() => {
          if (auth?.accessToken) {
            NavigationService.navigate("ForumDetailScreen", {
              id: post?.id || "",
            });
          } else {
            NavigationService.navigate("LoginScreen");
          }
        }}
      >
        <Text type="bold" variant="CenturyGothicBold" numberOfLines={3}>
          {post?.title}
        </Text>
        <Space height={15} />
        <View style={{ flexDirection: "row", alignItems: "center" }}>
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
            {formatTimestamp(post?.updated_at || post?.created_at)}
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
      </TouchableOpacity>
    </Card>
  );
};

export default ForumComment;
