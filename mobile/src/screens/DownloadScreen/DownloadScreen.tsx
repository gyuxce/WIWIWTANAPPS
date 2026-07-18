/* eslint-disable @typescript-eslint/no-shadow  */
import Header from "components/Header";
import Space from "components/Space";
import Text from "components/Text";
import images from "configs/images";
import React, { useEffect, useState } from "react";
import { Alert, Image, ScrollView, View } from "react-native";
import type { DimensionValue } from "react-native";
import globalStyles from "utils/GlobalStyles";
import { documentDirectory, createDownloadResumable } from "expo-file-system";
import colors from "configs/colors";
import { scaledVertical } from "utils/ScaledService";
import { RouteProp, useNavigation } from "@react-navigation/core";
import NavigationService from "utils/NavigationService";
import PopUpScreeen from "components/PopUpScreeen";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "types/NavigatorTypes";
import { usePersist } from "hooks/usePersist";
import { useDispatch } from "react-redux";
import { onPushTestBahasaSession } from "stores/persist/persistSlice";
import { videoExtensions } from "utils/Utils";
import { useTranslation } from "react-i18next";

type DownloadRouteType = RouteProp<RootStackParamList, "DownloadScreen">;

type DownloadNavigationProp = StackNavigationProp<
  RootStackParamList,
  "DownloadScreen"
>;

type Prop = {
  route: DownloadRouteType;
  navigation: DownloadNavigationProp;
};
const DownloadScreen = ({ route }: Prop) => {
  const { sessionTestBahasa } = usePersist();
  const [openModal, setOpenModal] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isFinishedDownload, setIsFinishedDownload] = useState(false);
  const [time, setTime] = useState(10);
  const [sessionQuestion, setSessionQuestion] = useState(route?.params?.data);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  let intervalId: any = null;
  const progressPercentage = Math.min(Math.max(progress * 100, 0), 100);

  useEffect(() => {
    const subscribe: any = navigation.addListener("beforeRemove", e => {
      if (e.data.action.type === "PUSH") {
        clearInterval(intervalId);
        navigation.dispatch(e.data.action);
      }
    });
    return () => {
      clearInterval(intervalId);
      subscribe();
    };
  }, [navigation]);

  useEffect(() => {
    if (
      sessionQuestion?.file?.downloadedUrl ||
      sessionQuestion?.file?.downloadedUrl === ""
    ) {
      setIsFinishedDownload(true);
      runningTime();
    } else {
      downloadVideo();
    }
  }, []);

  const downloadVideo = async () => {
    if (sessionQuestion?.id) {
      var parts = sessionQuestion?.file?.local_url?.split("/");
      var filename = parts[parts.length - 1];
      if (filename) {
        await createDownloadResumable(
          sessionQuestion?.file?.url,
          documentDirectory + filename,
          { cache: true },
          (downloadProgress: any) => {
            const totalBytes = downloadProgress.totalBytesExpectedToWrite || 1;
            const progress = downloadProgress.totalBytesWritten / totalBytes;

            setProgress(progress);
          },
        )
          .downloadAsync()
          .then(res => {
            setIsFinishedDownload(true);
            const newData = sessionTestBahasa?.map(item => {
              if (item.id === sessionQuestion?.id) {
                return {
                  ...item,
                  file: { ...item?.file, downloadedUrl: res?.uri },
                };
              }
              return item;
            });
            dispatch(onPushTestBahasaSession(newData));
            setSessionQuestion({
              ...sessionQuestion,
              file: { ...sessionQuestion?.file, downloadedUrl: res?.uri },
            });
            runningTime();
          });
      } else {
        Alert.alert("Error", "Error downloading asset");
      }
    }
  };

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

  return (
    <View style={globalStyles().topSafeArea}>
      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
        <Header withTextTitle textJapan="事前テスト" textTitle="Pra Tes" />
        <Space height={25} />
        <View style={{ alignItems: "center" }}>
          <Image
            source={images.imagePerjalanan}
            style={{ width: 130, height: 100, resizeMode: "contain" }}
          />
        </View>
        <View style={{ marginTop: 126 }}>
          <Header
            withTextTitle
            textJapan="言語テスト"
            textTitle="Tes Bakat Bahasa"
            textTitleSize={20}
          />

          <Space height={40} />

          {isFinishedDownload ? (
            <View>
              <Text type="bold" variant="CenturyGothicBold" textAlign="center">
                {route?.params?.isNext
                  ? t("sesi_selanjutnya")
                  : t("tes_akan_dimulai")}
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
          ) : (
            <View>
              <Text type="bold" variant="CenturyGothicBold" textAlign="center">
                {videoExtensions.some(ext =>
                  sessionQuestion?.file?.filename?.endsWith("." + ext),
                )
                  ? t("unduh_video")
                  : t("unduh_audio")}
              </Text>
              <View
                style={{
                  height: 8,
                  width: "80%",
                  backgroundColor: colors.stone200,
                  borderRadius: 6,
                  marginVertical: 12,
                  alignSelf: "center",
                }}
              >
                <View
                  style={{
                    height: 8,
                    width: `${progressPercentage.toFixed()}%` as DimensionValue,
                    backgroundColor: colors.accent,
                    borderRadius: 6,
                    marginVertical: 12,
                    top: scaledVertical(-23),
                    position: "absolute",
                  }}
                />
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 4,
                  alignContent: "center",
                  justifyContent: "center",
                }}
              >
                <Text variant="OpificioNeueRegular" size={24}>
                  {progressPercentage.toFixed()}
                </Text>
                <Text size={12}>%</Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
      <PopUpScreeen
        showModal={openModal}
        onClose={() => {
          setOpenModal(false);
          NavigationService.push("QuestionListScreen", {
            data: sessionQuestion,
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

export default DownloadScreen;
