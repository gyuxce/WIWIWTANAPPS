//import Button from "components/Button";
import Card from "components/Card";
import ForumComment from "components/ForumComment";
import Header from "components/Header";
import Section from "components/Section";
import SectionDocument from "components/SectionDocument";
import SectionLesson from "components/SectionLesson";
import SectionNextClass from "components/SectionNextClass";
import SectionPraTest from "components/SectionPraTest";
import SectionSchedule from "components/SectionSchedule";
import SectionStatus from "components/SectionStatus";
import Space from "components/Space";
import Text from "components/Text";
import colors from "configs/colors";
import images from "configs/images";
import { useExam } from "hooks/useExam";
import { useForum } from "hooks/useForum";
import { useSeminar } from "hooks/useSeminar";
import { useUser } from "hooks/useUser";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import {
  ScrollView,
  View,
  Image,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import type { UserDocumentsType } from "types/DocTypes";
import type { ForumPostType } from "types/ForumTypes";
import type { RootType } from "types/NavigatorTypes";
import type { QueryType } from "types/QueryTypes";
import type { SeminarType } from "types/SeminarTypes";
import globalStyles from "utils/GlobalStyles";
import NavigationService from "utils/NavigationService";
import { scaledHorizontal, scaledVertical } from "utils/ScaledService";
import { getCourseImageAndColor, getStatus, isCloseToRight } from "utils/Utils";
import * as Calendar from "expo-calendar";
import { useNavigation } from "@react-navigation/core";
import dayjs from "dayjs";
import { DateProps, EventProps } from "types/CalendarTypes";
import { generateDate } from "utils/Calendar";
import { usePayment } from "hooks/usePayment";
import { useAuth } from "hooks/useAuth";
import { useCertification } from "hooks/useCertification";
import icons from "configs/icons";
import { useTranslation } from "react-i18next";

const HomeScreen = () => {
  const { auth, getMe, user } = useAuth();
  const [phase, setPhase] = useState(0);
  const [isSubscriptionActive, setIsSubscriptionActive] = useState(0);
  const navigation = useNavigation();
  const [seminarQuery] = useState({
    type: "pagination",
    relations: ["cover"],
    page: 1,
    limit: 5,
    options: [["filter,status,equal,1"]],
  } as QueryType);

  const { getTrendingPost, trendingPost } = useForum();
  const { getSeminarList, seminarList, metaSeminar } = useSeminar();
  const { statusTest, userDocs, getUserDocs, getUserAdmin } = useUser();
  const {
    getExamProgress,
    trainingModuleProgress,
    getTrainingModuleProgress,
    getLessonClass,
    lessonClass,
    examProgress,
  } = useExam();
  const { getCertificationUser, certificationUser } = useCertification();
  const { getPaymentStatusType, paymentStatusType } = usePayment();
  const [loadingTrendingPost, setLoadingTrendingPost] = useState(false);
  const currentDate = dayjs();
  const [today, setToday] = useState(currentDate);
  const [selectedDate, setSelectedDate] = useState(currentDate);
  const [modalFilter, setModalFilter] = useState(false);
  const [modalDetail, setModalDetail] = useState(false);
  const [listDate, setLisDate] = useState<DateProps[]>([]);
  const [detailEvent, setDetailEvent] = useState<EventProps[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<number[]>([1, 2, 3]);
  const timeout: any = useRef(null);
  const { t } = useTranslation();
  const dataFilter = [
    { id: 1, label: "Teori" },
    { id: 2, label: "Praktik" },
    { id: 3, label: "Soft Skill" },
  ];

  const [weekClass, setWeekClass] = useState([] as any);
  const [trendingQuery, _] = useState({
    type: "pagination",
    relations: ["user", "topic"],
    page: 1,
    limit: 3,
    type_post: "trending",
    q: "",
    order_by: "created_at",
    sort_by: "desc",
    options: [["filter,is_publish,equal,1"]],
  } as QueryType);

  const onPressDetail = (navigation: RootType) => {
    NavigationService.navigate(navigation);
  };

  const isUploadedDoc = () => {
    const data =
      userDocs && userDocs?.length > 0
        ? userDocs?.filter(
            (item: UserDocumentsType) =>
              (item?.slug === "CV" || item?.slug === "IJAZAH") &&
              item?.file?.id,
          )
        : [];
    return data?.length === 2;
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
                "YYYY-MM-DD HH:mm:ss",
              )}|${dayjs(list[list.length - 1]?.date).format(
                "YYYY-MM-DD HH:mm:ss",
              )}`,
            ],
            [`filter,course.type,in,${selectedFilter.join("|")}`],
          ],
        },
        true,
      ).then(() => {
        clearTimeout(timeout.current);
      });
    }, 1000);
  }, [today, modalFilter]);

  const getDataUserPhase = () => {
    getPaymentStatusType();
    getExamProgress();
    getMe(auth?.accessToken, auth).then(({ data }) => {
      setPhase(
        data?.last_phase === 2 && data?.join_reason === null
          ? 1
          : data?.last_phase,
      );
      setIsSubscriptionActive(data?.is_subscription_active);

      getUserDocs({
        type: "collection",
        relations: ["file"],
      }).then(() => {});

      if (data?.last_phase > 2) {
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
          getTrainingModuleProgress();
          getUserAdmin();
        });
      }

      if (data?.last_phase > 3) {
        getCertificationUser({
          type: "collection",
          relations: ["file"],
        });
      }

      if (data?.last_phase > 4) {
      }
    });
  };

  useEffect(() => {
    //calendar permission
    async function requestCalendarPermission() {
      await Calendar.requestCalendarPermissionsAsync();
    }
    requestCalendarPermission();

    //trending post
    setLoadingTrendingPost(true);
    getSeminarList([] as SeminarType[], seminarQuery).then(({ status }) => {
      getTrendingPost([] as ForumPostType[], trendingQuery).then(() => {
        setLoadingTrendingPost(false);
      });
    });

    //user data
    getDataUserPhase();
  }, []);

  const loadMoreSeminar = () => {
    if (metaSeminar.current_page < metaSeminar.last_page) {
      getSeminarList(seminarList, {
        ...seminarQuery,
        page: metaSeminar?.current_page + 1,
        limit: 5,
      });
    }
  };

  return (
    <View style={globalStyles().topSafeArea}>
      <Space height={Platform.OS === "android" ? 15 : 0} />
      <Header withBell totalNotification={0} withBurger withLogoLong />
      <ScrollView showsVerticalScrollIndicator={false}>
        <Space height={30} />
        {phase === 1 && (
          <>
            <Section textTitle="Status" textJapan="進捗" />
            <Space height={30} />
            <SectionPraTest dataTest={getStatus(examProgress, statusTest, t)} />
          </>
        )}

        {phase === 4 && (
          <View>
            <Section textTitle="Status" textJapan="進捗" />
            <Space height={30} />
            <SectionStatus
              title={t("sertifikasi")}
              image={images.sertifikasi}
              icon={icons.sertifikasiJapan}
              dataPayment={[
                {
                  title: t("daftar_sertifikasi"),
                  isChecklist: certificationUser?.length > 0 ? true : false,
                },
                {
                  title: t("review_kelulusan"),
                  isChecklist: user?.last_phase === 5,
                },
              ]}
              onPressDetail={() =>
                NavigationService.navigate("JapanCertificateScreen")
              }
            />
          </View>
        )}
        {phase === 5 && (
          <View>
            <Section textTitle="Status" textJapan="進捗" />
            <Space height={30} />
            <SectionStatus
              title={t("wawancara")}
              image={icons.wawancara}
              icon={icons.wawancaraJapan}
              dataPayment={[
                {
                  title: t("wawancara_kerja"),
                  isChecklist: user?.interview_status === 1 ? true : false,
                },
                {
                  title: t("keberangkatan"),
                  isChecklist: user?.interview_status === 1 ? true : false,
                },
              ]}
              onPressDetail={() =>
                NavigationService.navigate("FinalInterviewScreen")
              }
            />
          </View>
        )}

        {(phase === 3 || phase === 4 || phase === 5) && isSubscriptionActive === 1 && (
          <>
            <Section textTitle="Status" textJapan="進捗" />
            <Space height={30} />

            <SectionLesson data={trainingModuleProgress} />
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
                  image: getCourseImageAndColor(item?.course?.type_label)
                    ?.image,
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
                <Text textAlign="center">
                  Tidak ada kelas virtual minggu ini.
                </Text>
              </View>
            )}

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
          </>
        )}
        {(phase === 3 || phase === 4 || phase === 5) && isSubscriptionActive !== 1 && (
          <View style={{
            marginHorizontal: scaledHorizontal(25),
            backgroundColor: '#FFECEC',
            borderColor: '#FF4D4F',
            borderWidth: 1,
            borderRadius: 10,
            paddingVertical: 12,
            paddingHorizontal: 14,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 12,
          }}>
            <Text style={{
              fontSize:14
            }}>{t("unpaid_due_payment")}</Text>
          </View>
        )}
        {(phase === 2 || ((phase === 3 || phase === 4 || phase === 5) && isSubscriptionActive !== 1)) && (
          
          <View>
            <Section textTitle="Status" textJapan="進捗" />
            <Space height={30} />
            <SectionStatus
              title={t("pembayaran")}
              image={images.perjalananStatus}
              icon={icons.japanBook}
              dataPayment={[
                {
                  title: t("biaya_administrasi"),
                  onPressDetail: () => onPressDetail("PaymentAdministration"),
                  isChecklist:
                    paymentStatusType?.is_administration_payment_completed,
                },
                {
                  title: t("biaya_pelatihan"),
                  onPressDetail: () =>
                    onPressDetail("InstallmentPaymentScreen"),
                  isChecklist: paymentStatusType?.is_training_payment_completed,
                },
              ]}
              onPressDetail={() =>
                NavigationService.navigate("PaymentAdministration")
              }
            />
          </View>
        )}

        <Space height={30} />
        {!isUploadedDoc() && phase === 1 && (
          <>
            <SectionDocument />
            <Space height={30} />
          </>
        )}
        <Section textTitle="Trending di Forum" textJapan="フォーラムで人気" />
        <Space height={10} />
        {loadingTrendingPost ? (
          <View>
            <Space height={100} />
            <ActivityIndicator size={"large"} color={colors.black} />
          </View>
        ) : (
          <View>
            {trendingPost?.length > 0 ? (
              <>
                {trendingPost.map((item, index) => {
                  return <ForumComment key={index} post={item} />;
                })}
              </>
            ) : (
              <View>
                <Space height={20} />
                <Text textAlign="center">
                  Tidak ada trending post saat ini.
                </Text>
              </View>
            )}
          </View>
        )}

        <Space height={30} />
        <Section textTitle="Belajar lebih jauh" textJapan="もっと学ぼう!" />
        <Card
          style={{
            marginTop: 30,
            marginHorizontal: scaledHorizontal(25),
            paddingHorizontal: -12,
          }}
        >
          {seminarList?.length > 0 ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              onScrollEndDrag={event => {
                if (isCloseToRight(event.nativeEvent)) {
                  loadMoreSeminar();
                }
              }}
            >
              {seminarList.map((item, index) => {
                return (
                  <TouchableOpacity
                    key={index}
                    onPress={() =>
                      NavigationService.navigate("BannerDetailScreen", {
                        id: item?.id,
                      })
                    }
                  >
                    <Image
                      source={
                        item?.cover
                          ? { uri: item?.cover?.url }
                          : images.placeholder
                      }
                      style={{
                        height: 177,
                        width: 177,
                        marginLeft: 12,
                        marginRight: seminarList.length - 1 === index ? 12 : 0,
                        resizeMode: "cover",
                      }}
                    />
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          ) : (
            <Text
              textAlign="center"
              size={14}
              style={{ paddingVertical: scaledVertical(20) }}
            >
              Tidak ada seminar yang tersedia
            </Text>
          )}
        </Card>

        <Space height={70} />
      </ScrollView>
    </View>
  );
};

export default HomeScreen;
