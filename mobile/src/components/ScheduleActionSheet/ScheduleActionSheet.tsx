import { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import BaseActionSheet from "components/BaseActionSheet";
import Button from "components/Button";
import Space from "components/Space";
import Text from "components/Text";
import colors from "configs/colors";
import fonts from "configs/fonts";
import { useUser } from "hooks/useUser";
import { t } from "i18next";
import moment from "moment";
import React, { useState } from "react";
import { View, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { ScheduleType } from "types/ExamTypes";
import { scaledVertical, scaledHorizontal } from "utils/ScaledService";

interface ScheduleActionSheetProps {
  actionSheetRef: any;
  snapPoints: any;
  data: ScheduleType[];
  selectedSchedule: ScheduleType;
  setSelectedSchedule: (args: ScheduleType) => void;
}

const ScheduleActionSheet = ({
  actionSheetRef,
  snapPoints,
  data,
  selectedSchedule,
  setSelectedSchedule,
}: ScheduleActionSheetProps) => {
  const { bottom } = useSafeAreaInsets();
  const { openAdminWhatsapp } = useUser();
  const [schedule, setSchedule] = useState(selectedSchedule as ScheduleType);

  return (
    <BaseActionSheet actionSheetRef={actionSheetRef} snapPoints={snapPoints}>
      <View
        style={{
          paddingTop: scaledVertical(20),
          paddingBottom: scaledVertical(-20),
          paddingHorizontal: scaledHorizontal(25),
          height: 480,
          width: "100%",
          backgroundColor: colors.white,

          marginBottom:
            Platform.OS === "ios" ? -bottom - scaledVertical(20) : 0,
        }}
      >
        <Text textAlign="center" type="bold" variant="CenturyGothicBold">
          {t("pilih_tanggal")}
        </Text>
        <Space height={20} />
        <Space height={10} />
        <View style={{ height: 190 }}>
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
                <Text>{t("no_data")}</Text>
              </View>
            }
            contentContainerStyle={{ marginHorizontal: scaledHorizontal(30) }}
            renderItem={({ index, item }) => {
              return (
                <Button
                  onPress={() => setSchedule(item)}
                  withBorder={false}
                  key={index}
                  title={
                    item?.start_date
                      ? moment(item?.start_date).format(
                          "dddd, DD MMMM YYYY, HH:mm",
                        )
                      : "-"
                  }
                  textStyle={{
                    fontWeight: schedule?.id === item.id ? "900" : "normal",
                  }}
                  style={{
                    paddingVertical: scaledHorizontal(15),
                    marginBottom: scaledVertical(5),
                    borderWidth: schedule?.id === item.id ? 1 : 0,
                  }}
                />
              );
            }}
          />
        </View>
        <Space height={30} />
        {data?.length > 0 ? (
          <Button
            onPress={() => {
              setSelectedSchedule(schedule);
              actionSheetRef?.current?.close();
            }}
            title={t("tetapkan_jadwal")}
            style={{ paddingVertical: scaledHorizontal(15) }}
            textStyle={{
              fontWeight: "bold",
              fontFamily: fonts.CenturyGothicBold,
              fontSize: 12,
            }}
          />
        ) : (
          <Button
            onPress={openAdminWhatsapp}
            title={t("hubungi_admin_sertifikasi")}
            style={{ paddingVertical: scaledHorizontal(15) }}
            textStyle={{
              fontWeight: "bold",
              fontFamily: fonts.CenturyGothicBold,
              fontSize: 12,
            }}
          />
        )}
      </View>
    </BaseActionSheet>
  );
};

export default ScheduleActionSheet;
