import BaseActionSheet from "components/BaseActionSheet";
import Space from "components/Space";
import Text from "components/Text";
import colors from "configs/colors";
import {
  ActivityIndicator,
  Platform,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { scaledVertical, scaledHorizontal } from "utils/ScaledService";
import { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import Button from "components/Button";
import TextInput from "components/TextInput";
import icons from "configs/icons";
import type { CityType, ProvinceType } from "types/UserTypes";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

interface DomicileActionSheetProps {
  actionSheetRef: any;
  snapPoints: any;
  data: CityType[];
  provinceData: ProvinceType[];
  selectedCity: CityType;
  setSelectedCity: (args: CityType) => void;
  selectedProvince: ProvinceType;
  onSelectProvince: (args: ProvinceType) => void;
  search: string;
  setSearch: (text: string) => void;
}

const DomicileActionSheet = ({
  actionSheetRef,
  snapPoints,
  data,
  provinceData,
  selectedCity,
  setSelectedCity,
  selectedProvince,
  onSelectProvince,
  search,
  setSearch,
}: DomicileActionSheetProps) => {
  const { bottom } = useSafeAreaInsets();
  const [city, setCity] = useState(selectedCity as CityType);
  const [step, setStep] = useState<"province" | "city">(
    selectedProvince?.id ? "city" : "province",
  );
  const [provinceSearch, setProvinceSearch] = useState("");
  // Cities are fetched by the parent screen after a province is picked. Until
  // that request lands the list is empty, which otherwise renders as "not
  // found" and reads as a failure — so hold a spinner instead.
  const [isFetchingCity, setIsFetchingCity] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    setCity(selectedCity as CityType);
  }, [selectedCity]);

  useEffect(() => {
    setIsFetchingCity(false);
  }, [data]);

  useEffect(() => {
    if (!isFetchingCity) {
      return;
    }
    // Safety net: never leave the spinner up if the request never resolves.
    const timeoutId = setTimeout(() => setIsFetchingCity(false), 8000);
    return () => clearTimeout(timeoutId);
  }, [isFetchingCity]);

  const filteredProvinces = useMemo(
    () =>
      provinceData?.filter(item =>
        item?.name?.toLowerCase().includes(provinceSearch.toLowerCase()),
      ),
    [provinceData, provinceSearch],
  );

  const handleSelectProvince = (province: ProvinceType) => {
    onSelectProvince(province);
    setCity({} as CityType);
    setProvinceSearch("");
    setIsFetchingCity(true);
    setStep("city");
  };

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
          {step === "province" ? t("provinsi") : t("domisili")}
        </Text>
        <Space height={10} />

        {step === "city" && (
          <>
            <TouchableOpacity onPress={() => setStep("province")}>
              <Text size={12} color={colors.black}>
                {"‹ "}
                {selectedProvince?.name || t("ganti_provinsi")}
              </Text>
            </TouchableOpacity>
            <Space height={10} />
          </>
        )}

        {step === "province" ? (
          <>
            <TextInput
              value={provinceSearch}
              onChange={(text: string) => setProvinceSearch(text)}
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
            <View style={{ height: 280 }}>
              <BottomSheetFlatList
                showsVerticalScrollIndicator={false}
                data={filteredProvinces}
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
                contentContainerStyle={{
                  marginHorizontal: scaledHorizontal(30),
                }}
                renderItem={({ index, item }) => {
                  return (
                    <Button
                      onPress={() => handleSelectProvince(item)}
                      withBorder={false}
                      key={index}
                      title={item?.name}
                      style={{
                        paddingVertical: scaledHorizontal(15),
                        marginBottom: scaledVertical(5),
                        borderWidth: selectedProvince?.id === item.id ? 1 : 0,
                      }}
                    />
                  );
                }}
              />
            </View>
          </>
        ) : (
          <>
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
                data={isFetchingCity ? [] : data}
                ListEmptyComponent={
                  <View
                    style={{
                      marginTop: 50,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {isFetchingCity ? (
                      <ActivityIndicator size="large" color={colors.black} />
                    ) : (
                      <Text>{t("domisili_tidak_ditemukan")}</Text>
                    )}
                  </View>
                }
                contentContainerStyle={{
                  marginHorizontal: scaledHorizontal(30),
                }}
                renderItem={({ index, item }) => {
                  return (
                    <Button
                      onPress={() => {
                        setCity(item);
                        setSelectedCity(item);
                        actionSheetRef?.current?.close();
                      }}
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
          </>
        )}
      </View>
    </BaseActionSheet>
  );
};

export default DomicileActionSheet;
