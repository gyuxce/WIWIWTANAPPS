import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import BottomSheet from "components/BottomSheet";
import Text from "components/Text";
import Section from "components/Section";
import type { EventProps } from "types/CalendarTypes";
import Space from "components/Space";
import icons from "configs/icons";
import CardScheduleClass from "components/CardScheduleClass";

import styles from "./styles";
import dayjs from "dayjs";
import moment from "moment";
import { useExam } from "hooks/useExam";
import { t } from "i18next";

interface Props {
  isVisible: boolean;
  onClose: () => void;
  data: EventProps[];
  selectedDate: dayjs.Dayjs;
  setSelectedDate: any;
}

const DetailEventCalendar = ({
  isVisible,
  onClose,
  data,
  selectedDate,
  setSelectedDate,
}: Props) => {
  const timeout: any = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const { getLessonClassByDate, lessonClassByDate } = useExam();
  useEffect(() => {
    if (isVisible) {
      setIsLoading(true);

      timeout.current = setTimeout(() => {
        getLessonClassByDate({
          type: "collection",
          relations: ["course", "event", "module"],
          options: [
            ["filter,group,equal,2"],
            [
              `filter,event.started_at,between,${moment(selectedDate.toDate())
                .startOf("day")
                .format("YYYY-MM-DD HH:mm:ss")}|${moment(selectedDate.toDate())
                .endOf("day")
                .format("YYYY-MM-DD HH:mm:ss")}`,
            ],
            //[`search,event.started_at,${"2025-11-03"}`],
          ],
        }).then(() => {
          setIsLoading(false);

          setSelectedDate(selectedDate);
          clearTimeout(timeout.current);
        });
      }, 1000);
    }
  }, [selectedDate]);

  return (
    <BottomSheet
      isVisible={isVisible}
      onSwipeComplete={onClose}
      onBackdropPress={onClose}
      style={{ height: "100%" }}
    >
      <Section
        textJapan="オンライン授業のスケジュール"
        textTitle="Jadwal Kelas Virtual"
      />
      <Space height={28} />
      <View style={styles.detailWrapHeaderDate}>
        <Pressable
          style={styles.btnArrow}
          onPress={() => {
            let date = selectedDate.subtract(1, "day");
            setSelectedDate(date);
          }}
        >
          <Image source={icons.arrowLeft} style={{ height: 20, width: 20 }} />
        </Pressable>
        <Text>
          {moment(selectedDate.toDate()).format("D MMMM YYYY").toString()}
        </Text>
        <Pressable
          style={styles.btnArrow}
          onPress={() => {
            let date = selectedDate.add(1, "day");
            setSelectedDate(date);
          }}
        >
          <Image source={icons.arrowRight} style={{ height: 20, width: 20 }} />
        </Pressable>
      </View>
      <Space height={28} />

      {isLoading ? (
        <ActivityIndicator size={"large"} style={{ marginTop: 150 }} />
      ) : (
        <FlatList
          data={lessonClassByDate}
          keyExtractor={(_, i) => i.toString()}
          contentContainerStyle={{ gap: 20, paddingBottom: 20 }}
          style={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <Pressable>
              <CardScheduleClass
                title={item.title}
                headerTitle={item.headerTitle}
                image={item.image}
                date={item.date}
                description={item.description}
                numberEvent={item.numberEvent}
                link={item.link}
                urlFile={item.urlFile}
                withButton={true}
                btnTitle={
                  !moment(item.date).isBefore(new Date())
                    ? t("tambahkan_ke_kalendar")
                    : t("rekaman_kelas_virtual")
                }
              />
            </Pressable>
          )}
          ListEmptyComponent={
            <View style={{ marginTop: 100 }}>
              <Text textAlign="center" size={16}>
                {t("tidak_ada_jadwal_kelas_virtual")}
              </Text>
            </View>
          }
        />
      )}
    </BottomSheet>
  );
};

export default DetailEventCalendar;
