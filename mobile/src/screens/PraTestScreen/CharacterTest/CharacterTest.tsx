import Card from "components/Card";
import React from "react";
import { scaledHorizontal } from "utils/ScaledService";

import { IntroductionType } from "types/ExamTypes";
import Text from "components/Text";
import Space from "components/Space";
import colors from "configs/colors";
import fonts from "configs/fonts";
import { useWindowDimensions, View } from "react-native";
import RenderHTML from "react-native-render-html";
import WebView from "react-native-webview";
import { usePersist } from "hooks/usePersist";

interface CharacterTestProps {
  data: IntroductionType;
}
const CharacterTest = ({ data }: CharacterTestProps) => {
  const { width } = useWindowDimensions();
  const { language } = usePersist();

  return (
    <Card style={{ marginHorizontal: scaledHorizontal(25), flex: 1 }}>
      {data?.introduction?.map((item, index) => {
        return (
          <View key={index} style={{ flexDirection: "column" }}>
            <View
              style={{
                paddingVertical: 4,
                paddingHorizontal: 7,
                backgroundColor: colors.red,
                borderRadius: 4,
                alignSelf: "center",
              }}
            >
              <Text
                size={16}
                color={colors.white}
                type="bold"
                variant="CenturyGothicBold"
              >
                {index + 1}
              </Text>
            </View>
            <Space height={10} />
            <View
              style={{
                alignSelf: "center",
                borderRadius: 10,
                paddingVertical: 5,

                flex: 1,
              }}
            >
              <Text
                size={16}
                color={colors.accent}
                type="bold"
                variant="CenturyGothicBold"
                textAlign={"center"}
                style={{
                  marginHorizontal: scaledHorizontal(10),
                }}
              >
                {item?.child?.[language === "id" ? 0 : 1]?.title}
              </Text>
            </View>
            <View>
              <RenderHTML
                contentWidth={width - 40}
                enableCSSInlineProcessing={true}
                source={{
                  html:
                    item?.child?.[language === "id" ? 0 : 1]?.description || "",
                }}
                tagsStyles={{
                  p: {
                    color: colors.black,
                    fontFamily: fonts.CenturyGothicRegular,
                    fontSize: 12,
                    textAlign: "left",
                    marginVertical: 0,
                    paddingHorizontal: 10,
                  },
                  li: {
                    color: colors.black,
                    fontFamily: fonts.CenturyGothicRegular,
                    fontSize: 12,
                    marginBottom: 4,
                    lineHeight: 18,
                    paddingLeft: 4,
                    paddingRight: 8,
                  },
                  ul: {
                    margin: 0,
                  },
                }}
                WebView={WebView}
                systemFonts={[fonts.CenturyGothicRegular]}
              />
            </View>
            <Space height={20} />
          </View>
        );
      })}
    </Card>
  );
};

export default CharacterTest;
