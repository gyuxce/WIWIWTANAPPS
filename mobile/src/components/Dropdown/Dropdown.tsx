import Card from "components/Card";
import Text from "components/Text";
import icons from "configs/icons";
import React, { useState } from "react";
import { View, Image, TouchableOpacity } from "react-native";
import { VirtualClassType } from "types/TrainingTypes";

import DropdownChild from "./DropdownChild";
import moment from "moment";
import colors from "configs/colors";

interface DropdownProps {
  classVirtual: VirtualClassType[];
  level: string;
}

const Dropdown = ({ classVirtual, level }: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const checkIsInActive = () => {
    return classVirtual?.filter(item => {
      //@ts-ignore
      return item.classVirtual.every(itm => {
        return moment(itm?.event?.started_at).isBefore(new Date());
      });
    }).length;
  };
  return (
    <Card>
      <TouchableOpacity
        onPress={() => setIsOpen(!isOpen)}
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text type="bold" variant="CenturyGothicBold">
          Level {level}
        </Text>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 3 }}>
          <View style={{ flexDirection: "row", gap: 2 }}>
            <Text
              type="bold"
              variant="CenturyGothicBold"
              color={checkIsInActive() === 0 ? colors.red : colors.black}
            >
              {checkIsInActive()}
            </Text>
            <Text>/</Text>
            <Text
              type="bold"
              variant="CenturyGothicBold"
              color={checkIsInActive() === 0 ? colors.red : colors.black}
            >
              {classVirtual.length}
            </Text>
          </View>
          <Image
            source={isOpen ? icons.arrowRight2 : icons.arrowBottom}
            style={{ height: 24, width: 24, resizeMode: "contain" }}
          />
        </View>
      </TouchableOpacity>

      {isOpen && (
        <Image
          source={icons.divider}
          style={{
            height: 24,
            width: "100%",
            resizeMode: "contain",
            marginTop: 5,
          }}
        />
      )}
      {isOpen && (
        <View>
          {classVirtual.map((item, index) => {
            return (
              <DropdownChild
                key={index}
                level={level}
                title={item?.title}
                //@ts-ignore
                classVirtual={item?.classVirtual}
              />
            );
          })}
        </View>
      )}
    </Card>
  );
};

export default Dropdown;
