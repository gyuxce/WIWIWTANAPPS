import Space from "components/Space";
import Text from "components/Text";
import colors from "configs/colors";
import { usePersist } from "hooks/usePersist";
import React from "react";
import { Image, View } from "react-native";
import { scaledHorizontal } from "utils/ScaledService";

interface InterviewCardProps {
  titleJapan?: string;
  image: any;
  title?: string;
  subtitle?: string;
}

const InterviewCard = ({
  title,
  titleJapan,
  subtitle,
  image,
}: InterviewCardProps) => {
  const { language } = usePersist();

  return (
    <View
      style={{
        alignItems: "center",
      }}
    >
      <Space height={40} />
      <View style={{ flex: 1 }}>
        {language === "id" ? (
          <>
            <Text
              size={24}
              color={colors.black}
              variant="OpificioNeueRegular"
              type="reguler"
              textAlign="center"
            >
              Status Wawancara
            </Text>
            <Space height={5} />
            <View
              style={{
                height: 1,
                //width: 10,
                backgroundColor: colors.black,
              }}
            />
            <Space height={5} />
            <Text size={24} style={{ fontWeight: "400" }} textAlign="center">
              面接の進捗
            </Text>
          </>
        ) : (
          <>
            <Text
              size={24}
              color={colors.black}
              variant="OpificioNeueRegular"
              type="reguler"
              textAlign="center"
            >
              面接の進捗
            </Text>
            <Space height={5} />
          </>
        )}
      </View>

      <Space height={30} />

      <Image
        source={image}
        style={{ height: 200, width: 200, resizeMode: "contain" }}
      />
      <Space height={10} />
      <Text
        size={24}
        type="bold"
        variant="OpificioNeueRegular"
        color={colors.accent}
        style={{ marginHorizontal: scaledHorizontal(30) }}
      >
        {titleJapan}
      </Text>
      {language === "id" && (
        <>
          <Space height={5} />
          <Text
            color={colors.accent}
            type="bold"
            variant={"CenturyGothicBold"}
            textAlign="center"
            style={{ marginHorizontal: scaledHorizontal(30) }}
          >
            {title}
          </Text>
        </>
      )}
      <Space height={10} />
      <Text
        size={12}
        lineHeight={18}
        textAlign="center"
        style={{ marginHorizontal: scaledHorizontal(30) }}
      >
        {subtitle}
      </Text>
    </View>
  );
};

export default InterviewCard;
