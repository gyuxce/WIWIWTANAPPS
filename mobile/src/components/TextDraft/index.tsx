import Card from "components/Card";
import Text from "components/Text";
import icons from "configs/icons";
import React from "react";
import { Image, TouchableOpacity } from "react-native";
import { scaledHorizontal } from "utils/ScaledService";

interface TextDraftProps {
  title: string;
  onPressTrash: () => void;
  onPressCard: () => void;
}

const TextDraft = ({ title, onPressCard, onPressTrash }: TextDraftProps) => {
  return (
    <TouchableOpacity
      onPress={onPressCard}
      style={{ marginBottom: scaledHorizontal(10) }}
    >
      <Card
        style={{
          justifyContent: "space-between",
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
        }}
      >
        <Text
          style={{ flex: 0.9 }}
          size={12}
          type="bold"
          variant="CenturyGothicBold"
          lineHeight={18}
          numberOfLines={2}
        >
          {title}
        </Text>
        <TouchableOpacity onPress={onPressTrash} style={{ flex: 0.07 }}>
          <Image source={icons.trash} style={{ width: 20, height: 20 }} />
        </TouchableOpacity>
      </Card>
    </TouchableOpacity>
  );
};

export default TextDraft;
