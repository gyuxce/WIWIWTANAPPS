import Card from "components/Card";
import Space from "components/Space";
import Text from "components/Text";
import colors from "configs/colors";
import React from "react";
import { View, type ViewStyle } from "react-native";
import type { DocDataType } from "types/DocTypes";

interface CardDocProps {
  title?: string;
  style?: ViewStyle | any;
  data?: Array<DocDataType> | any;
}

const CardDocument = ({ title, style, data }: CardDocProps) => {
  return (
    <Card style={style}>
      <Text
        size={16}
        textAlign="center"
        variant="CenturyGothicBold"
        type="bold"
        color={colors.accent}
      >
        {title}
      </Text>
      <Space height={32} />
      <View style={{ flexDirection: "column", gap: 24 }}>
        {data?.map((item: DocDataType, i: number) => (
          <View key={"doc_" + i}>
            <Text textAlign="center" size={12}>
              {item?.label}
              {item?.isRequired && (
                <Text size={12} color={colors.red}>
                  *
                </Text>
              )}
            </Text>
            <Space height={4} />
            {item?.value}
          </View>
        ))}
      </View>
    </Card>
  );
};

export default CardDocument;
