import Button from "components/Button";
import Card from "components/Card";
import TextInput from "components/TextInput";
import colors from "configs/colors";
import fonts from "configs/fonts";
import icons from "configs/icons";
import React from "react";
import { scaledHorizontal } from "utils/ScaledService";

interface SearchAndSortProps {
  search: string;
  setSearch: (text: string) => void;
  actionSheetRef: any;
  btnText?: string;
  placeholder?: string;
  marginHorizontal?: any;
  isOpen?: boolean;
  setIsOpen?: (arg: boolean) => void;
}

const SearchAndSort = ({
  search,
  setSearch,
  actionSheetRef,
  btnText = "Urutkan",
  placeholder = "Cari",
  marginHorizontal = scaledHorizontal(25),
  isOpen,
  setIsOpen,
}: SearchAndSortProps) => {
  return (
    <Card
      style={{
        marginHorizontal: marginHorizontal,
        flexDirection: "row",
        flex: 1,
        gap: 10,
      }}
    >
      <TextInput
        value={search}
        onChange={(text: string) => {
          setSearch(text);
        }}
        borderLess={false}
        placeholder={placeholder}
        placeholderColor={colors.black}
        stylesBox={{ backgroundColor: colors.stone100, flex: 1 }}
        textStyle={{
          fontFamily:
            search.length > 0
              ? fonts.CenturyGothicBold
              : fonts.CenturyGothicRegular,
          textAlign: "left",
          paddingLeft: scaledHorizontal(30),
          textAlignVertical: "center",
          marginTop: -5,
        }}
        wrapStyle={{ height: 30 }}
        iconLeft={icons.search}
        iconLeftStyle={{
          height: 18,
          width: 18,
          resizeMode: "contain",
          marginLeft: 9,
          alignSelf: "center",
        }}
        withError={false}
      />
      <Button
        onPress={() => {
          setIsOpen && setIsOpen(true);
          actionSheetRef?.current?.present();
        }}
        icon={icons.sort}
        iconStyle={{
          height: 16,
          width: 16,
          resizeMode: "contain",
          marginRight: 8,
        }}
        textStyle={{ fontSize: 10, fontFamily: fonts.CenturyGothicBold }}
        style={{
          paddingVertical: 10,
          borderWidth: 1,
          borderBottomWidth: 1,
          borderLeftWidth: 1,
          paddingHorizontal: 5,
        }}
        innerStyle={{ alignItems: "center" }}
        title={btnText}
      />
    </Card>
  );
};

export default SearchAndSort;
