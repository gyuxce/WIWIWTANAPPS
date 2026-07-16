import Card from "components/Card";
import CarouselTraining from "components/CarouselTraining";
import Header from "components/Header";
import Section from "components/Section";
import SectionLesson from "components/SectionLesson";
import SectionNextClass from "components/SectionNextClass";
import SectionSchedule from "components/SectionSchedule";
import Space from "components/Space";
import Text from "components/Text";
import colors from "configs/colors";
import images from "configs/images";
import { useExam } from "hooks/useExam";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import {
  ScrollView,
  View,
  Platform,
  Image,
  RefreshControl,
} from "react-native";
import { ICarouselInstance } from "react-native-reanimated-carousel";
import globalStyles from "utils/GlobalStyles";
import { scaledHorizontal } from "utils/ScaledService";
import { getCourseImageAndColor } from "utils/Utils";
import { listCarouselLanding } from "./DetailTrainingScreen/data";
import Options from "components/CarouselTraining/Options";
import dayjs from "dayjs";
import { DateProps, EventProps } from "types/CalendarTypes";
import { generateDate } from "utils/Calendar";
import { t } from "i18next";
import { useAuth } from "hooks/useAuth";
import NavigationService from "utils/NavigationService";

dayjs.locale("en", {
  weekStart: 1,
});
const TrainingScreen = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentDate = dayjs();
  const [today, setToday] = useState(currentDate);
  const [selectedDate, setSelectedDate] = useState(currentDate);
  const [modalFilter, setModalFilter] = useState(false);
  const [modalDetail, setModalDetail] = useState(false);
  const [listDate, setLisDate] = useState<DateProps[]>([]);
  const [detailEvent, setDetailEvent] = useState<EventProps[]>([]);
  const timeout: any = useRef(null);
  const [selectedFilter, setSelectedFilter] = useState<number[]>([1, 2, 3]);
  const { user } = useAuth();

  const dataFilter = [
    { id: 1, label: t("teori") },
    { id: 2, label: t("praktik") },
    { id: 3, label: t("softskill") },
  ];

  const ref = React.useRef<ICarouselInstance>(null);
  const {
    lessonClass,
    getLessonClass,
    trainingModuleProgress,
    getTrainingModuleProgress,
  } = useExam();
  const [weekClass, setWeekClass] = useState([] as any);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    //check if user has active subscription
    if (user?.is_subscription_active !== 1) {
      NavigationService.replace("InstallmentPaymentDetailScreen", {
        price_type: 2,
      });
    }

    initialData();
  }, []);

  const initialData = () => {
    getTrainingModuleProgress();
    getLessonClass({
      type: "collection",
      relations: ["course", "event", "module"],
      limit: 3,
      sort_by: "desc",
      order_by: "event.started_at",
      options: [
        ["filter,group,equal,2"],
        [
          `filter,event.started_at,between,${dayjs().format(
            "YYYY-MM-DD",
          )}|${dayjs().add(7, "day").format("YYYY-MM-DD")}`,
        ],
      ],
    }).then(({ data }) => {
      if (data) {
        setWeekClass(data);
      }
      setIsLoading(false);
    });
  };

  useEffect(() => {
    clearTimeout(timeout.current);
    timeout.current = setTimeout(() => {
      const list = generateDate(today.month(), today.year());
      getLessonClass(
        {
          type: "collection",
          relations: ["course", "event", "module"],
          options: [
            ["filter,group,equal,2"],
            [
              `filter,event.started_at,between,${dayjs(list[0]?.date).format(
                "YYYY-MM-DD",
              )}|${dayjs(list[list.length - 1]?.date).format("YYYY-MM-DD")}`,
            ],
            [`filter,course.type,in,${selectedFilter.join("|")}`],
          ],
        },
        true,
      ).then(() => {
        clearTimeout(timeout.current);
      });
    }, 1000);
  }, [today]);

  return (
    <View style={globalStyles().topSafeArea}>
      <Space height={Platform.OS === "android" ? 15 : 0} />

      <Header
        withBell
        totalNotification={4}
        textTitleJapanLeft="トレーニング"
        textTitleLeft="Pelatihan"
        withTextTitle
        titleLeft
        withBurger
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={initialData} />
        }
      >
        <Space height={30} />

        <SectionLesson
          data={trainingModuleProgress}
          hideBtnDetail
          //onPressItem={() => {}}
        />
        <Space height={30} />
        <Card
          style={{
            marginHorizontal: scaledHorizontal(25),
            alignItems: "center",
          }}
        >
          <Text
            size={30}
            color={colors.accent}
            variant="OpificioNeueRegular"
            type="reguler"
            textAlign="center"
          >
            Level Bahasa Jepang
          </Text>
          <Space height={30} />
          <Image
            source={images.landingTwo}
            style={{ height: 160, width: 200, resizeMode: "contain" }}
          />
          <CarouselTraining
            carouselRef={ref}
            setCurrentIndex={setCurrentIndex}
            listData={listCarouselLanding}
          />
          <Options
            carouselRef={ref}
            currentIndex={currentIndex}
            guestList={listCarouselLanding}
            setCurrentIndex={setCurrentIndex}
          />
        </Card>

        <Space height={30} />

        <Section
          textTitle="Jadwal Kelas Virtual"
          textJapan="オンライン授業のスケジュール"
        />
        <Space height={30} />

        <SectionSchedule
          dataFilter={dataFilter}
          event={lessonClass}
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
        <Space height={30} />

        <Section
          textTitle="Kelas Virtual Minggu Ini"
          textJapan="今週のオンライン授業"
        />
        <Space height={30} />
        {weekClass?.length > 0 ? (
          <SectionNextClass
            hideBtnDetail={weekClass?.length === 0}
            data={weekClass?.map((item: any) => ({
              image: getCourseImageAndColor(item?.course?.type_label)?.image,
              headLine: item?.course?.title,
              title: item?.title,
              date: item?.event?.started_at
                ? moment(item?.event?.started_at).format(
                    "dddd, DD/MM/YYYY HH:mm",
                  )
                : "-",
            }))}
          />
        ) : (
          <View>
            <Text textAlign="center">Tidak ada kelas virtual minggu ini.</Text>
          </View>
        )}
        <SectionNextClass hideBtnDetail />
        <Space height={30} />
        <Space height={80} />
      </ScrollView>
    </View>
  );
};

export default TrainingScreen;
