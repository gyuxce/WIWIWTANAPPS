import Button from "components/Button";
import Card from "components/Card";
import Space from "components/Space";
import Text from "components/Text";
import colors from "configs/colors";
import fonts from "configs/fonts";
import icons from "configs/icons";
import React, { useState } from "react";
import {
  View,
  useWindowDimensions,
  TouchableOpacity,
  Image,
} from "react-native";
import RenderHTML from "react-native-render-html";
import WebView from "react-native-webview";
import { QuestionType } from "types/ExamTypes";
import { scaledHorizontal } from "utils/ScaledService";
import TextInput from "components/TextInput";
import { t } from "i18next";

interface EssayProps {
  question: QuestionType;
  indexQuestion: number;
  essayText: string;
  setEssayText: (text: string) => void;
}

const Essay = ({
  question,
  indexQuestion,
  essayText,
  setEssayText,
}: EssayProps) => {
  const { width } = useWindowDimensions();
  const [stylesText, setStylesText] = useState({});
  const [isLongText, setIsLongText] = useState(false);

  const onChangePress = (longText: boolean) => {
    setIsLongText(longText);
    if (longText) {
      setStylesText({
        height: 110,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        overflow: "hidden",
      });
    } else {
      setStylesText({
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        overflow: "hidden",
      });
    }
  };
  return (
    <View style={{ marginHorizontal: scaledHorizontal(25) }}>
      <View style={{ flexDirection: "row", gap: 5 }}>
        <Text style={{ fontWeight: "900" }}>{indexQuestion + 1}.</Text>
        <Text style={{ fontWeight: "900", flex: 1 }}>
          <Text color={colors.red}>[ESSAY]</Text> {question?.title}
        </Text>
      </View>

      {question?.file && (
        <View>
          <Space height={20} />
          <Button
            title="Putar Audio"
            style={{ paddingVertical: scaledHorizontal(15) }}
            textStyle={{ fontWeight: "900" }}
            textType="bold"
            icon={icons.playAudio}
            iconStyle={{ height: 24, width: 24, resizeMode: "contain" }}
            innerStyle={{ alignItems: "center", gap: 10 }}
          />
        </View>
      )}

      <Space height={20} />
      <View>
        <Card
          style={[
            stylesText,
            {
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0,
            },
          ]}
        >
          <RenderHTML
            contentWidth={width - 40}
            enableCSSInlineProcessing={false}
            source={{
              html:
                `
              <!DOCTYPE html>
                        <html>
                          <head>
                            <meta name="viewport" content="width=${width}, initial-scale=1">
                            <link rel="stylesheet" href="https://use.typekit.net/oov2wcw.css">
                            <style type="text/css">
                              div {
                                max-width: ${width}px;
                                font-family: century-gothic, sans-serif;
                              }
                              div, p {padding: 0; margin: 0; font-family: century-gothic, sans-serif;}
                              
                            </style>
                          </head>
                        <body>
                        <div style="padding: 0px; height: 10px">` +
                question?.description +
                "</div></body></html>",
            }}
            tagsStyles={{
              p: {
                color: colors.black,
                fontFamily: fonts.CenturyGothicRegular,
                fontSize: 14,
                textAlign: "left",
                marginVertical: 0,
                paddingHorizontal: 0,
                lineHeight: 18,
              },
              li: {
                color: colors.black,
                fontFamily: fonts.CenturyGothicRegular,
                fontSize: 14,
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
          <Space height={10} />
        </Card>
        <TouchableOpacity
          onPress={() => onChangePress(!isLongText)}
          activeOpacity={1}
          style={{
            backgroundColor: colors.white,
            borderBottomLeftRadius: 12,
            borderBottomRightRadius: 12,
          }}
        >
          <Text
            textAlign="center"
            size={12}
            color={colors.red}
            style={{ fontWeight: "900" }}
          >
            {isLongText ? t("lihat_lebih_banyak") : t("lihat_lebih_sedikit")}
          </Text>
          <Image
            source={isLongText ? icons.arrowBottom : icons.arrowUp}
            style={{
              alignSelf: "center",
              resizeMode: "contain",
              height: 14,
              width: 14,
              tintColor: colors.red,
            }}
          />
        </TouchableOpacity>
      </View>

      <Space height={20} />
      <Text style={{ fontWeight: "900" }}>{t("jawaban")} : </Text>
      <Space height={20} />
      <Card>
        <TextInput
          value={essayText}
          placeholder={t("masukan_jawaban_disini")}
          onChange={e => setEssayText(e)}
          type="textarea"
          textStyle={{
            fontFamily: fonts.CenturyGothicRegular,
            textAlignVertical: "top",
            textAlign: "left",
          }}
          stylesBox={{ minHeight: 110 }}
          borderLess={false}
          withError={false}
        />
      </Card>
    </View>
  );
};

export default Essay;
