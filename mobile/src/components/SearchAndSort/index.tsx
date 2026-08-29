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
          // The BottomSheetModal this opens is only mounted while its tab is
          // selected, so on a tab that's active from first render (index 0)
          // its ref can still be null for a beat while @gorhom/bottom-sheet
          // finishes registering it with BottomSheetModalProvider -- tapping
          // Filter right away raced ahead of that and silently did nothing.
          // Retry briefly instead of giving up after a single null check.
          let attemptsLeft = 10;
          const tryPresent = () => {
            if (actionSheetRef?.current) {
              actionSheetRef.current.present();
            } else if (attemptsLeft > 0) {
              attemptsLeft -= 1;
              setTimeout(tryPresent, 50);
            }
          };
          tryPresent();
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
