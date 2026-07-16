import type { RouteProp } from "@react-navigation/core";
import { useNavigation } from "@react-navigation/core";
import type { StackNavigationProp } from "@react-navigation/stack";
import Button from "components/Button";
import Card from "components/Card";
import Space from "components/Space";
import Text from "components/Text";
import colors from "configs/colors";
import icons from "configs/icons";
import { Video, ResizeMode, Audio } from "expo-av";
import { useAuth } from "hooks/useAuth";
import { useExam } from "hooks/useExam";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  AppState,
  Image,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch } from "react-redux";
import {
  apiExamQuestion,
  apiExamSetStatus,
  apiPostAnswer,
  apiPutAnswer,
  apiSetSessionBahasa,
} from "services/ExamServices";
import { onErrorState } from "stores/error/errorSlice";
import type {
  ExamProgressType,
  PostAnswerType,
  PutAnswerType,
  //QuestionSessionType,
} from "types/ExamTypes";
import type { RootStackParamList } from "types/NavigatorTypes";
import { ErrorStatus } from "utils/ErrorStatus";
import globalStyles from "utils/GlobalStyles";
import NavigationService from "utils/NavigationService";
import {
  scaledFontSize,
  scaledHorizontal,
  scaledVertical,
} from "utils/ScaledService";
import { alphabet, millisToTime, videoExtensions } from "utils/Utils";
import * as FileSystem from "expo-file-system";
import LoadingModal from "components/LoadingModal/LoadingModal";
import dayjs from "dayjs";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { onPratestMedia } from "stores/persist/persistSlice";
import { usePersist } from "hooks/usePersist";

// import { usePersist } from "hooks/usePersist";
// import { onPushTestBahasaSession } from "stores/persist/persistSlice";

type QuestionListRouteType = RouteProp<
  RootStackParamList,
  "QuestionListScreen"
>;

type QuestionListNavigationProp = StackNavigationProp<
  RootStackParamList,
  "QuestionListScreen"
>;

type Prop = {
  route: QuestionListRouteType;
  navigation: QuestionListNavigationProp;
};

const QuestionListScreen = ({ route }: Prop) => {
  const [widthText, setWidthText] = useState(0);
  const [widthJapan, setWidthJapan] = useState(0);
  // const [sessionProgress, setSessionProgress] = useState(
  //   {} as ExamProgressType,
  // );
  const [session, setSession] = useState(0);
  const { examProgress, getExamProgress } = useExam();
  const { auth } = useAuth();
  //const { sessionTestBahasa } = usePersist();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const video = useRef(null as unknown as Video);
  const scrollViewRef = useRef<ScrollView | null>(null);
  const targetViewRef = useRef<View>(null);
  const [isPlayed, setIsPlayed] = useState(false);
  const [isPlayedVideo, setIsPlayedVideo] = useState(false);
  const [durationMillis, setDurationMillis] = useState(0);
  const [questionSession, setQuestionSession] = useState(route?.params?.data);
  const [languageTest] = useState(
    examProgress.filter(
      item => item.progress.title === "Pra Tes bahasa",
    )[0] as ExamProgressType,
  );
  const [sound] = useState(new Audio.Sound() as Audio.Sound);
  const [soundMillis, setSoundMillis] = useState(0);
  const [videoMillis, setVideoMillis] = useState(0);
  const navigation = useNavigation();
  const [showModal, setShowModal] = useState(false);
  let intervalId: any = null;
  const [timer, setTimer] = useState("00:00:00");
  const { pratestMedia } = usePersist();

  useEffect(() => {
    const subscribe: any = navigation.addListener("beforeRemove", e => {
      clearInterval(intervalId);
      e.preventDefault();
      if (e.data.action.type === "POP" || e.data.action.type === "GO_BACK") {
        return;
      }
      if (e.data.action.type === "PUSH") {
        navigation.dispatch(e.data.action);
      } else if (e.data.action.type === "NAVIGATE") {
        navigation.dispatch(e.data.action);
      }
    });

    return () => {
      subscribe();
    };
  }, [navigation]);

  useEffect(() => {
    const language = examProgress.filter(
      item => item.progress.title === "Pra Tes bahasa",
    );

    if (language?.[0]) {
      language?.[0]?.progress?.sesi?.map((item, index) => {
        if (item.id === questionSession.id) {
          setSession(index + 1);

          createTimer(
            new Date(questionSession?.userStartedSession?.started_at),
            questionSession?.duration,
            index + 1,
            //language?.[0] || ({} as ExamProgressType),
          );
          if (
            pratestMedia?.sessionId === undefined ||
            pratestMedia?.sessionId === ""
          ) {
            dispatch(
              onPratestMedia({
                fileId: questionSession?.file?.id,
                timeMilisecond: 0,
                sessionId: questionSession?.id,
              }),
            );
          }
        }
      });
    } else {
      dispatch(
        onErrorState({
          visible: true,
          text: "Terjadi kesalahan hubungi Admin Wiwitan.",
          icon: icons.searchClose,
          withCloseIcon: true,
          withIcon: true,
        }),
      );
    }

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", nextAppState => {
      if (nextAppState === "inactive") {
        if (
          videoExtensions.some(ext =>
            questionSession.file?.filename?.endsWith("." + ext),
          )
        ) {
          setIsPlayedVideo(false);
          if (video?.current?.stopAsync) {
            video?.current?.stopAsync();

            setIsPlayedVideo(false);
            dispatch(
              onPratestMedia({
                fileId: pratestMedia?.fileId,
                timeMilisecond: videoMillis,
                sessionId: pratestMedia?.sessionId,
              }),
            );
          }
        } else {
          dispatch(
            onPratestMedia({
              fileId: pratestMedia?.fileId,
              timeMilisecond: soundMillis,
              sessionId: pratestMedia?.sessionId,
            }),
          );
        }
      } else if (nextAppState === "active") {
        if (
          videoExtensions.some(ext =>
            questionSession.file?.filename?.endsWith("." + ext),
          )
        ) {
          setShowModal(false);
          setIsPlayedVideo(true);
          video?.current?.setPositionAsync(pratestMedia?.timeMilisecond);
          video?.current?.playFromPositionAsync(pratestMedia?.timeMilisecond);
          dispatch(
            onPratestMedia({
              fileId: pratestMedia?.fileId,
              timeMilisecond: videoMillis,
              sessionId: pratestMedia?.sessionId,
            }),
          );
        } else {
          dispatch(
            onPratestMedia({
              fileId: pratestMedia?.fileId,
              timeMilisecond: videoMillis,
              sessionId: pratestMedia?.sessionId,
            }),
          );
          unloadAudio(() => {
            playSound(pratestMedia?.timeMilisecond);
          });
        }
      }
    });
    return () => {
      subscription.remove();
    };
  }, [soundMillis, videoMillis]);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", nextAppState => {
      if (nextAppState === "background") {
        setShowModal(true);
      }
    });
    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    return video
      ? () => {
          if (video?.current?.stopAsync) {
            video?.current?.stopAsync();
            video?.current?.unloadAsync();
            setIsPlayedVideo(false);
          }
        }
      : undefined;
  }, [video]);

  const unloadAudio = async (cb?: () => void) => {
    try {
      const status = await sound.getStatusAsync();
      if (status?.isLoaded) {
        if (status?.isPlaying) {
          await sound?.stopAsync();
        }
        await sound?.unloadAsync();
        cb && cb();
      }
    } catch {
    } finally {
      setShowModal(false);
    }
  };

  const savingQuestion = async (
    indexQuestion: number,
    questionId: string,
    indexAnswer: number,
  ) => {
    setShowModal(true);
    const language = examProgress.filter(
      item => item.progress.title === "Pra Tes bahasa",
    );

    if (language?.[0]) {
      // const newData = questionSession;

      const items = questionSession.question[
        indexQuestion
      ]?.question_items?.map((item, index) => {
        if (index === indexAnswer) {
          return {
            id: item.id,
            is_selected: true,
          };
        }
        return { id: item.id, is_selected: false };
      });

      if (questionSession?.question?.[indexQuestion]?.userAnswareSelected) {
        //PUT
        const data: PutAnswerType = {
          user_exam_id: language?.[0]?.id,
          question: {
            a_body_type: "",
            a_body_text: "",
            a_body_url: "",
            a_body_file_id: "",
            question_items: items || [],
          },
        };
        await apiPutAnswer(auth?.accessToken, data, questionId).then(
          ({ message }) => {
            if (!message) {
              ErrorStatus(500, dispatch);
            }
            updatedQuestion(
              questionSession?.id,
              indexQuestion,
              questionSession,
            );
          },
        );
      } else {
        //POST
        const data: PostAnswerType = {
          user_exam_id: language?.[0]?.id,
          question: {
            id: questionId,
            a_body_type: "",
            a_body_text: "",
            a_body_url: "",
            a_body_file_id: "",
            question_items: items || [],
          },
        };

        await apiPostAnswer(auth?.accessToken, data).then(({ message }) => {
          if (!message) {
            ErrorStatus(500, dispatch);
          }
          updatedQuestion(questionSession?.id, indexQuestion, questionSession);
        });
      }
    }
  };

  function deepClone(obj: any): any {
    if (obj === null || typeof obj !== "object") {
      return obj;
    }

    const clone = Array.isArray(obj) ? [] : {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        //@ts-ignore
        clone[key] = deepClone(obj[key]);
      }
    }

    return clone;
  }

  const updatedQuestion = async (
    id: string,
    indexQuestion: number,
    newData: any,
  ) => {
    await apiExamQuestion(auth?.accessToken, id).then(({ data }) => {
      setShowModal(false);

      const updatedData = deepClone(questionSession);
      updatedData.question[indexQuestion].userAnswareSelected =
        //@ts-ignore
        data.question[indexQuestion].userAnswareSelected;
      setQuestionSession(updatedData);
    });
  };

  const isAnswerCompleted = () => {
    return questionSession.question.every(item => item.userAnswareSelected);
  };

  const resetSavedMedia = () => {
    dispatch(onPratestMedia({ fileId: "", timeMilisecond: 0, sessionId: "" }));
  };

  const onNextSession = async (session: number) => {
    await unloadAudio();
    setIsPlayed(false);
    resetSavedMedia();
    if (session === languageTest?.progress?.sesi?.length) {
      apiExamSetStatus(auth?.accessToken, {
        user_exam_id: languageTest?.id,
        status: 1,
        finished_at: dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss"),
        started_at: "",
      }).then(() => {
        NavigationService.push("FinishTestScreen");
      });
    } else {
      if (languageTest?.progress?.sesi?.[session]) {
        apiSetSessionBahasa(
          auth?.accessToken,
          languageTest?.progress?.sesi?.[session]?.id || "",
        ).then(() => {
          getExamProgress().then(({ data }) => {
            if (data) {
              apiExamQuestion(
                auth?.accessToken,
                languageTest?.progress?.sesi?.[session]?.id || "",
              ).then(({ data }) => {
                NavigationService.push("DownloadScreen", {
                  data: data,
                  isNext: true,
                });
              });
            }
          });
        });
      } else {
        Alert.alert("Error", "Next session is missing. Contact Admin Wiwitan");
      }
    }
  };

  const playSound = useCallback(
    async (timeMilisecond: number) => {
      try {
        const info = await FileSystem.getInfoAsync(
          //@ts-ignore
          questionSession?.file?.downloadedUrl,
        );
        if (info.exists) {
          await sound.loadAsync({
            //@ts-ignore
            uri: questionSession?.file?.downloadedUrl,
          });
          setIsPlayed(true);
          if (
            pratestMedia?.sessionId !== undefined ||
            pratestMedia?.sessionId !== ""
          ) {
            await sound.setPositionAsync(timeMilisecond);

            await sound.playAsync();
          } else {
            await sound.playAsync();
          }

          sound?.setOnPlaybackStatusUpdate((status: any) => {
            setSoundMillis(status?.positionMillis);
            if (status?.didJustFinish) {
              dispatch(
                onPratestMedia({
                  fileId: questionSession?.file?.id,
                  timeMilisecond: 0,
                  sessionId: questionSession?.id,
                }),
              );
              sound?.setPositionAsync(0);
              sound?.unloadAsync();
              setIsPlayed(false);
            }
          });
        }
      } catch (error: any) {
        Alert.alert(
          "Error",
          error?.message || "Cannot play audio. Please contact Admin Wiwitan",
        );
      }
    },
    [pratestMedia],
  );

  // Handle pausing/resuming audio on app state changes (lock/blur/focus/unlock)
  useEffect(() => {
    const handleAppStateChange = async (nextAppState: string) => {
      if (
        videoExtensions.some(ext =>
          questionSession.file?.filename?.endsWith("." + ext),
        )
      ) {
        // Video: handled as before
        if (nextAppState === "inactive" || nextAppState === "background") {
          setIsPlayedVideo(false);
          if (video?.current?.pauseAsync) {
            await video.current.pauseAsync();
          }
          dispatch(
            onPratestMedia({
              fileId: pratestMedia?.fileId,
              timeMilisecond: videoMillis,
              sessionId: pratestMedia?.sessionId,
            }),
          );
        } else if (nextAppState === "active") {
          setShowModal(false);
          setIsPlayedVideo(true);
          if (video?.current?.playFromPositionAsync) {
            await video.current.playFromPositionAsync(pratestMedia?.timeMilisecond || 0);
          }
          dispatch(
            onPratestMedia({
              fileId: pratestMedia?.fileId,
              timeMilisecond: videoMillis,
              sessionId: pratestMedia?.sessionId,
            }),
          );
        }
      } else {
        // Audio: pause/resume playSound
        if (nextAppState === "inactive" || nextAppState === "background") {
          try {
            const status = await sound.getStatusAsync();
            if (status?.isLoaded && status?.isPlaying) {
              await sound.pauseAsync();
            }
          } catch {}
          dispatch(
            onPratestMedia({
              fileId: pratestMedia?.fileId,
              timeMilisecond: soundMillis,
              sessionId: pratestMedia?.sessionId,
            }),
          );
        } else if (nextAppState === "active") {
          try {
            const status = await sound.getStatusAsync();
            if (status?.isLoaded && !status?.isPlaying && soundMillis > 0) {
              await sound.playFromPositionAsync(soundMillis);
            }
          } catch {}
          dispatch(
            onPratestMedia({
              fileId: pratestMedia?.fileId,
              timeMilisecond: soundMillis,
              sessionId: pratestMedia?.sessionId,
            }),
          );
        }
      }
    };

    const subscription = AppState.addEventListener("change", handleAppStateChange);
    return () => {
      subscription.remove();
    };
  }, [soundMillis, videoMillis, pratestMedia, questionSession]);

  // Timer: Make sure timer never stops or pauses
  const intervalRef = useRef<any>(null);

  function createTimer(started_at: Date, duration: string, session: number) {
    if (intervalRef.current === null) {
      intervalRef.current = setInterval(function () {
        const now = new Date(
          moment(new Date()).add(7, "hour").toDate(),
        ).getTime();
        const durationMinutes = Number(duration); // Convert duration to a number
        const targetTime = new Date(
          started_at.getTime() + durationMinutes * 60000,
        ).getTime(); // Calculate target time in milliseconds
        const timeDifference = targetTime - now;

        if (timeDifference <= 0) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          onNextSession(session);
        } else {
          const seconds = Math.floor((timeDifference % 60000) / 1000);
          const minutes = Math.floor((timeDifference % 3600000) / 60000);
          const hours = Math.floor(timeDifference / 3600000);
          setTimer(
            `${hours.toString().padStart(2, "0")}:${minutes
              .toString()
              .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`,
          );
        }
      }, 1000);
    }
  }

  useEffect(() => {
    // Clean up timer on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  function isTimeStringLessThan15Minutes(timeString: string): boolean {
    const [hoursStr, minutesStr, secondsStr] = timeString.split(":");
    //@ts-ignore
    const hours = parseInt(hoursStr, 10);
    //@ts-ignore
    const minutes = parseInt(minutesStr, 10);
    //@ts-ignore
    const seconds = parseInt(secondsStr, 10);
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;
    const fifteenMinutesInSeconds = 15 * 60;
    return totalSeconds < fifteenMinutesInSeconds;
  }

  return (
    <View style={globalStyles().topSafeArea}>
      <View style={{ marginHorizontal: scaledHorizontal(25), flex: 1 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingBottom: scaledVertical(10),
          }}
        >
          <View>
            <View
              style={{
                borderBottomWidth: widthText > widthJapan ? 0.5 : 0,
                borderBottomColor: "black",

                paddingBottom: scaledVertical(10),
              }}
            >
              <Text
                onTextLayout={e => {
                  setWidthText(e?.nativeEvent?.lines[0]?.width || 0);
                }}
              >
                Tes Bakat Bahasa
              </Text>
            </View>
            <View
              style={{
                borderTopWidth: widthJapan > widthText ? 0.5 : 0,
                paddingTop: scaledVertical(10),
                borderTopColor: "black",
              }}
            >
              <Text
                size={12}
                onTextLayout={e => {
                  setWidthJapan(e?.nativeEvent?.lines[0]?.width || 0);
                }}
              >
                言語テスト
              </Text>
            </View>
          </View>

          <View>
            <View
              style={{
                borderBottomWidth: 0,
                borderBottomColor: "black",

                paddingBottom: scaledVertical(10),
              }}
            >
              <Text
                textAlign="right"
                color={
                  isTimeStringLessThan15Minutes(timer)
                    ? colors.red
                    : colors.black
                }
              >
                {timer}
              </Text>
            </View>
            <View
              style={{
                borderTopWidth: 0.5,
                paddingTop: scaledVertical(10),
                borderTopColor: "black",
              }}
            >
              <Text textAlign="right" size={12}>
                {t("sesi")} {session} {t("dari")}{" "}
                {languageTest?.progress?.sesi?.length}
              </Text>
            </View>
          </View>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          ref={scrollViewRef}
          scrollEventThrottle={16}
          stickyHeaderIndices={
            videoExtensions.some(ext =>
              questionSession.file?.filename?.endsWith("." + ext),
            )
              ? [7]
              : [7]
          }
        >
          <Space height={20} />
          <View
            style={{
              paddingVertical: 4,
              paddingHorizontal: 7,
              backgroundColor: colors.red,
              borderRadius: 4,
              alignSelf: "center",
            }}
          >
            <Text
              textAlign="center"
              size={12}
              type="bold"
              variant="CenturyGothicBold"
              color={colors.white}
            >
              {t("sesi")} {session}
            </Text>
          </View>
          <Space height={10} />
          <Text
            size={16}
            color={colors.accent}
            textAlign="center"
            type="bold"
            variant="CenturyGothicBold"
          >
            {questionSession.title}
          </Text>
          <Space height={10} />
          <Text size={12} color={colors.black}>
            {questionSession.description}
          </Text>

          <Space height={20} />
          {videoExtensions.some(ext =>
            questionSession.file?.filename?.endsWith("." + ext),
          ) ? (
            <Card style={{ paddingHorizontal: 0 }}>
              {questionSession.file?.downloadedUrl ? (
                <View
                  style={{ width: "100%", height: 200, minHeight: 200 }}
                  ref={targetViewRef}
                >
                  <Video
                    ref={video}
                    source={{
                      uri: questionSession.file?.downloadedUrl,
                    }}
                    style={{ height: "100%", width: "100%" }}
                    useNativeControls={false}
                    shouldPlay={isPlayedVideo}
                    resizeMode={ResizeMode.CONTAIN}
                    isLooping={false}
                    onPlaybackStatusUpdate={(status: any) => {
                      setVideoMillis(status?.positionMillis);
                      setDurationMillis(
                        status?.durationMillis - status?.positionMillis,
                      );
                      if (
                        status?.durationMillis - status?.positionMillis ===
                        0
                      ) {
                        dispatch(
                          onPratestMedia({
                            fileId: questionSession?.file?.id,
                            timeMilisecond: 0,
                            sessionId: questionSession?.id,
                          }),
                        );
                        video?.current?.setPositionAsync(0);
                        setIsPlayedVideo(false);
                      }
                    }}
                    positionMillis={
                      pratestMedia?.sessionId !== "" ||
                      pratestMedia?.sessionId !== undefined
                        ? pratestMedia?.timeMilisecond
                        : 0
                    }
                  />
                  {!isPlayedVideo ? (
                    <TouchableOpacity
                      style={{
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        justifyContent: "center",
                        alignItems: "center",
                        position: "absolute",
                      }}
                      onPress={() => {
                        video?.current?.setPositionAsync(
                          pratestMedia?.timeMilisecond || 0,
                        );
                        setIsPlayedVideo(true);
                      }}
                    >
                      <Image
                        source={icons.playButton}
                        style={{
                          height: 100,
                          width: 100,
                          resizeMode: "contain",
                        }}
                      />
                    </TouchableOpacity>
                  ) : null}
                </View>
              ) : null}
              <Space height={10} />
              <Text textAlign="center" size={20}>
                {millisToTime(durationMillis)}
              </Text>
              <Space height={10} />
            </Card>
          ) : (
            <View>
              <Button
                iconStyle={{ resizeMode: "contain", height: 28, width: 28 }}
                icon={icons.playAudio}
                title={t("putar_audio")}
                onPress={() => playSound(pratestMedia?.timeMilisecond || 0)}
                style={{ paddingVertical: 12, minWidth: "100%" }}
                innerStyle={{ alignItems: "center", gap: 10 }}
                disabled={isPlayed}
                withBorder={!isPlayed}
              />
            </View>
          )}
          <Space height={20} />
          {questionSession.question?.map((item, index) => {
            return (
              <Card key={index} style={{ marginBottom: scaledVertical(20) }}>
                <Text
                  size={16}
                  type="bold"
                  variant="CenturyGothicBold"
                  textAlign="center"
                  color={colors.accent}
                >
                  {item?.title}
                </Text>
                <Space height={15} />
                {item?.question_items?.map((itm, idx) => {
                  return (
                    <TouchableOpacity
                      onPress={() => savingQuestion(index, item?.id, idx)}
                      style={{
                        marginBottom: scaledVertical(20),
                        flexDirection: "row",
                        gap: 12,
                        alignItems: "center",
                      }}
                      key={idx}
                    >
                      <View
                        style={{
                          height: 34,
                          width: 34,
                          borderRadius: 36 / 2,
                          backgroundColor: item?.userAnswareSelected
                            ? item?.userAnswareSelected?.question_item?.id ===
                              itm.id
                              ? colors.red
                              : colors.stone200
                            : colors.stone200,
                          alignContent: "center",
                          justifyContent: "center",
                        }}
                      >
                        {/* Saving the selected question to redux persist */}
                        <Text
                          textAlign="center"
                          style={{ padding: 4 }}
                          size={14}
                          type="bold"
                          variant="CenturyGothicBold"
                          color={
                            item?.userAnswareSelected
                              ? item?.userAnswareSelected?.question_item?.id ===
                                itm.id
                                ? colors?.white
                                : colors.stone400
                              : colors.stone400
                          }
                        >
                          {alphabet[idx]}
                        </Text>
                      </View>
                      <Text
                        size={12}
                        type={
                          item?.userAnswareSelected
                            ? item?.userAnswareSelected?.question_item?.id ===
                              itm.id
                              ? "bold"
                              : "reguler"
                            : "reguler"
                        }
                        variant={
                          item?.userAnswareSelected
                            ? item?.userAnswareSelected?.question_item?.id ===
                              itm.id
                              ? "CenturyGothicBold"
                              : "CenturyGothicRegular"
                            : "CenturyGothicRegular"
                        }
                      >
                        {itm.description}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </Card>
            );
          })}

          <Space height={50} />
        </ScrollView>
      </View>
      <Card
        style={{
          borderWidth: 1,
          borderRadius: 0,
          borderTopEndRadius: 12,
          borderTopStartRadius: 12,
          borderColor: colors.black,
          borderStyle: "solid",
        }}
      >
        <Button
          variant="CenturyGothicBold"
          textType="bold"
          title={
            languageTest?.progress?.sesi?.length === session
              ? t("selesai")
              : t("lanjutkan")
          }
          type="light"
          style={{ paddingVertical: 12, minWidth: "100%" }}
          onPress={async () => {
            onNextSession(session);
          }}
          textStyle={{
            fontSize: scaledFontSize(20),
            lineHeight: 18,
          }}
          disabled={!isAnswerCompleted()}
          withBorder={isAnswerCompleted()}
        />
      </Card>
      <LoadingModal
        showModal={showModal}
        onCloseModal={() => setShowModal(false)}
        isCustomMessage={false}
      />
    </View>
  );
};

export default QuestionListScreen;
