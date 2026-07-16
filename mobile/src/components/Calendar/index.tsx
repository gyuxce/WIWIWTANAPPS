import { View, FlatList, Pressable, Image } from "react-native";
import React, { useCallback, useEffect } from "react";
import { generateDate, days, months } from "utils/Calendar";
import colors from "configs/colors";
import Text from "components/Text";
import icons from "configs/icons";
import Space from "components/Space";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import type { EventProps, DateProps } from "types/CalendarTypes";
import { COURSE_TYPE } from "types/ConstantTypes";

import styles from "./styles";
import FilterCalendar from "./FilterCalendar";
import DetailEventCalendar from "./DetailEventCalendar";

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

const Calendar = ({
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
  const isSelected = (itemDate: Dayjs) => {
    return (
      selectedDate.toDate().toDateString() === itemDate.toDate().toDateString()
    );
  };

  const handleTextColor = (item: DateProps) => {
    if (isSelected(item.date) && !item.today) {
      return colors.white;
    }
    if (item.today && !isSelected(item?.date)) {
      return colors.red;
    }
    if (item.today && isSelected(item?.date)) {
      return colors.white;
    }
    if (item.currentMonth) {
      return colors.black;
    }
    return colors.grey300;
  };

  const handleEventColor = (type: string) => {
    if (type === COURSE_TYPE.TEORI) {
      return colors.orange;
    }
    if (type === COURSE_TYPE.PRAKTIK) {
      return colors.blue;
    }
    return colors.yellow;
  };

  const openEvent = (dataItem: DateProps) => {
    //if (dataItem.event !== null) {
    setDetailEvent(dataItem.event);
    setModalDetail(true);
    //}
  };

  const itemDate = ({ item }: { item: DateProps }) => {
    return (
      <View style={styles.containerItemDate}>
        <Pressable
          onPress={() => {
            setSelectedDate(item.date);
            openEvent(item);
          }}
          style={[
            styles.wrapItemDate,
            {
              backgroundColor: isSelected(item.date)
                ? colors.red
                : colors.white,
            },
          ]}
        >
          <Text
            size={14}
            variant="OpificioNeueRegular"
            color={handleTextColor(item)}
          >
            {item.date.date()}
          </Text>
        </Pressable>

        <View style={{ flexDirection: "row", gap: 2 }}>
          {item.event?.map((itemEvent, i) => (
            <View
              key={i.toString()}
              style={{
                width: 8,
                height: 8,
                borderRadius: 40,
                backgroundColor: handleEventColor(itemEvent.type),
              }}
            />
          ))}
        </View>
      </View>
    );
  };

  const separator = () => {
    return (
      <View style={{ borderBottomWidth: 0.5, borderColor: colors.grey300 }} />
    );
  };

  const changeMonth = (type: "previous" | "next") => {
    if (type === "previous") {
      setToday(today.month(today.month() - 1));
    } else {
      setToday(today.month(today.month() + 1));
    }
  };

  const handleSetListDate = useCallback(() => {
    const list = generateDate(today.month(), today.year());
    const result: any = [];

    list.forEach(listItem => {
      const matchingEvents = event?.filter(
        e =>
          dayjs(e.date).toDate().toDateString() ===
          listItem.date.toDate().toDateString(),
      );

      if (matchingEvents?.length > 0) {
        const combinedObject = {
          date: listItem.date,
          currentMonth: listItem.currentMonth,
          today: listItem.today ?? false,
          event: matchingEvents
            .map(e => e)
            .reduce((acc: any, obj: any) => {
              if (
                !acc.some(
                  (item: any) => item?.course?.type === obj.course?.type,
                )
              ) {
                acc.push(obj);
              }
              return acc;
            }, []),
        };
        result.push(combinedObject);
      } else {
        result.push({
          date: listItem.date,
          currentMonth: listItem.currentMonth,
          today: listItem.today ?? false,
          event: null,
        });
      }
    });
    setLisDate(result);
  }, [event, today]);

  useEffect(() => {
    handleSetListDate();
  }, [today, event]);

  return (
    <>
      <View style={styles.container}>
        <View style={{ flexDirection: "row" }}>
          <View style={styles.wrapMonth}>
            <Text size={10} variant="CenturyGothicBold" type="bold">
              {`${months[today.month()]} ${today.year()}`}
            </Text>
          </View>
          <View style={{ flexDirection: "row", flex: 1 }}>
            <Pressable
              style={styles.btnArrow}
              onPress={() => changeMonth("previous")}
            >
              <Image
                source={icons.arrowLeft}
                style={{ height: 20, width: 20 }}
              />
            </Pressable>
            <Space width={8} />
            <Pressable
              style={styles.btnArrow}
              onPress={() => changeMonth("next")}
            >
              <Image
                source={icons.rightArrow}
                style={{ height: 20, width: 20 }}
              />
            </Pressable>
          </View>
          <Pressable
            style={styles.wrapMenuFilter}
            onPress={() => setModalFilter(true)}
          >
            <Image
              style={{ height: 16, width: 40 }}
              source={icons.iconFilterCalendar}
            />
          </Pressable>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          {days.map((item, i) => (
            <View key={i.toString()} style={styles.wrapDay}>
              <Text size={10} type="bold" variant="CenturyGothicBold">
                {item}
              </Text>
            </View>
          ))}
        </View>
        <View style={styles.lineDay} />

        <FlatList
          data={listDate}
          numColumns={7}
          renderItem={itemDate}
          keyExtractor={(_, i) => i.toString()}
          columnWrapperStyle={{
            gap: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
          ItemSeparatorComponent={separator}
        />
      </View>
      <FilterCalendar
        isVisible={modalFilter}
        onClose={() => setModalFilter(false)}
        data={dataFilter}
        selected={selectedFilter}
        setSelected={setSelectedFilter}
      />
      <DetailEventCalendar
        isVisible={modalDetail}
        onClose={() => setModalDetail(false)}
        data={detailEvent}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />
    </>
  );
};

export default Calendar;
