import { RouteProp } from "@react-navigation/core";
import { StackNavigationProp } from "@react-navigation/stack";
import PopUpScreeen from "components/PopUpScreeen";
import Space from "components/Space";
import Text from "components/Text";
import colors from "configs/colors";
import images from "configs/images";
import { useAuth } from "hooks/useAuth";
import { t } from "i18next";
import React, { useEffect, useState } from "react";
import { View, Image, Platform } from "react-native";
import { apiGetAssesment } from "services/ExamServices";
import { QuestionResponse, UserExamType } from "types/AssesmentTypes";
import { RootStackParamList } from "types/NavigatorTypes";
import globalStyles from "utils/GlobalStyles";
import NavigationService from "utils/NavigationService";
import { scaledHorizontal } from "utils/ScaledService";

type AssesmentTimerRouteType = RouteProp<
  RootStackParamList,
  "AssesmentTimerStart"
>;

type AssesmentTimerNavigationProp = StackNavigationProp<
  RootStackParamList,
  "AssesmentTimerStart"
>;

type Prop = {
  route: AssesmentTimerRouteType;
  navigation: AssesmentTimerNavigationProp;
};

const AssesmentTimerStart = ({ route }: Prop) => {
  const [openModal, setOpenModal] = useState(false);
  const [time, setTime] = useState(10);
  const { auth } = useAuth();
  let intervalId: any = null;
  const [assesment, setAssesment] = useState({} as QuestionResponse);
  const [userExam, setUserExam] = useState({} as UserExamType);

  useEffect(() => {
    runningTime();
    getAssesment();

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const runningTime = () => {
    if (intervalId === null) {
      //let t = 11;
      let t = 10;
      intervalId = setInterval(() => {
        if (t === 0) {
          clearInterval(intervalId);
          //setUri(uri);
          setOpenModal(true);
        } else {
          t--;
          setTime(t);
        }
      }, 1000);
    }
  };

  const getAssesment = () => {
    apiGetAssesment(auth?.accessToken, route?.params?.id).then(({ data }) => {
      setAssesment(data?.question);
      setUserExam(data?.userExam);
    });
  };

  return (
    <View style={[globalStyles().topSafeArea]}>
      {Platform.OS === "android" && <Space height={20} />}
      <Image
        source={route?.params?.icon || images?.classOne}
        style={{
          height: 80,
          width: 68,
          resizeMode: "contain",
          alignSelf: "center",
          borderRadius: 10,
        }}
      />
      <Space height={20} />

      <Text
        textAlign="center"
        size={20}
        style={{ paddingHorizontal: scaledHorizontal(25) }}
      >
        {route?.params?.title}
      </Text>

      <Space height={100} />
      <View
        style={{
          borderBottomWidth: 1,
          borderBottomColor: colors.black,
          alignSelf: "center",
          paddingBottom: 5,
        }}
      >
        <Text size={20}>Asesmen</Text>
      </View>
      <Text size={12} textAlign="center" style={{ paddingTop: 5 }}>
        小テスト
      </Text>

      <Space height={50} />
      <View>
        <Text type="bold" variant="CenturyGothicBold" textAlign="center">
          {"Asesment akan dimulai dalam"}
        </Text>
        <Text
          variant="OpificioNeueRegular"
          size={60}
          textAlign="center"
          color={colors.accent}
        >
          {time}
        </Text>
      </View>

      <PopUpScreeen
        showModal={openModal}
        onClose={() => {
          setOpenModal(false);
          NavigationService.replace("AssesmentQuestionScreen", {
            id: route?.params?.id,
            data: assesment,
            userExam: userExam,
            assesmentId: route?.params?.id,
            working_date: String(route?.params?.working_date || new Date()),
          });
        }}
      >
        <Image
          source={images.imagePerjalanan}
          style={{ width: 180, height: 146 }}
        />
        <Text variant="OpificioNeueRegular" size={48}>
          頑張れ！
        </Text>
        <Text variant="CenturyGothicBold" type="bold" size={16}>
          {t("selamat_berjuang")}
        </Text>
      </PopUpScreeen>
    </View>
  );
};

export default AssesmentTimerStart;
