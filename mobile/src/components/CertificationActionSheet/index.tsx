import { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import BaseActionSheet from "components/BaseActionSheet";
import Button from "components/Button";
import Space from "components/Space";
import Text from "components/Text";
import colors from "configs/colors";
import fonts from "configs/fonts";
import icons from "configs/icons";
import React, { useState } from "react";
import { View, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CertificationListType } from "types/CertificationTypes";
import { scaledVertical, scaledHorizontal } from "utils/ScaledService";
import TextInput from "components/TextInput";
import { useTranslation } from "react-i18next";

interface CertificationSheetProps {
  actionSheetRef: any;
  snapPoints: any;
  data: CertificationListType[];
  selectedCertification: CertificationListType;
  setSelectedCertification: (args: CertificationListType) => void;
  search: string;
  setSearch: (text: string) => void;
}

const CertificationSheet = ({
  actionSheetRef,
  snapPoints,
  data,
  search,
  setSearch,
  selectedCertification,
  setSelectedCertification,
}: CertificationSheetProps) => {
  const { bottom } = useSafeAreaInsets();
  const [certification, setCertification] = useState(
    selectedCertification as CertificationListType,
  );
  const { t } = useTranslation();
  return (
    <BaseActionSheet actionSheetRef={actionSheetRef} snapPoints={snapPoints}>
      <View
        style={{
          paddingTop: scaledVertical(20),
          paddingBottom: scaledVertical(-20),
          paddingHorizontal: scaledHorizontal(25),
          height: 450,
          width: "100%",
          backgroundColor: colors.white,

          marginBottom:
            Platform.OS === "ios" ? -bottom - scaledVertical(20) : 0,
        }}
      >
        <Text textAlign="center" type="bold" variant="CenturyGothicBold">
          {t("sertifikasi")}
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
                <Text>Sertifikasi tidak ditemukan</Text>
              </View>
            }
            contentContainerStyle={{ marginHorizontal: scaledHorizontal(30) }}
            renderItem={({ index, item }) => {
              return (
                <Button
                  onPress={() => setCertification(item)}
                  withBorder={false}
                  key={index}
                  title={item?.name}
                  style={{
                    paddingVertical: scaledHorizontal(15),
                    marginBottom: scaledVertical(5),
                    borderWidth: certification.id === item.id ? 1 : 0,
                  }}
                />
              );
            }}
          />
        </View>

        <Button
          onPress={() => {
            setSelectedCertification(certification);
            actionSheetRef?.current?.close();
          }}
          title={t("pilih")}
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

export default CertificationSheet;
