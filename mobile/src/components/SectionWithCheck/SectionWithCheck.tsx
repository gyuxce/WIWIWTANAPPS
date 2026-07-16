import CheckbooxLoop from "components/CheckboxLoop";
import Text from "components/Text";
import colors from "configs/colors";
import React from "react";
import { View, Image } from "react-native";

interface SectionWithCheckProps {
  imageLeft: string | any;
  imageJapan: string | any;
  title: string;
  data: { title: string; isChecklist: boolean; status?: number }[];
}

const SectionWithCheck = ({
  imageJapan,
  imageLeft,
  title,
  data,
}: SectionWithCheckProps) => {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
      <View style={{ flex: 1 }}>
        <Image
          source={imageLeft}
          style={{ height: 105, width: 105, resizeMode: "contain" }}
        />
        <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
          <Image
            source={imageJapan}
            style={{ height: 28, width: 28, resizeMode: "contain" }}
          />
          <Text
            size={12}
            variant="CenturyGothicRegular"
            color={colors.accent}
            style={{ flex: 1 }}
          >
            {title}
          </Text>
        </View>
      </View>
      <View style={{ flex: 1 }}>
        {/* @ts-ignore */}
        <CheckbooxLoop data={data} />
      </View>
    </View>
  );
};

export default SectionWithCheck;
