import Text from "components/Text";
import { usePersist } from "hooks/usePersist";
import React, { useState } from "react";
import { View } from "react-native";
import { scaledVertical } from "utils/ScaledService";

interface SectionProps {
  textTitle: string;
  textJapan: string;
  size?: 20 | 24;
}

const Section = ({ textJapan, textTitle, size = 24 }: SectionProps) => {
  const { language } = usePersist();
  const [widthText, setWidthText] = useState(0);
  const [widthJapan, setWidthJapan] = useState(0);

  const textSize = () => {
    if (size === 20) {
      return { textJapanSize: 12, textTitleSize: size };
    }
    return { textJapanSize: 16, textTitleSize: size };
  };

  return (
    <View style={{ alignItems: "center" }}>
      <View
        style={{
          borderBottomWidth:
            language === "id" ? (widthText > widthJapan ? 0.8 : 0) : 0,
          borderBottomColor: "black",
          paddingHorizontal: 1,
          paddingBottom: scaledVertical(10),
        }}
      >
        <Text
          size={textSize().textTitleSize}
          variant={"OpificioNeueRegular"}
          style={{ fontWeight: "400" }}
          onTextLayout={e => setWidthText(e?.nativeEvent?.lines[0]?.width || 0)}
        >
          {language === "id" ? textTitle : textJapan}
        </Text>
      </View>

      {language === "id" && (
        <View
          style={{
            borderTopWidth: widthJapan > widthText ? 0.8 : 0,
            paddingTop: scaledVertical(10),
            borderTopColor: "black",
            paddingHorizontal: 1,
          }}
        >
          <Text
            size={textSize().textJapanSize}
            onTextLayout={e =>
              setWidthJapan(e?.nativeEvent?.lines[0]?.width || 0)
            }
            style={{ fontWeight: "400" }}
          >
            {textJapan}
          </Text>
        </View>
      )}
    </View>
  );
};

export default Section;
