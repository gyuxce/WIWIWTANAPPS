import Text from "components/Text";
import React, { useCallback, useEffect, useState } from "react";
import { View, ScrollView, Platform } from "react-native";
import globalStyles from "utils/GlobalStyles";
import {
  scaledFontSize,
  scaledHorizontal,
  scaledVertical,
} from "utils/ScaledService";
import Space from "components/Space";
import Button from "components/Button";
import Card from "components/Card";
import colors from "configs/colors";
import AudioQuestion from "./AssesmentType/Audio";
import { RouteProp } from "@react-navigation/core";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "types/NavigatorTypes";
import Essay from "./AssesmentType/Essay";
import {
  FileType,
  PostAnswerType,
  PutAnswerType,
  QuestionType,
  UserAnswerSelectedType,
} from "types/ExamTypes";
import MultiChoice from "./AssesmentType/MultiChoice";
import LoadingModal from "components/LoadingModal/LoadingModal";
import MultiChoiceValue from "./AssesmentType/MultiChoiceValue";
import Write from "./AssesmentType/Write";
import {
  apiGetAssesment,
  apiPostAnswer,
  apiPutAnswer,
  apiUpdateStatusAssesment,
} from "services/ExamServices";
import { useAuth } from "hooks/useAuth";
import { ErrorStatus } from "utils/ErrorStatus";
import { useDispatch } from "react-redux";
import { apiUploadImage } from "services/UserService";
import NavigationService from "utils/NavigationService";
import { wait } from "utils/Utils";
import moment from "moment";
import { onErrorState } from "stores/error/errorSlice";
import icons from "configs/icons";
import { t } from "i18next";

type AssesmentQuestionRouteType = RouteProp<
  RootStackParamList,
  "AssesmentQuestionScreen"
>;

type AssesmentQuestionNavigationProp = StackNavigationProp<
  RootStackParamList,
  "AssesmentQuestionScreen"
>;

type Prop = {
  route: AssesmentQuestionRouteType;
  navigation: AssesmentQuestionNavigationProp;
};

const AssesmentQuestionScreen = ({ route }: Prop) => {
  const { auth } = useAuth();
  const dispatch = useDispatch();
  const [widthText, setWidthText] = useState(0);
  const [widthJapan, setWidthJapan] = useState(0);
  const [indexQuestion, setIndexQuestion] = useState(0);
  const [activeQuestion, setActiveQuestion] = useState({} as QuestionType);
  const [showModal, setShowModal] = useState(false);
  const [questionAssesment, setQuestionAssesment] = useState(
    route?.params?.data,
  );
  const [userExamAssesment, setUserExamAssesment] = useState(
    route?.params?.userExam,
  );
  const [essayText, setEssayText] = useState("");
  const [file, setFile] = useState({} as FileType);
  const [soundUri, setSoundUri] = useState("");
  let intervalId: any = null;
  const [timer, setTimer] = useState("00:00:00");

  useEffect(() => {
    let active = false;

    wait(500).then(() => {
      apiGetAssesment(auth?.accessToken, route?.params?.id).then(({ data }) => {
        setQuestionAssesment(data?.question);
        setUserExamAssesment(data?.userExam);

        data?.question?.question?.map((item, index) => {
          if (item?.userAnswareSelected?.id === undefined && active === false) {
            setIndexQuestion(index);
            setActiveQuestion(item);
            active = true;

            createTimer(
              new Date(route?.params?.working_date || new Date()),
              data?.question?.duration,
            );
          }
        });
      });
    });

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  function createTimer(started_at: Date, duration: string) {
    if (intervalId === null) {
      intervalId = setInterval(function () {
        const now = new Date(moment(new Date()).toDate()).getTime();
        const durationMinutes = Number(duration); // Convert duration to a number
        const targetTime = new Date(
          started_at.getTime() + durationMinutes * 60000,
        ).getTime(); // Calculate target time in milliseconds
        const timeDifference = targetTime - now;

        if (timeDifference <= 0) {
          clearInterval(intervalId);

          apiUpdateStatusAssesment(
            auth?.accessToken,
            userExamAssesment?.id,
          ).then(() => {
            NavigationService.replace("FinishAssesment");
          });
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

  const savingQuestion = async (
    idxQuestion: number,
    questionId: string,
    idxAnswer: number,
  ) => {
    setShowModal(true);
    if (activeQuestion?.type === 1 || activeQuestion?.type === 2) {
      let items = activeQuestion?.question_items?.map((item, index) => {
        if (index === idxAnswer) {
          return {
            id: item.id,
            is_selected: true,
          };
        }
        return { id: item.id, is_selected: false };
      });

      if (activeQuestion?.userAnswareSelected) {
        const data: PutAnswerType = {
          user_exam_id: userExamAssesment?.id,
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
            updateQuestion(indexQuestion);
            setShowModal(false);
          },
        );
      } else {
        const data: PostAnswerType = {
          user_exam_id: userExamAssesment?.id,
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
          updateQuestion(idxQuestion);
          setShowModal(false);
        });
      }
    }
  };

  const updateQuestion = (indexQuestion: number) => {
    apiGetAssesment(auth?.accessToken, route?.params?.assesmentId).then(
      ({ data }) => {
        setActiveQuestion({
          ...activeQuestion,
          userAnswareSelected:
            data?.question?.question[indexQuestion]?.userAnswareSelected ||
            ({} as UserAnswerSelectedType),
        });
      },
    );
  };

  const onNextSession = async () => {
    if (activeQuestion?.type === 1 || activeQuestion?.type === 2) {
      redirectPage();
    }
    if (activeQuestion?.type === 3) {
      let items = activeQuestion?.question_items?.map(item => {
        return { id: item.id, is_selected: true };
      });
      const data: PostAnswerType = {
        user_exam_id: userExamAssesment?.id,
        question: {
          id: activeQuestion?.id,
          a_body_type: String(activeQuestion?.type),
          a_body_text: essayText,
          a_body_url: "",
          a_body_file_id: "",
          question_items: items || [],
        },
      };
      setShowModal(true);
      apiPostAnswer(auth?.accessToken, data).then(({ message }) => {
        if (!message) {
          ErrorStatus(500, dispatch);
        }

        setShowModal(false);
        redirectPage();
      });
    }

    if (activeQuestion?.type === 6) {
      let items = activeQuestion?.question_items?.map((item, index) => {
        return { id: item.id, is_selected: true };
      });
      const data: PostAnswerType = {
        user_exam_id: userExamAssesment?.id,
        question: {
          id: activeQuestion?.id,
          a_body_type: String(activeQuestion?.type),
          a_body_text: "",
          a_body_url: file?.url,
          a_body_file_id: file?.uuid,
          question_items: items || [],
        },
      };
      setShowModal(true);
      apiPostAnswer(auth?.accessToken, data).then(({ message }) => {
        if (!message) {
          ErrorStatus(500, dispatch);
        }

        setShowModal(false);
        redirectPage();
      });
    }

    if (activeQuestion?.type === 4) {
      let items = activeQuestion?.question_items?.map((item, index) => {
        return { id: item.id, is_selected: true };
      });
      setShowModal(true);

      const dataForm: any = new FormData();
      dataForm.append("file", {
        name: Platform?.OS === "ios" ? soundUri.split("/").pop() : soundUri,
        mime: "multipart/form-data",
        type: "multipart/form-data",
        uri: Platform.OS === "ios" ? soundUri.replace("file://", "") : soundUri,
        path:
          Platform.OS === "ios" ? soundUri.replace("file://", "") : soundUri,
      });

      try {
        const resp = await apiUploadImage(
          auth?.accessToken,
          dataForm,
          dispatch,
        );
        if (resp?.uuid) {
          const data: PostAnswerType = {
            user_exam_id: userExamAssesment?.id,
            question: {
              id: activeQuestion?.id,
              a_body_type: String(activeQuestion?.type),
              a_body_text: "",
              a_body_url: resp?.url,
              a_body_file_id: resp?.uuid,
              question_items: items || [],
            },
          };

          apiPostAnswer(auth?.accessToken, data).then(({ message }) => {
            setShowModal(false);
            redirectPage();
          });
        } else {
          setShowModal(false);
          dispatch(
            onErrorState({
              visible: false,
              text: "File not saved",
              icon: icons.searchClose,
              withCloseIcon: true,
              withIcon: true,
            }),
          );
        }
      } catch (err: any) {
        setShowModal(false);
        dispatch(
          onErrorState({
            visible: false,
            text: "Error uploading",
            icon: icons.searchClose,
            withCloseIcon: true,
            withIcon: true,
          }),
        );
      }
    }
  };

  const redirectPage = () => {
    if (questionAssesment?.question[indexQuestion + 1]) {
      setIndexQuestion(indexQuestion + 1);
      //@ts-ignore
      setActiveQuestion(questionAssesment?.question[indexQuestion + 1]);
      setSoundUri("");
      setEssayText("");
      setFile({} as FileType);
    } else {
      //Navigate to finish
      clearInterval(intervalId);
      apiUpdateStatusAssesment(auth?.accessToken, userExamAssesment?.id).then(
        () => {
          NavigationService.replace("FinishAssesment");
        },
      );
    }
  };

  const isAnswerCompleted = useCallback(() => {
    if (activeQuestion.type === 1 || activeQuestion.type === 2) {
      return activeQuestion?.userAnswareSelected !== null;
    } else if (activeQuestion?.type === 3) {
      return essayText !== "";
    } else if (activeQuestion?.type === 6) {
      return file?.id ? true : false;
    } else if (activeQuestion?.type === 4) {
      return soundUri !== "";
    }

    return false;
  }, [essayText, file, soundUri, activeQuestion]);

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
      <View style={{ marginHorizontal: scaledHorizontal(25) }}>
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
                Asesmen
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
                小テスト
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
                {t("soal")} {indexQuestion + 1} {t("dari")}{" "}
                {questionAssesment?.count_question}
              </Text>
            </View>
          </View>
        </View>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Space height={30} />
        {activeQuestion?.type === 2 && (
          <MultiChoice
            question={activeQuestion}
            indexQuestion={indexQuestion}
            savingQuestion={savingQuestion}
          />
        )}
        {activeQuestion?.type === 1 && (
          <MultiChoiceValue
            question={activeQuestion}
            indexQuestion={indexQuestion}
            savingQuestion={savingQuestion}
          />
        )}
        {activeQuestion?.type === 3 && (
          <Essay
            question={activeQuestion}
            indexQuestion={indexQuestion}
            essayText={essayText}
            setEssayText={setEssayText}
          />
        )}

        {activeQuestion?.type === 6 && (
          <Write
            question={activeQuestion}
            indexQuestion={indexQuestion}
            file={file}
            setFile={setFile}
          />
        )}

        {activeQuestion?.type === 4 && (
          <AudioQuestion
            question={activeQuestion}
            indexQuestion={indexQuestion}
            soundUri={soundUri}
            setSoundUri={setSoundUri}
          />
        )}
      </ScrollView>
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
            questionAssesment?.question?.length === indexQuestion + 1
              ? t("selesai")
              : t("lanjutkan")
          }
          type="light"
          style={{ paddingVertical: 12, minWidth: "100%" }}
          onPress={() => onNextSession()}
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

export default AssesmentQuestionScreen;
