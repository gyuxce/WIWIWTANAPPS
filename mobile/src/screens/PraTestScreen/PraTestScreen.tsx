import Button from "components/Button";
import Header from "components/Header";
import Section from "components/Section";
import Space from "components/Space";
import Text from "components/Text";
import colors from "configs/colors";
import icons from "configs/icons";
import images from "configs/images";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Image,
  Linking,
  Platform,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import globalStyles from "utils/GlobalStyles";
import NavigationService from "utils/NavigationService";
import {
  scaledFontSize,
  scaledHorizontal,
  scaledVertical,
} from "utils/ScaledService";
import type { ModalAlertProps } from "types/AppTypes";
import ModalAlert from "components/ModalAlert";

import LanguageTest from "./LanguageTest/LanguageTest";
import CharacterTest from "./CharacterTest/CharacterTest";
import styles from "./styles";
import InterviewTest from "./InterviewTest/InterviewTest";
import Card from "components/Card";
import { useExam } from "hooks/useExam";
import {
  ExamProgressType,
  IntroductionType,
  ScheduleType,
} from "types/ExamTypes";
import ReviewTest from "components/ReviewTest";
import SuccessTest from "components/SuccessTest";
import ScheduleActionSheet from "components/ScheduleActionSheet/ScheduleActionSheet";
import BottomSheet from "@gorhom/bottom-sheet";
import { getStatus, wait } from "utils/Utils";
import dayjs from "dayjs";
import {
  apiExamQuestion,
  apiExamSetStatus,
  apiProgressIntroduction,
  apiSetSessionBahasa,
  apiSubmitSchedule,
} from "services/ExamServices";
import { useAuth } from "hooks/useAuth";
import { ErrorStatus } from "utils/ErrorStatus";
import { useDispatch } from "react-redux";
import * as Calendar from "expo-calendar";
import { useUser } from "hooks/useUser";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/core";
import { UserDocumentsType } from "types/DocTypes";
import { onChangeRoute } from "stores/app/appSlice";
import FailedInterview from "./FailedInterview/FailedInterview";
import SuccessInterview from "./SuccessInterview/SuccessInterview";
import { apiUpdateProfile } from "services/UserService";
import { onErrorState } from "stores/error/errorSlice";
import AdditionalInfo from "./AdditionalInfo/AdditionalInfo";
import moment from "moment";
import SectionWithCheck from "components/SectionWithCheck/SectionWithCheck";
import { useTranslation } from "react-i18next";

const PraTestScreen = () => {
  const { t } = useTranslation();
  const [testSection, setTestSection] = useState({
    title: t("tes_bahasa"),
    id: "LanguageTest",
  });
  const { auth, user, getMe } = useAuth();

  const dispatch = useDispatch();
  const { statusTest } = useUser();
  const [showModal, setShowModal] = useState({} as ModalAlertProps);
  const [isChecked, setIsChecked] = useState(false);
  const { getExamProgress, getExamSchedule, examSchedule, examProgress } =
    useExam();
  const [languageTest, setLanguageTest] = useState({} as ExamProgressType);
  const [characterTest, setCharacterTest] = useState({} as ExamProgressType);
  const [qnaTest, setQnaTest] = useState({} as ExamProgressType);
  const actionSheetRef = useRef<BottomSheet>(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const snapPoints = useMemo(() => [480], []);
  const [schedule, setSelectedSchedule] = useState({} as ScheduleType);
  //const [character, setCharacter] = useState({} as )
  const [isScheduleActive, setIsScheduleActive] = useState(false);
  const [introductionBahasa, setIntroductionBahasa] = useState(
    {} as IntroductionType,
  );
  const [introductionKarakter, setIntroductionKarakter] = useState(
    {} as IntroductionType,
  );
  const { openAdminWhatsapp, getUserAdmin } = useUser();
  const navigation = useNavigation();
  const { userDocs, getUserDocs } = useUser();
  const [joinReason, setJoinReason] = useState("");
  const [loadingCalendar, setLoadingCalendar] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    //getData();

    initialData();
  }, []);

  const initialData = () => {
    getUserAdmin();
    apiProgressIntroduction(auth?.accessToken, "bahasa").then(values => {
      if (values?.id) {
        setIntroductionBahasa(values);
      } else {
        ErrorStatus(500, dispatch);
      }
      apiProgressIntroduction(auth?.accessToken, "karakter").then(values => {
        if (values?.id) {
          setIntroductionKarakter(values);
        } else {
          ErrorStatus(500, dispatch);
        }
      });
      setIsLoading(false);
    });
    getData();
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      getData();
      getUserDocs({
        type: "collection",
        relations: ["file"],
      });
    });
    return unsubscribe;
  }, []);

  const getData = () => {
    getExamProgress().then(({ data }) => {
      if (data) {
        let language = data.filter(
          item => item.progress.title === "Pra Tes bahasa",
        );
        let character = data.filter(
          item => item.progress.title === "Pra Tes karakter",
        );
        let qna = data.filter(item => item.progress.title === "Pra Tes QNA");
        setLanguageTest(language?.[0] || ({} as ExamProgressType));
        setCharacterTest(character?.[0] || ({} as ExamProgressType));
        setQnaTest(qna?.[0] || ({} as ExamProgressType));

        if (qna?.[0]?.id) {
          getExamSchedule(qna?.[0]?.id).then(({ data }) => {
            if (data && data?.exam_schedule_active) {
              setIsScheduleActive(true);
              setSelectedSchedule(data?.exam_schedule_active);
            }
          });
        }
      }
    });
  };

  const checkLocaleCalendarExists = async () => {
    async function getDefaultCalendarSource() {
      const defaultCalendar = await Calendar.getDefaultCalendarAsync();
      return defaultCalendar.source;
    }

    const defaultCalendarSource =
      Platform.OS === "ios"
        ? await getDefaultCalendarSource()
        : { isLocalAccount: true, name: "Wiwitan" };
    const calendars = await Calendar.getCalendarsAsync();

    const selectedCalendar =
      Platform.OS === "ios"
        ? calendars.find(calendar => calendar.title === "Wiwitan Schedule")
        : calendars.find(calendar => calendar.ownerAccount === user?.email);

    if (selectedCalendar === undefined) {
      const calendarId = await Calendar.createCalendarAsync({
        title: "Wiwitan Schedule",
        color: "red",
        entityType: Calendar.EntityTypes.EVENT,
        //@ts-ignore
        sourceId: defaultCalendarSource.id,
        //@ts-ignore
        source: defaultCalendarSource,
        type: Calendar.EntityTypes.EVENT,
        name: "Wiwitan",
        ownerAccount: user?.email,
        accessLevel: Calendar.CalendarAccessLevel.OWNER,
        isVisible: true,
        isSynced: true,
      });

      return calendarId;
    } else {
      return selectedCalendar?.id;
    }
  };

  const createEvent = async (date: Date, link: string) => {
    if (Platform.OS === "ios") {
      const res = await Calendar.requestRemindersPermissionsAsync();
      if (res?.status !== "granted") {
        alert("Permission to access the reminder is denied");
        return;
      }
    }

    const { status } = await Calendar.requestCalendarPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access the calendar is denied.");
      return;
    }
    setLoadingCalendar(true);
    checkLocaleCalendarExists().then(async value => {
      // const calendarId = await Calendar.getDefaultCalendarAsync();
      const eventDetails: Partial<Calendar.Event> = {
        title: "Test Tanya Jawab Wiwitan",
        calendarId: value,
        startDate: date,
        endDate: dayjs(date).add(2, "hour").toDate(),
        location: "",
        notes: `Link interview di link ${link}`,
        url: link,
        guestsCanSeeGuests: true,
        alarms: [
          { relativeOffset: -30, method: Calendar.AlarmMethod.ALARM },
          { relativeOffset: -15, method: Calendar.AlarmMethod.ALARM },
          { relativeOffset: 0, method: Calendar.AlarmMethod.ALARM },
        ],
        organizer: "Wiwitan",
        organizerEmail: "wiwitan@62teknologi.com",
      };

      try {
        await Calendar.createEventAsync(value, eventDetails);
        setLoadingCalendar(false);
        alert(`Event added to calendar`);
      } catch (error) {
        alert(`Error adding event to calendar: ${error}`);
      }
    });
  };

  const onPressTest = (section: { title: string; id: string }) => {
    if (section.id !== testSection.id) {
      setTestSection(section);
      setIsChecked(false);
    }
  };

  const getExamBahasaQuestion = (sessionId: string) => {
    apiExamQuestion(auth?.accessToken, sessionId).then(({ data }) => {
      //const exist = sessionTestBahasa.some(item => data?.id === item?.id);
      // if (!exist) {
      //   const joinData = [data, ...sessionTestBahasa];
      //   dispatch(onPushTestBahasaSession(joinData));

      NavigationService.push("DownloadScreen", {
        data: data,
        isNext: false,
      });

      setShowModal({ showModal: false, title: "" });
      //}
      // else {
      //   const currentUpdateQuestion = new Date(data?.updated_at);
      //   sessionTestBahasa?.map((item, index) => {
      //     if (item.id === sessionId) {
      //       if (new Date(item.updated_at) < currentUpdateQuestion) {
      //         const dataSession = [...sessionTestBahasa];
      //         //@ts-ignore
      //         dataSession[index] = {
      //           ...dataSession[index],
      //           updated_at: data?.updated_at,
      //           title: data?.title,
      //           description: data?.description,
      //           duration: data?.duration,
      //           count_question: data?.count_question,
      //           language_type: data?.language_type,
      //           language_type_label: data?.language_type_label,
      //           question: data?.question,
      //           file: {
      //             ...dataSession[index]?.file,
      //             uuid: data?.file?.uuid,
      //             id: data?.file?.id,
      //             created_at: data?.file?.created_at,
      //             updated_at: data?.file?.updated_at,
      //             adapter: data?.file?.adapter,
      //             filename: data?.file?.filename,
      //             url: data?.file?.url,
      //             local_url: data?.file?.url,
      //             height: data?.file?.height,
      //             width: data?.file?.width,
      //             size: data?.file?.size,
      //             downloadedUrl:
      //               data?.file?.filename !== item?.file?.filename
      //                 ? ""
      //                 : item?.file?.downloadedUrl,
      //           },
      //         };

      //         dispatch(onPushTestBahasaSession(dataSession));

      //         NavigationService.push("DownloadScreen", {
      //           data: dataSession?.[index] || ({} as QuestionSessionType),
      //           isNext: false,
      //         });
      //         setShowModal({ showModal: false, title: "" });
      //       } else {
      //         NavigationService.push("DownloadScreen", {
      //           data: item,
      //           isNext: false,
      //         });
      //         setShowModal({ showModal: false, title: "" });
      //       }
      //     }
      //   });
      // }
    });
  };

  const onTestModal = () => {
    setShowModal({
      showModal: true,
      titleBig: t("memulai_tes"),
      title: t("description_prates_bahasa"),
      leftText: t("mulai"),
      iconImage: icons.warningRed,
      leftFunction: () => {
        if (languageTest?.progress?.currentSessionLanguage) {
          if (languageTest?.progress?.currentSessionLanguage) {
            // apiSetSessionBahasa(
            //   auth?.accessToken,
            //   languageTest?.progress?.currentSessionLanguage?.id,
            // ).then(()=> {})
            getExamBahasaQuestion(
              languageTest?.progress?.currentSessionLanguage?.id,
            );
          }
        } else {
          if (
            languageTest?.progress?.sesi?.length > 0 &&
            languageTest?.progress?.sesi?.[0]?.id
          ) {
            apiExamSetStatus(auth?.accessToken, {
              user_exam_id: languageTest?.id,
              status: 3,
              finished_at: "",
              started_at: "",
            }).then(() => {
              apiSetSessionBahasa(
                auth?.accessToken,
                //@ts-ignore
                languageTest?.progress?.sesi?.[0]?.id,
              ).then(({ message }) => {
                if (message) {
                  getExamBahasaQuestion(
                    languageTest?.progress?.sesi?.[0]?.id || "",
                  );
                }
              });
            });
          }
          //}
        }
      },
      rightText: t("cek_kembali_deh"),
      rightFunction: () => {
        setShowModal({ showModal: false, title: "" });
      },
    });
  };

  const onTestCharacter = () => {
    if (characterTest?.progress?.link_url) {
      apiExamSetStatus(auth?.accessToken, {
        user_exam_id: characterTest?.id,
        status: 3,
        finished_at: "",
        started_at: "",
      }).then(() => {
        NavigationService.navigate("WebviewCharacter", {
          link: characterTest?.progress?.link_url,
        });
      });
    } else {
      Alert.alert("Test Character tidak tersedia. Hubungi Admin wiwitan");
    }
  };

  let listTest = [
    {
      title: t("tes_bahasa"),
      id: "LanguageTest",
    },
    {
      title: t("tes_karakter"),
      id: "CharacterTest",
    },
    {
      title: t("tes_tanya_jawab"),
      id: "InterviewTest",
    },
  ];

  const onPressSubmitSchedule = () => {
    if (!schedule?.id) {
      setShowModal({
        showModal: true,
        titleBig: t("jadwal_tidak_tersedia"),
        title: t("jadwal_tidak_tersedia_hubungi"),
        leftText: t("hubungi_wiwitan"),
        iconImage: icons.warningRed,
        leftFunction: () => {
          openAdminWhatsapp(false);
        },
      });
      return;
    }
    setShowModal({
      showModal: true,
      titleBig: t("tetapkan_jadwal"),
      title: t("jadwal_tidak_dapat_diubah"),
      leftText: t("tetapkan_jadwal"),
      iconImage: icons.calendarRed,
      leftFunction: () => {
        apiSubmitSchedule(auth?.accessToken, qnaTest?.id, schedule?.id).then(
          ({ data }) => {
            if (data) {
              setIsScheduleActive(true);
              setShowModal({ showModal: false, title: "" });
            }
          },
        );
      },
      rightText: t("cek_kembali_deh"),
      rightFunction: () => {
        setShowModal({ showModal: false, title: "" });
        wait(500).then(() => {
          actionSheetRef?.current?.snapToPosition(380);
        });
      },
    });
  };

  const isUploadedDoc = () => {
    const data =
      userDocs.length > 0
        ? userDocs?.filter(
            (item: UserDocumentsType) =>
              (item?.slug === "CV" || item?.slug === "IJAZAH") &&
              item?.file?.id,
          )
        : [];
    return data?.length === 2;
  };

  const onSubmitJoin = () => {
    setSubmitLoading(true);
    apiUpdateProfile(
      auth?.accessToken,
      user?.name,
      user?.name_alias,
      user?.email,
      user?.phone,
      user?.city?.id,
      user?.address,
      user?.profilePicture?.id,
      joinReason,
    ).then(({ success }) => {
      if (success) {
        setSubmitLoading(false);
        getMe(auth?.accessToken, auth).then(({ status }) => {
          if (status) {
            setSubmitLoading(false);
          }
        });
      } else {
        dispatch(
          onErrorState({
            visible: true,
            text: "Terjadi kesalahan pada alasan bergabung",
            icon: icons.searchClose,
            withCloseIcon: true,
            withIcon: true,
          }),
        );
      }
    });
  };

  const ScheduleTest = ({ withLink }: { withLink: boolean }) => {
    return (
      <View>
        <View
          style={{
            flexDirection: "row",
            gap: 10,
            alignItems: "center",
            marginBottom: scaledVertical(15),
          }}
        >
          <Image
            source={icons.calendarTest}
            style={{ height: 20, width: 20, resizeMode: "contain" }}
          />
          <Text
            size={12}
            variant="CenturyGothicBold"
            type="bold"
            color={colors.accent}
          >
            {moment(schedule?.start_date).format("DD[ ]MMMM[ ]YYYY")}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            gap: 10,
            alignItems: "center",
            marginBottom: scaledVertical(15),
          }}
        >
          <Image
            source={icons.clockTest}
            style={{ height: 20, width: 20, resizeMode: "contain" }}
          />
          <Text
            size={12}
            variant="CenturyGothicBold"
            type="bold"
            color={colors.accent}
          >
            {moment(schedule?.start_date).format("HH[.]mm [WIB]")}
          </Text>
        </View>
        {withLink && (
          <TouchableOpacity
            onPress={() => {
              Linking.openURL(examSchedule?.link);
            }}
            style={{
              flexDirection: "row",
              gap: 10,
              alignItems: "center",
              marginBottom: scaledVertical(15),
            }}
          >
            <Image
              source={icons.linkTest}
              style={{ height: 20, width: 20, resizeMode: "contain" }}
            />
            <Text
              size={12}
              variant="CenturyGothicBold"
              type="bold"
              color={colors.red}
            >
              {examSchedule?.link || "-"}
            </Text>
          </TouchableOpacity>
        )}

        <Space height={20} />
      </View>
    );
  };

  return (
    <View style={globalStyles().topSafeArea}>
      <Header
        withBell
        totalNotification={4}
        withBurger
        withTextTitle
        textTitleJapanLeft="事前テスト"
        textTitleLeft="Pra Tes"
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={initialData} />
        }
      >
        <Space height={25} />

        <Card
          style={{
            marginHorizontal: scaledHorizontal(25),
          }}
        >
          <SectionWithCheck
            // @ts-ignore
            data={getStatus(examProgress, statusTest, t)}
            imageLeft={images.imagePerjalanan}
            imageJapan={icons.japanBook}
            title={t("pratest")}
          />
        </Card>

        <Space height={25} />
        <View
          style={{
            marginHorizontal: scaledHorizontal(25),
            flexDirection: "row",
            gap: 5,
          }}
        >
          {listTest.map((item, index) => {
            return (
              <Button
                key={index}
                onPress={() => onPressTest(item)}
                title={item.title}
                style={{
                  borderWidth: testSection.id === item.id ? 1 : 0,
                  flex: 1,
                  borderRadius: 6,
                  paddingVertical: 8,
                  backgroundColor:
                    testSection.id === item.id ? colors.white : colors.stone100,
                }}
                textType="bold"
                variant="CenturyGothicBold"
                textStyle={{ fontWeight: "600", fontSize: 12 }}
                withBorder={false}
              />
            );
          })}
        </View>

        <Space height={25} />
        {testSection.id === "LanguageTest" ? (
          <View>
            <Section textTitle="Tes Bakat Bahasa" textJapan="言語テスト" />
            <Space height={20} />

            {languageTest?.status === null || languageTest?.status === 3 ? (
              <View>
                <LanguageTest data={introductionBahasa} />
                <Space height={20} />
                <TouchableOpacity
                  style={styles.containerCheckbox}
                  onPress={() => {
                    setIsChecked(!isChecked);
                  }}
                >
                  <View>
                    <Image
                      source={isChecked ? icons.checklistBox : icons.box}
                      style={{
                        height: 18,
                        width: 18,
                        resizeMode: "contain",
                      }}
                    />
                  </View>
                  <Text size={12} color={colors.black} style={{ flex: 1 }}>
                    {t("agreement_prates")}
                  </Text>
                </TouchableOpacity>
                <Space height={20} />
                <Button
                  onPress={onTestModal}
                  title={t("mulai_asesmen")}
                  style={{
                    paddingVertical: 12,
                    marginHorizontal: scaledHorizontal(25),
                  }}
                  textStyle={{ fontSize: 12 }}
                  textType="bold"
                  variant="CenturyGothicBold"
                  withBorder={isChecked ? true : false}
                  disabled={!isChecked}
                />
              </View>
            ) : languageTest?.status === 1 ? (
              <View>
                <SuccessTest />
                <Space height={20} />
              </View>
            ) : null}
          </View>
        ) : testSection.id === "CharacterTest" ? (
          <View>
            <Section textTitle="Tes Karakter" textJapan="性格テスト" />
            <Space height={20} />
            {characterTest?.status === null ? (
              <View>
                <CharacterTest data={introductionKarakter} />
                <Space height={20} />
                <TouchableOpacity
                  style={styles.containerCheckbox}
                  onPress={() => {
                    setIsChecked(!isChecked);
                  }}
                >
                  <View>
                    <Image
                      source={isChecked ? icons.checklistBox : icons.box}
                      style={{
                        height: 18,
                        width: 18,
                        resizeMode: "contain",
                      }}
                    />
                  </View>
                  <Text size={12} color={colors.black} style={{ flex: 1 }}>
                    {t("agreement_prates")}
                  </Text>
                </TouchableOpacity>
                <Space height={20} />
                <Button
                  onPress={onTestCharacter}
                  title={t("mulai_asesmen")}
                  style={{
                    paddingVertical: 12,
                    marginHorizontal: scaledHorizontal(25),
                  }}
                  textStyle={{ fontSize: 12 }}
                  textType="bold"
                  variant="CenturyGothicBold"
                  withBorder={isChecked ? true : false}
                  disabled={!isChecked}
                />
              </View>
            ) : characterTest?.status === 3 ? (
              <View>
                <ReviewTest />
                <Space height={20} />
                <Button
                  onPress={onTestCharacter}
                  title={"Lihat Test Karakter"}
                  style={{
                    paddingVertical: 12,
                    marginHorizontal: scaledHorizontal(25),
                  }}
                  textStyle={{ fontSize: 12 }}
                  textType="bold"
                  variant="CenturyGothicBold"
                  withBorder={true}
                />
              </View>
            ) : characterTest?.status === 1 ? (
              <View>
                <SuccessTest />
                <Space height={20} />
              </View>
            ) : null}
          </View>
        ) : (
          <View>
            <Section textTitle="Sesi Tanya Jawab" textJapan="質疑応答" />
            <Space height={20} />
            {qnaTest?.status === 5 && (
              <SuccessInterview
                joinReason={joinReason}
                setJoinReason={setJoinReason}
                user={user}
              />
            )}
            {qnaTest?.status === 6 && (
              <FailedInterview
                onClickAdminWhatsapp={() => openAdminWhatsapp(false)}
              />
            )}
            <Card
              style={{
                marginHorizontal: scaledHorizontal(25),
                opacity: qnaTest?.status === 5 || qnaTest?.status === 6 ? 0 : 1,
              }}
            >
              {qnaTest?.status !== 5 &&
                qnaTest?.status !== 6 &&
                !isScheduleActive && (
                  <View>
                    {schedule?.id && <ScheduleTest withLink={false} />}
                    <Button
                      onPress={() => {
                        !isUploadedDoc()
                          ? setShowModal({
                              showModal: true,
                              titleBig: t("yuk_lengkapi_dokumen"),
                              title: t("untuk_memperlancar_proses"),
                              leftText: t("lengkapi_dokumen"),
                              iconImage: images.homeDocument,
                              imageSize: 160,
                              leftFunction: () => {
                                setShowModal({ showModal: false, title: "" });
                                dispatch(onChangeRoute("DocumentScreen"));
                                NavigationService.navigate("DocumentScreen");
                              },
                              rightText: t("kembali"),
                              rightFunction: () => {
                                setShowModal({ showModal: false, title: "" });
                              },
                            })
                          : actionSheetRef?.current?.snapToPosition(380);
                      }}
                      title={t("pilih_tanggal_dan_jam")}
                      style={{ paddingVertical: 12 }}
                      textStyle={{ fontSize: 12 }}
                      textType="bold"
                      variant="CenturyGothicBold"
                      withBorder={
                        languageTest?.status === 1 &&
                        characterTest?.status === 1
                      }
                      disabled={
                        !(
                          languageTest?.status === 1 &&
                          characterTest?.status === 1
                        )
                      }
                    />
                  </View>
                )}

              {isScheduleActive &&
              languageTest?.status === 1 &&
              characterTest?.status === 1 &&
              qnaTest?.status !== 5 &&
              qnaTest?.status !== 6 ? (
                <View>
                  <ScheduleTest withLink={true} />

                  <Button
                    onPress={() => {
                      createEvent(
                        moment(schedule?.start_date).toDate(),
                        qnaTest?.link,
                      );
                    }}
                    isLoading={loadingCalendar}
                    title={t("tambahkan_kalendar")}
                    style={{ paddingVertical: 12 }}
                    innerStyle={{ alignItems: "center", gap: 10 }}
                    textStyle={{ fontSize: 12 }}
                    textType="bold"
                    variant="CenturyGothicBold"
                    withBorder={true}
                    icon={icons.calendar}
                    iconStyle={{
                      height: 24,
                      width: 24,
                      resizeMode: "contain",
                    }}
                  />
                </View>
              ) : null}
            </Card>
            {qnaTest?.status !== 5 && qnaTest?.status !== 6 && (
              <View>
                {/* {isScheduleActive && (
                  <View
                    style={{
                      marginHorizontal: scaledHorizontal(25),
                      alignItems: "center",
                    }}
                  >
                    <Space height={20} />
                    <Text
                      size={12}
                      textAlign="center"
                      variant="CenturyGothicRegular"
                    >
                      Jadwal wawancara kerja sudah ditentukan oleh Admin.
                      Apabila ada kendala dapat menghubungi Admin.
                    </Text>
                    <Space height={20} />
                    <Button
                      onPress={() => openAdminWhatsapp(true)}
                      title={"Hubungi Admin Wiwitan"}
                      style={{
                        paddingVertical: 12,
                        width: "70%",
                      }}
                      textStyle={{ fontSize: 12 }}
                      textType="bold"
                      variant="CenturyGothicBold"
                      withBorder={true}
                    />
                  </View>
                )} */}
                <Space height={20} />
                {isScheduleActive &&
                  qnaTest?.status !== 5 &&
                  qnaTest?.status !== 6 && (
                    <AdditionalInfo
                      onClickAdminWhatsapp={() => openAdminWhatsapp(false)}
                    />
                  )}

                {!isScheduleActive &&
                  qnaTest?.status !== 5 &&
                  qnaTest?.status !== 6 && <InterviewTest />}

                <Space height={20} />
                {!isScheduleActive && (
                  <View>
                    <TouchableOpacity
                      style={styles.containerCheckbox}
                      onPress={() => {
                        setIsChecked(!isChecked);
                      }}
                    >
                      <View>
                        <Image
                          source={isChecked ? icons.checklistBox : icons.box}
                          style={{
                            height: 18,
                            width: 18,
                            resizeMode: "contain",
                          }}
                        />
                      </View>
                      <Text size={12} color={colors.black} style={{ flex: 1 }}>
                        {t("membaca_dan_setuju_qa")}
                      </Text>
                    </TouchableOpacity>
                    <Space height={20} />
                    <Button
                      onPress={onPressSubmitSchedule}
                      title={t("setuju_interview")}
                      style={{
                        paddingVertical: 12,
                        marginHorizontal: scaledHorizontal(25),
                      }}
                      textStyle={{ fontSize: 12 }}
                      textType="bold"
                      variant="CenturyGothicBold"
                      withBorder={isChecked ? true : false}
                      disabled={!isChecked}
                    />
                  </View>
                )}
              </View>
            )}
          </View>
        )}

        {qnaTest.status !== 5 && qnaTest.status !== 6 ? (
          <View style={{ marginHorizontal: scaledHorizontal(25) }}>
            <Space height={5} />
            <Button
              onPress={() => NavigationService.back()}
              title={t("kembali_ke_beranda")}
              style={{
                paddingVertical: 12,
                backgroundColor: colors.stone100,
              }}
              withBorder={false}
              textStyle={{ fontSize: 12 }}
              textType="bold"
              variant="CenturyGothicBold"
            />
          </View>
        ) : null}

        <Space height={150} />
      </ScrollView>

      {testSection.id === "InterviewTest" &&
        qnaTest.status === 5 &&
        !user?.join_reason && (
          <Card
            style={{
              borderWidth: 1,
              borderRadius: 0,
              borderTopEndRadius: 12,
              borderTopStartRadius: 12,
              borderColor: colors.black,
              borderStyle: "solid",
              position: "absolute",
              bottom: 0,
            }}
          >
            <Button
              isLoading={submitLoading}
              variant="CenturyGothicBold"
              textType="bold"
              title="Bergabung dengan Wiwitan"
              type="light"
              style={{ paddingVertical: 12, minWidth: "100%" }}
              textStyle={{
                fontSize: scaledFontSize(20),
                lineHeight: 18,
              }}
              disabled={!(joinReason.length > 1)}
              withBorder={joinReason.length > 1}
              onPress={onSubmitJoin}
            />

            <Button
              onPress={() => {
                setShowModal({
                  showModal: true,
                  titleBig: "Batal bergabung?",
                  title:
                    "Kami melihat dirimu memiliki potensi di bidang ini, namun jika kamu berencana untuk tidak bergabung maka akunmu akan dihapus.",
                  leftText: "Batal bergabung !",
                  iconImage: images.failedBalloon,
                  imageSize: 160,
                  leftFunction: () => {
                    dispatch(onChangeRoute("ProfileScreen"));
                    NavigationService.navigate("PrivasiPolicyScreen");
                  },
                  rightText: "Kembali",
                  rightFunction: () => {
                    setShowModal({ showModal: false, title: "" });
                  },
                });
              }}
              variant="CenturyGothicBold"
              textType="bold"
              title="Batal bergabung"
              type="light"
              style={{ paddingVertical: 12, minWidth: "100%" }}
              withBorder={false}
              textStyle={{
                fontSize: scaledFontSize(20),
                lineHeight: 18,
              }}
            />
          </Card>
        )}

      <ModalAlert
        onHide={() => setShowModal({ showModal: false, title: "" })}
        showModal={showModal?.showModal}
        animation={"zoom"}
        title={showModal?.title}
        leftFunction={showModal.leftFunction}
        rightFunction={showModal.rightFunction}
        leftText={showModal.leftText}
        rightText={showModal.rightText}
        iconImage={showModal?.iconImage}
        withIcon
        titleBig={showModal.titleBig}
        imageSize={showModal?.imageSize}
      />
      {testSection.id === "InterviewTest" && (
        <ScheduleActionSheet
          actionSheetRef={actionSheetRef}
          snapPoints={snapPoints}
          data={examSchedule?.exam_schedules || []}
          selectedSchedule={schedule}
          setSelectedSchedule={setSelectedSchedule}
        />
      )}
    </View>
  );
};

export default PraTestScreen;
