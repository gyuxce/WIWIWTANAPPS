import { BottomSheetModalMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import BaseActionSheetModal from "components/BaseActionSheetModal";
import Button from "components/Button";
import Space from "components/Space";
import Text from "components/Text";
import colors from "configs/colors";
import fonts from "configs/fonts";
import icons from "configs/icons";
import dayjs from "dayjs";
import { t } from "i18next";
import moment from "moment";
import React, { useState } from "react";
import { View, Platform, Image, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { scaledVertical, scaledHorizontal } from "utils/ScaledService";

interface VirtualClassActionSheetProps {
  actionSheetRef: React.RefObject<BottomSheetModalMethods>;
  snapPoints: any;
  selectedSort: { id: string; title: string };
  setSelectedSort: ({ id, title }: { id: string; title: string }) => void;
  dataSort: { id: string; title: string }[];
  selectedFilter: { id: string; title: string }[];
  setSelectedFilter: (args: any) => void;
  dataFilter: { id: string; title: string }[];
  selectedDate: {
    id: string;
    title: string;
    type: string;
    start_date: string;
    end_date: string;
  };
  setSelectedDate: ({
    id,
    title,
  }: {
    id: string;
    title: string;
    type: string;
    start_date: string;
    end_date: string;
  }) => void;
  dataDate: {
    id: string;
    title: string;
    type: string;
    start_date: string;
    end_date: string;
  }[];
  children?: React.ReactNode;
}

const VirtualClassActionSheet = ({
  actionSheetRef,
  snapPoints,
  setSelectedSort,
  dataSort,
  selectedSort,
  setSelectedFilter,
  selectedFilter,
  dataFilter,
  setSelectedDate,
  selectedDate,
  dataDate,
  children,
}: VirtualClassActionSheetProps) => {
  const { bottom } = useSafeAreaInsets();
  const [sort, setSort] = useState(
    selectedSort as { id: string; title: string },
  );
  const [filter, setFilter] = useState(
    selectedFilter as { id: string; title: string }[],
  );
  const [date, setDate] = useState(
    selectedDate as {
      id: string;
      title: string;
      type: string;
      start_date: string;
      end_date: string;
    },
  );
  const [isShowPickerStartDate, setIsShowPickerStartDate] = useState(false);
  const [isShowPickerEndDate, setIsShowPickerEndDate] = useState(false);

  return (
    <BaseActionSheetModal
      actionSheetRef={actionSheetRef}
      snapPoints={snapPoints}
      onBackdropPress={() => {
        setSort(selectedSort);
        setFilter(selectedFilter);
        setDate(selectedDate);
      }}
      onDismiss={() => {
        setSort(selectedSort);
        setFilter(selectedFilter);
        setDate(selectedDate);
      }}
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
        <Space height={20} />
        <Text textAlign="center" type="bold" variant="CenturyGothicBold">
          {t("filter")}
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
          {dataFilter &&
            dataFilter?.map((item, index) => {
              return (
                <Button
                  key={index}
                  onPress={() => {
                    if (
                      filter?.length > 0 &&
                      filter.some(itm => itm.id === item.id)
                    ) {
                      let data = filter.filter(itm => itm.id !== item.id);
                      setFilter(data);
                    } else {
                      setFilter([...filter, item]);
                    }
                  }}
                  title={item.title}
                  style={{
                    borderWidth:
                      filter?.length > 0 &&
                      filter?.some(itm => itm.id === item.id)
                        ? 1
                        : 0,
                    paddingHorizontal: 5,
                    borderRadius: 6,
                    paddingVertical: 6,
                    backgroundColor:
                      filter?.length > 0 &&
                      filter?.some(itm => itm.id === item.id)
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
        <Space height={20} />
        <Text textAlign="center" type="bold" variant="CenturyGothicBold">
          {t("tanggal")}
        </Text>
        <Space height={10} />
        <View
          style={{
            //flexDirection: "row",
            gap: 3,
            marginTop: 5,
            marginHorizontal: scaledHorizontal(10),
            //justifyContent: "center",
            //flexWrap: "wrap",
          }}
        >
          {dataDate &&
            dataDate?.map((item, index) => {
              return (
                <View key={index}>
                  <TouchableOpacity
                    onPress={() => {
                      setDate(item);
                    }}
                    key={index}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      borderTopColor: colors.grey300,
                      borderTopWidth: 1,
                      paddingVertical: scaledVertical(15),
                    }}
                  >
                    <Text size={12} type="bold" variant="CenturyGothicBold">
                      {item.title}
                    </Text>
                    <Image
                      source={
                        item?.title === date?.title
                          ? icons.toggleSelected
                          : icons?.toggle
                      }
                      style={{ height: 20, width: 20, resizeMode: "contain" }}
                    />
                  </TouchableOpacity>
                  {item.type === "custom" && (
                    <View
                      style={{
                        backgroundColor: colors.stone100,
                        borderRadius: 12,
                        flexDirection: "row",
                        //justifyContent: "space-between",
                        gap: 10,
                        marginTop: scaledVertical(15),
                        paddingVertical: scaledVertical(20),
                        paddingHorizontal: scaledHorizontal(20),
                      }}
                    >
                      <View style={{ flex: 1 }}>
                        <Text size={12} textAlign="center">
                          {t("dari_tanggal")}
                        </Text>
                        <Space height={10} />
                        {isShowPickerStartDate ? (
                          <RNDateTimePicker
                            value={
                              date.start_date === ""
                                ? new Date()
                                : new Date(date?.start_date)
                            }
                            mode="date"
                            onChange={(_, selectedDate) => {
                              setIsShowPickerStartDate(false);

                              setDate({
                                ...date,
                                start_date: selectedDate?.toDateString() || "",
                              });
                            }}
                            style={{
                              marginRight: 10,
                              alignSelf: "center",
                            }}
                          />
                        ) : (
                          <TouchableOpacity
                            disabled={date?.type !== "custom"}
                            onPress={() => setIsShowPickerStartDate(true)}
                            style={{
                              borderRadius: 6,
                              backgroundColor: colors.white,
                              paddingVertical: scaledVertical(20),
                            }}
                          >
                            <Text
                              size={12}
                              textAlign="center"
                              variant="CenturyGothicBold"
                              type="bold"
                            >
                              {date?.type === "custom" &&
                              date?.start_date !== ""
                                ? moment(date?.start_date).format(
                                    "D[ ]MMM[ ]YYYY",
                                  )
                                : "-"}
                            </Text>
                          </TouchableOpacity>
                        )}
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text size={12} textAlign="center">
                          {t("sampai_tanggal")}
                        </Text>
                        <Space height={10} />
                        {isShowPickerEndDate ? (
                          <RNDateTimePicker
                            disabled={date?.start_date === ""}
                            value={
                              date.end_date === ""
                                ? new Date()
                                : new Date(date?.end_date)
                            }
                            minimumDate={
                              date?.start_date !== ""
                                ? moment(date?.start_date).toDate()
                                : moment(new Date())
                                    .subtract(2, "year")
                                    .toDate()
                            }
                            mode="date"
                            onChange={(_, selectedDate) => {
                              setIsShowPickerEndDate(false);
                              setDate({
                                ...date,
                                end_date: selectedDate?.toDateString() || "",
                              });
                            }}
                            style={{
                              marginRight: 10,
                              alignSelf: "center",
                            }}
                          />
                        ) : (
                          <TouchableOpacity
                            disabled={date?.type !== "custom"}
                            onPress={() => {
                              date?.start_date !== "" &&
                                setIsShowPickerEndDate(true);
                            }}
                            style={{
                              borderRadius: 6,
                              backgroundColor: colors.white,
                              paddingVertical: scaledVertical(20),
                            }}
                          >
                            <Text
                              size={12}
                              textAlign="center"
                              variant="CenturyGothicBold"
                              type="bold"
                            >
                              {date?.type === "custom" && date?.end_date !== ""
                                ? moment(date?.end_date).format(
                                    "D[ ]MMM[ ]YYYY",
                                  )
                                : "-"}
                            </Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                  )}
                </View>
              );
            })}
        </View>

        <Space height={30} />
        <Button
          onPress={() => {
            setSelectedSort(sort);
            setSort(sort);
            setSelectedFilter(filter);
            setFilter(filter);
            if (date?.type === "custom") {
              setSelectedDate({
                ...selectedDate,
                id: "custom",
                title: t("pilih_tanggal"),
                type: "custom",
                start_date: dayjs(date?.start_date).format("YYYY-MM-DD"),
                end_date: dayjs(date?.end_date).isValid()
                  ? dayjs(date?.end_date).format("YYYY-MM-DD")
                  : dayjs(date?.start_date).add(1, "day").format("YYYY-MM-DD"),
              });
            } else {
              setSelectedDate(date);
            }

            setDate(date);
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

export default VirtualClassActionSheet;
