import { Pressable, View } from "react-native";
import React, { useState } from "react";
import BottomSheet from "components/BottomSheet";
import Text from "components/Text";
import Space from "components/Space";
import colors from "configs/colors";
import Button from "components/Button";
import fonts from "configs/fonts";
import { scaledVertical } from "utils/ScaledService";
import { t } from "i18next";

interface Props {
  isVisible: boolean;
  onClose: () => void;
  data: any[];
  selected: number[];
  setSelected: any;
}

const FilterCalendar = ({
  isVisible,
  onClose,
  data,
  setSelected,
  selected,
}: Props) => {
  const [filter, setFilter] = useState(selected);

  const handleSelected = (id: number) => {
    const index = filter.findIndex(item => item === id);

    if (index >= 0) {
      const result = filter.filter(item => item !== id);
      setFilter(result);
      //setSelected(result);
    } else {
      const result = [...filter, id];
      setFilter(result);
      //setSelected(result);
    }
  };

  const handleSelectedItem = (id: number) => {
    const index = filter.findIndex(item => item === id);
    if (index >= 0) {
      return true;
    }
    return false;
  };

  const handleFilter = () => {
    setSelected(filter);
    onClose();
  };

  return (
    <BottomSheet
      isVisible={isVisible}
      onSwipeComplete={() => {
        setFilter(selected);
        onClose();
      }}
      onBackdropPress={() => {
        setFilter(selected);
        onClose();
      }}
      style={{ paddingBottom: 40 }}
    >
      <Text
        variant="CenturyGothicBold"
        type="bold"
        textAlign="center"
        color={colors.accent}
      >
        {t("tanggal")}
      </Text>

      <Space height={12} />
      <View
        style={{
          flexDirection: "row",
          paddingHorizontal: 8,
          gap: 12,
          justifyContent: "space-between",
        }}
      >
        {data.map((item, i) => (
          <Pressable
            onPress={() => handleSelected(item.id)}
            key={i.toString()}
            style={{
              flex: 1,
              borderRadius: 8,
              borderWidth: 0.5,
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderColor: handleSelectedItem(item.id)
                ? colors.black
                : colors.white,
            }}
          >
            <Text
              textAlign="center"
              size={10}
              type="bold"
              variant="CenturyGothicBold"
            >
              {item?.label}
            </Text>
          </Pressable>
        ))}
      </View>
      <Space height={40} />
      <Button
        onPress={handleFilter}
        title={t("terapkan_filter")}
        textStyle={{
          fontFamily: fonts.CenturyGothicBold,
          fontSize: 12,
        }}
        style={{ paddingVertical: scaledVertical(25) }}
      />
    </BottomSheet>
  );
};

export default FilterCalendar;
