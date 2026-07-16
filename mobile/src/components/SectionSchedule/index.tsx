import { View } from "react-native";
import React from "react";
import Calendar from "components/Calendar";
import { scaledHorizontal } from "utils/ScaledService";
import type { DateProps, EventProps } from "types/CalendarTypes";
import dayjs from "dayjs";

interface Props {
  dataFilter: any[];
  event: EventProps[];
  today: dayjs.Dayjs;
  setToday: any;
  selectedDate: dayjs.Dayjs;
  setSelectedDate: any;
  modalFilter: boolean;
  setModalFilter: any;
  modalDetail: boolean;
  setModalDetail: any;
  listDate: DateProps[];
  setLisDate: any;
  detailEvent: EventProps[];
  setDetailEvent: any;
  selectedFilter: number[];
  setSelectedFilter: any;
}
const SectionSchedule = ({
  dataFilter,
  event,
  today,
  setToday,
  selectedDate,
  setSelectedDate,
  listDate,
  modalDetail,
  setModalDetail,
  modalFilter,
  setModalFilter,
  detailEvent,
  setDetailEvent,
  setLisDate,
  selectedFilter,
  setSelectedFilter,
}: Props) => {
  return (
    <View style={{ paddingHorizontal: scaledHorizontal(25) }}>
      <Calendar
        dataFilter={dataFilter}
        event={event}
        today={today}
        setToday={setToday}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        listDate={listDate}
        setLisDate={setLisDate}
        modalDetail={modalDetail}
        modalFilter={modalFilter}
        setModalDetail={setModalDetail}
        setModalFilter={setModalFilter}
        detailEvent={detailEvent}
        setDetailEvent={setDetailEvent}
        selectedFilter={selectedFilter}
        setSelectedFilter={setSelectedFilter}
      />
    </View>
  );
};

export default SectionSchedule;
