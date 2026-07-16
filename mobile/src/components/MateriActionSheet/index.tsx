import { BottomSheetModalMethods } from "@gorhom/bottom-sheet/lib/typescript/types";

import BaseActionSheetModal from "components/BaseActionSheetModal";
import Button from "components/Button";
import Space from "components/Space";
import Text from "components/Text";
import colors from "configs/colors";
import fonts from "configs/fonts";
import React, { useEffect, useState } from "react";
import { Platform, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { scaledVertical, scaledHorizontal } from "utils/ScaledService";

interface MateriActionSheetProps {
  actionSheetRef: React.RefObject<BottomSheetModalMethods>;
  snapPoints: any;
  filterList: { id: any; title: string }[];
  sortList: { id: any; title: string }[];
  typeList: { id: any; title: string }[];
  query: {
    search: string;
    filter: { id: any; title: string }[];
    type: { id: any; title: string }[];
    sort: { id: any; title: string };
  };
  setQuery: any;
  isOpen?: boolean;
  setIsOpen?: (arg: boolean) => void;
}

const MateriActionSheet = ({
  actionSheetRef,
  snapPoints,
  filterList,
  sortList,
  typeList,
  query,
  setQuery,
  setIsOpen,
  isOpen,
}: MateriActionSheetProps) => {
  const { bottom } = useSafeAreaInsets();
  const [querySheet, setQuerySheet] = useState(query);

  useEffect(() => {
    console.log("trigger");
  }, [isOpen]);

  return (
    <BaseActionSheetModal
      actionSheetRef={actionSheetRef}
      snapPoints={snapPoints}
      onBackdropPress={() => {
        setQuerySheet(query);
      }}
      onDismiss={() => {
        setQuerySheet(query);
      }}
    >
      <View
        style={{
          paddingTop: scaledVertical(20),
          paddingBottom: scaledVertical(-20),
          paddingHorizontal: scaledHorizontal(25),
          //height: 400,
          width: "100%",
          backgroundColor: colors.white,
          zIndex: 9999,
          marginBottom:
            Platform.OS === "ios" ? -bottom - scaledVertical(20) : 0,
        }}
      >
        <Text textAlign="center" type="bold" variant="CenturyGothicBold">
          Urutkan
        </Text>
        <Space height={10} />
        <View
          style={{
            flexDirection: "row",
            gap: 3,
            marginTop: 5,
            marginHorizontal: scaledHorizontal(25),
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          {sortList &&
            sortList?.map((item, index) => {
              return (
                <Button
                  key={index}
                  onPress={() => {
                    setQuerySheet({ ...querySheet, sort: item });
                  }}
                  title={item.title}
                  style={{
                    borderWidth: querySheet.sort.id === item.id ? 1 : 0,
                    paddingHorizontal: 5,
                    borderRadius: 6,
                    paddingVertical: 6,
                    backgroundColor:
                      querySheet.sort.id === item.id
                        ? colors.white
                        : colors.white,
                    marginTop: 3,
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
        <Space height={15} />
        <Text textAlign="center" type="bold" variant="CenturyGothicBold">
          Filter
        </Text>
        <Space height={5} />
        <View
          style={{
            flexDirection: "row",
            gap: 3,
            marginTop: 5,
            marginHorizontal: scaledHorizontal(25),
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          {filterList &&
            filterList?.map((item, index) => {
              return (
                <Button
                  key={index}
                  onPress={() => {
                    if (
                      querySheet.filter.length > 0 &&
                      querySheet.filter.some(itm => itm.id === item.id)
                    ) {
                      let data = querySheet.filter.filter(
                        itm => itm.id !== item.id,
                      );
                      setQuerySheet({ ...querySheet, filter: data });
                    } else {
                      setQuerySheet({
                        ...querySheet,
                        filter: [...querySheet.filter, item],
                      });
                    }
                  }}
                  title={item.title}
                  style={{
                    borderWidth:
                      querySheet.filter.length > 0 &&
                      querySheet.filter.some(itm => itm.id === item.id)
                        ? 1
                        : 0,
                    paddingHorizontal: 5,
                    borderRadius: 6,
                    paddingVertical: 6,
                    backgroundColor:
                      querySheet.filter.length > 0 &&
                      querySheet.filter.some(itm => itm.id === item.id)
                        ? colors.white
                        : colors.white,
                    marginTop: 3,
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
        <Space height={15} />
        <Text textAlign="center" type="bold" variant="CenturyGothicBold">
          Jenis
        </Text>
        <Space height={5} />
        <View
          style={{
            flexDirection: "row",
            gap: 3,
            marginTop: 5,
            marginHorizontal: scaledHorizontal(25),
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          {typeList &&
            typeList?.map((item, index) => {
              return (
                <Button
                  key={index}
                  onPress={() => {
                    if (
                      querySheet.type.length > 0 &&
                      querySheet.type.some(itm => itm.id === item.id)
                    ) {
                      let data = querySheet.type.filter(
                        itm => itm.id !== item.id,
                      );
                      setQuerySheet({ ...querySheet, type: data });
                    } else {
                      setQuerySheet({
                        ...querySheet,
                        type: [...querySheet.type, item],
                      });
                    }
                  }}
                  title={item.title}
                  style={{
                    borderWidth:
                      querySheet.type.length > 0 &&
                      querySheet.type.some(itm => itm.id === item.id)
                        ? 1
                        : 0,
                    paddingHorizontal: 5,
                    borderRadius: 6,
                    paddingVertical: 6,
                    backgroundColor:
                      querySheet.type.length > 0 &&
                      querySheet.type.some(itm => itm.id === item.id)
                        ? colors.white
                        : colors.white,
                    marginTop: 3,
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

        <Space height={30} />
        <Button
          onPress={() => {
            setQuerySheet(querySheet);
            setQuery(querySheet);
            actionSheetRef?.current?.forceClose();
          }}
          title={"Terapkan Filter"}
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

export default MateriActionSheet;
