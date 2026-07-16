import Text from "components/Text";
import colors from "configs/colors";
import icons from "configs/icons";
import React from "react";
import { View, Image } from "react-native";
import { scaledHorizontal } from "utils/ScaledService";

interface CheckbooxLoopProps {
  data: {
    title: string;
    onPressDetail?: () => void;
    isChecklist?: boolean;
    status: number;
  }[];
}

const CheckbooxLoop = ({ data }: CheckbooxLoopProps) => {
  return (
    <View style={{ marginLeft: 10 }}>
      {data.map((item, index) => {
        return (
          <View
            key={index}
            style={{
              alignSelf: "flex-start",
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              paddingBottom: scaledHorizontal(8),
            }}
          >
            <Image
              source={
                item.status === 2
                  ? icons.checklistBox
                  : item.status === 1
                  ? icons.checkboxBlack
                  : item.isChecklist
                  ? icons.checklistBox
                  : icons.checkbox
              }
              style={{
                width: 24,
                height: 24,
                resizeMode: "cover",
                tintColor: colors.black,
                //opacity: item.status !== 2 ? 1 : 0.25,
              }}
            />
            <Text
              size={12}
              style={{
                opacity: item.status === 2 ? 1 : item?.isChecklist ? 1 : 0.25,
                flex: 1,
              }}
              variant="CenturyGothicBold"
              type="bold"
            >
              {item.title}
            </Text>
          </View>
        );
      })}
    </View>
  );
};

export default CheckbooxLoop;
