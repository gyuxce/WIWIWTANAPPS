import Space from "components/Space";
import Text from "components/Text";
import colors from "configs/colors";
import React from "react";
import { View, useWindowDimensions } from "react-native";
import { scaledHorizontal, scaledVertical } from "utils/ScaledService";
import RenderHTML from "react-native-render-html";
import fonts from "configs/fonts";
import WebView from "react-native-webview";

import styles from "./styles";
import { t } from "i18next";

interface SectionInfoProps {
  index: number;
  title?: string;
  subtitle?: any[];
  dataLength: number;
  isInline?: boolean;
  withBullet?: boolean;
  textAlign?: any;
  withOption?: boolean;
  textOption?: string;
  alignParagraph?: "center" | "left" | "right";
  withSubBullet?: boolean;
  textColor?: string;
  titleBackground?: string;
  isCustom?: boolean;
  isHtml?: boolean;
  htmlContent?: string;
  withIndexNumber?: boolean;
}

const SectionInfo = ({
  index,
  title,
  subtitle = [],
  dataLength,
  isInline = false,
  textAlign = "center",
  withBullet = true,
  withOption = false,
  textOption,
  alignParagraph = "left",
  textColor = colors.accent,
  titleBackground = colors.white,
  isCustom = false,
  isHtml = false,
  htmlContent = "",
  withIndexNumber = true,
}: SectionInfoProps) => {
  const makeTextBold = (text: string) => {
    const parts = text.split("30 menit");
    return (
      <>
        {parts[0]}
        <Text size={12} style={{ fontWeight: "bold" }}>
          30 {t("menit")}
        </Text>
        {parts[1]}
      </>
    );
  };
  const { width } = useWindowDimensions();
  return (
    <View
      key={index}
      style={{
        marginBottom: dataLength - 1 !== index ? 32 : 0,
      }}
    >
      <View style={{ flexDirection: isInline ? "row" : "column" }}>
        {title ? (
          <View>
            {withOption ? (
              <View
                style={{
                  backgroundColor: colors.stone100,
                  alignSelf: "center",
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                  borderRadius: 7,
                }}
              >
                <Text
                  size={12}
                  color={colors.black}
                  variant="OpificioNeueRegular"
                  textAlign="center"
                  style={{ fontWeight: "400" }}
                >
                  {t("opsi")} {textOption ? textOption : index + 1}
                </Text>
              </View>
            ) : withIndexNumber ? (
              <View style={styles.containerNumber}>
                <Text
                  size={16}
                  color={colors.white}
                  type="bold"
                  variant="CenturyGothicBold"
                >
                  {index + 1}
                </Text>
              </View>
            ) : null}
            <Space height={15} />
            <View
              style={{
                alignSelf: "center",
                borderRadius: 10,
                paddingVertical: 5,
                backgroundColor: titleBackground,
                flex: 1,
              }}
            >
              <Text
                size={16}
                color={textColor}
                type="bold"
                variant="CenturyGothicBold"
                textAlign={textAlign}
                style={{
                  marginHorizontal: scaledHorizontal(10),
                }}
              >
                {title}
              </Text>
            </View>
          </View>
        ) : null}
      </View>

      <Space height={15} />
      {isHtml ? (
        <RenderHTML
          contentWidth={width - 70}
          enableCSSInlineProcessing={true}
          source={{
            html: htmlContent,
          }}
          tagsStyles={{
            p: {
              color: colors.black,
              fontFamily: fonts.CenturyGothicRegular,
              fontSize: 12,
              textAlign: "center",
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
      ) : (
        subtitle.map((item, i) => {
          return (
            <View key={i}>
              <View
                style={{
                  flexDirection: "row",
                  gap: 4,
                  //alignItems: "flex-start",
                  marginBottom: 3,
                  flex: 1,
                  paddingRight: withBullet ? 18 : 6,
                  paddingLeft: 6,
                }}
              >
                {withBullet ? (
                  <Text style={{ marginTop: scaledVertical(-3) }}>
                    {"\u2022"}
                  </Text>
                ) : null}

                <Text
                  size={12}
                  style={{
                    fontWeight: "400",
                    lineHeight: 18,
                    flex: 1,
                  }}
                  textAlign={alignParagraph}
                >
                  {isCustom
                    ? item?.text?.includes("30 menit")
                      ? makeTextBold(item.text)
                      : item.text
                    : item.text}
                </Text>
              </View>
              {item.subsubtitle &&
                item.subsubtitle.map((sub: any, idx: number) => {
                  return (
                    <View
                      key={idx}
                      style={{
                        flexDirection: "row",
                        gap: 4,
                        //alignItems: "flex-start",
                        marginBottom: 3,
                        flex: 1,
                        paddingRight: withBullet ? 18 : 10,
                        paddingLeft: 20,
                      }}
                    >
                      <Text style={{ marginTop: scaledVertical(-3) }}>
                        {"\u2022"}
                      </Text>

                      <Text
                        size={12}
                        style={{ fontWeight: "400", lineHeight: 18, flex: 1 }}
                      >
                        {sub.text}
                      </Text>
                    </View>
                  );
                })}
            </View>
          );
        })
      )}
    </View>
  );
};

export default SectionInfo;
