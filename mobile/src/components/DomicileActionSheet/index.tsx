import BaseActionSheet from "components/BaseActionSheet";
import Space from "components/Space";
import Text from "components/Text";
import colors from "configs/colors";
import { Platform, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { scaledVertical, scaledHorizontal } from "utils/ScaledService";
import { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import Button from "components/Button";
import fonts from "configs/fonts";
import TextInput from "components/TextInput";
import icons from "configs/icons";
import type { CityType } from "types/UserTypes";
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface DomicileActionSheetProps {
  actionSheetRef: any;
  snapPoints: any;
  data: CityType[];
  selectedCity: CityType;
  setSelectedCity: (args: CityType) => void;
  search: string;
  setSearch: (text: string) => void;
}

const DomicileActionSheet = ({
  actionSheetRef,
  snapPoints,
  data,
  selectedCity,
  setSelectedCity,
  search,
  setSearch,
}: DomicileActionSheetProps) => {
  const { bottom } = useSafeAreaInsets();
  const [city, setCity] = useState(selectedCity as CityType);
  const { t } = useTranslation();
  return (
    <BaseActionSheet actionSheetRef={actionSheetRef} snapPoints={snapPoints}>
      <View
        style={{
          paddingTop: scaledVertical(20),
          paddingBottom: scaledVertical(-20),
          paddingHorizontal: scaledHorizontal(25),
          height: 600,
          width: "100%",
          backgroundColor: colors.white,

          marginBottom:
            Platform.OS === "ios" ? -bottom - scaledVertical(20) : 0,
        }}
      >
        <Text textAlign="center" type="bold" variant="CenturyGothicBold">
          {t("domisili")}
        </Text>
        <Space height={20} />

        <TextInput
          value={search}
          onChange={(text: string) => {
            setSearch(text);
          }}
          borderLess={false}
          placeholder={t("cari")}
          placeholderColor={colors.black}
          stylesBox={{ backgroundColor: colors.stone100 }}
          textStyle={{
            height: 35,
            textAlign: "left",
            paddingLeft: scaledHorizontal(30),
          }}
          iconLeft={icons.search}
          iconLeftStyle={{
            height: 18,
            width: 18,
            resizeMode: "contain",
            marginLeft: 5,
            zIndex: 999,
          }}
        />
        <Space height={10} />
        <View style={{ height: 220 }}>
          <BottomSheetFlatList
            showsVerticalScrollIndicator={false}
            data={data}
            ListEmptyComponent={
              <View
                style={{
                  marginTop: 50,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text>{t("domisili_tidak_ditemukan")}</Text>
              </View>
            }
            contentContainerStyle={{ marginHorizontal: scaledHorizontal(30) }}
            renderItem={({ index, item }) => {
              return (
                <Button
                  onPress={() => setCity(item)}
                  withBorder={false}
                  key={index}
                  title={item?.name}
                  style={{
                    paddingVertical: scaledHorizontal(15),
                    marginBottom: scaledVertical(5),
                    borderWidth: city.id === item.id ? 1 : 0,
                  }}
                />
              );
            }}
          />
        </View>

        <Space height={30} />
        <Button
          onPress={() => {
            setSelectedCity(city);
            actionSheetRef?.current?.close();
          }}
          title={"PILIH"}
          style={{ paddingVertical: scaledHorizontal(15) }}
          textStyle={{
            fontWeight: "bold",
            fontFamily: fonts.CenturyGothicBold,
            fontSize: 12,
          }}
        />
      </View>
    </BaseActionSheet>
  );
};

export default DomicileActionSheet;
