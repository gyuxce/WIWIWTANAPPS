import Space from "components/Space";
import Text from "components/Text";
import colors from "configs/colors";
import React from "react";
import { useTranslation } from "react-i18next";
import { Image, View } from "react-native";

interface ForumTopicProps {
  totalDiscussion: number;
  title: string;
  subtitle: string;
  image: any;
}

const ForumTopic = ({
  totalDiscussion,
  title,
  subtitle,
  image,
}: ForumTopicProps) => {
  const { t } = useTranslation();
  return (
    <View style={{ flexDirection: "row", gap: 15 }}>
      <Image
        source={image}
        style={{ height: 38, width: 38, resizeMode: "contain" }}
      />
      <View style={{ flex: 1 }}>
        <Text type="bold" variant="CenturyGothicBold">
          {title}
        </Text>
        <Space height={3} />
        <Text size={10}>{subtitle}</Text>
        <Space height={8} />
        <View
          style={{
            flexDirection: "row",
            borderRadius: 4,
          }}
        >
          <Text
            size={12}
            type="bold"
            variant="CenturyGothicBold"
            style={{
              backgroundColor: colors.stone100,
              borderRadius: 4,
              paddingVertical: 5,
              paddingHorizontal: 8,
              overflow: "hidden",
            }}
          >
            {totalDiscussion}{" "}
            <Text size={12} type="reguler">
              {t("diskusi")}
            </Text>
          </Text>
        </View>
      </View>
    </View>
  );
};

export default ForumTopic;
