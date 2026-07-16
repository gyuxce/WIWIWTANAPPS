import type { BottomSheetModalMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import BaseActionSheetModal from "components/BaseActionSheetModal";
import Button from "components/Button";
import Space from "components/Space";
import Text from "components/Text";
import colors from "configs/colors";
import fonts from "configs/fonts";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { View, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { scaledHorizontal, scaledVertical } from "utils/ScaledService";

interface SortActionSheetProps {
  actionSheetRef: React.RefObject<BottomSheetModalMethods>;
  snapPoints: any;
  selectedSort: { id: string; title: string };
  setSelectedSort: ({ id, title }: { id: string; title: string }) => void;
  dataSort: { id: string; title: string }[];
  children?: React.ReactNode;
}

const SortActionSheet = ({
  actionSheetRef,
  snapPoints,
  setSelectedSort,
  dataSort,
  selectedSort,
  children,
}: SortActionSheetProps) => {
  const { bottom } = useSafeAreaInsets();
  const [sort, setSort] = useState(
    selectedSort as { id: string; title: string },
  );
  const { t } = useTranslation();

  return (
    <BaseActionSheetModal
      actionSheetRef={actionSheetRef}
      snapPoints={snapPoints}
    >
      <View
        style={{
          paddingTop: scaledVertical(20),
          paddingBottom: scaledVertical(-20),
          paddingHorizontal: scaledHorizontal(25),
          height: 400,
          width: "100%",
          backgroundColor: colors.white,
          zIndex: 9999,
          marginBottom:
            Platform.OS === "ios" ? -bottom - scaledVertical(20) : 0,
        }}
      >
        <Text textAlign="center" type="bold" variant="CenturyGothicBold">
          {t("urutkan")}
        </Text>
        <Space height={20} />
        <View
          style={{
            flexDirection: "row",
            gap: 3,
            marginTop: 10,
            marginHorizontal: scaledHorizontal(25),
            justifyContent: "center",
          }}
        >
          {dataSort &&
            dataSort?.map((item, index) => {
              return (
                <Button
                  key={index}
                  onPress={() => {
                    setSort(item);
                  }}
                  title={item.title}
                  style={{
                    borderWidth: item.id === sort.id ? 1 : 0,
                    paddingHorizontal: 5,
                    borderRadius: 6,
                    paddingVertical: 6,
                    backgroundColor:
                      item.id === sort.id ? colors.white : colors.white,
                  }}
                  textType="bold"
                  variant="CenturyGothicBold"
                  textStyle={{
                    fontWeight: "600",
                    fontSize: 12,
                    textAlign: "center",
                  }}
                  withBorder={false}
                />
              );
            })}
        </View>
        {children && children}
        <Space height={30} />
        <Button
          onPress={() => {
            setSelectedSort(sort);
            setSort(sort);
            actionSheetRef?.current?.forceClose();
          }}
          title={t("terapkan_filter")}
          style={{ paddingVertical: scaledHorizontal(15) }}
          textStyle={{
            fontWeight: "bold",
            fontFamily: fonts.CenturyGothicBold,
          }}
        />
      </View>
    </BaseActionSheetModal>
  );
};

export default SortActionSheet;
