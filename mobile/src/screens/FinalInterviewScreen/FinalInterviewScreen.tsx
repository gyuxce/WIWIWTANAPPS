import { useNavigation } from "@react-navigation/core";
import Button from "components/Button";
import Card from "components/Card";
import Header from "components/Header";
import InterviewCard from "components/InterviewCard";
import ListInterview from "components/ListInterview";
import SectionWithCheck from "components/SectionWithCheck/SectionWithCheck";
import Space from "components/Space";
import Text from "components/Text";
import colors from "configs/colors";
import fonts from "configs/fonts";
import icons from "configs/icons";
import images from "configs/images";
import { useAuth } from "hooks/useAuth";
import { useInterview } from "hooks/useInterview";
import { useUser } from "hooks/useUser";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Linking,
  Platform,
  RefreshControl,
  ScrollView,
  View,
} from "react-native";
import globalStyles from "utils/GlobalStyles";
import { scaledHorizontal, scaledVertical } from "utils/ScaledService";

const FinalInterviewScreen = () => {
  const { user, getMe, auth } = useAuth();
  const { getInterviewList, interviewsList } = useInterview();
  const { getUserAdmin, openAdminWhatsapp } = useUser();
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();

  const dataInterview = [
    {
      title: t("wawancara_kerja"),
      isChecklist: user?.interview_status === 1 ? true : false,
    },
    {
      title: t("keberangkatan"),
      isChecklist: user?.interview_status === 1 ? true : false,
    },
  ];

  useEffect(() => {
    navigation.addListener("focus", () => {
      initialData();
    });
  }, []);

  const initialData = () => {
    getInterviewList().then(() => {
      getUserAdmin();
      getMe(auth?.accessToken, auth);
      setIsLoading(false);
    });
  };
  return (
    <View style={globalStyles().topSafeArea}>
      <Space height={Platform.OS === "android" ? 15 : 0} />
      <Header
        withTextTitle
        textTitleJapanLeft="最終面接"
        textTitleLeft="Wawancara Final"
        withBurger
        withBell
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={initialData} />
        }
      >
        <Space height={15} />
        <Card
          style={{
            marginHorizontal: scaledHorizontal(25),
          }}
        >
          <SectionWithCheck
            data={dataInterview}
            imageLeft={icons.wawancara}
            imageJapan={icons.wawancaraJapan}
            title={t("interview_final")}
          />
        </Card>
        {user?.interview_status === 2 ||
          (user?.interview_status === null && (
            <View>
              <InterviewCard
                title={t("siap_mengikuti_wawancara")}
                image={images.landingTwo}
                titleJapan={"準備はできていますか？"}
                subtitle={t("pesan_mengikuti_wawancara")}
              />
              <Space height={10} />
              {user?.interview_status === null && (
                <Button
                  onPress={() => openAdminWhatsapp()}
                  title={t("hubungi_admin_wiwitan")}
                  style={{
                    paddingVertical: scaledVertical(25),
                    marginHorizontal: scaledHorizontal(30),
                  }}
                  textType="bold"
                  textStyle={{ fontFamily: fonts.CenturyGothicBold }}
                />
              )}
            </View>
          ))}
        {user?.interview_status === 4 && (
          <InterviewCard
            title={t("hasil_wawancara_dalam_review")}
            image={images.waiting}
            titleJapan={"評価中!"}
            subtitle={t("pesan_wawancara_dalam_review")}
          />
        )}
        {user?.interview_status === 3 && (
          <View>
            <InterviewCard
              title={t("belum_lolos_wawancara")}
              image={images.failedBalloon}
              titleJapan={"不合格でした。また挑戦しよう!"}
              subtitle={t("pesan_belum_lolos_wawancara")}
            />
            <Space height={20} />
            <Button
              onPress={() => openAdminWhatsapp()}
              title={t("hubungi_admin_wiwitan")}
              style={{
                paddingVertical: scaledVertical(25),
                marginHorizontal: scaledHorizontal(30),
              }}
              textType="bold"
              textStyle={{ fontFamily: fonts.CenturyGothicBold }}
            />
          </View>
        )}
        {user?.interview_status === 1 && (
          <View>
            <InterviewCard
              title={t("lolos_wawancara")}
              image={images.rocket}
              titleJapan={"おめでとう!合格しました！"}
              subtitle={t("pesan_lolos_wawancara")}
            />
            <Space height={20} />
            <Button
              onPress={() => openAdminWhatsapp()}
              title={t("hubungi_admin_wiwitan")}
              style={{
                paddingVertical: scaledVertical(25),
                marginHorizontal: scaledHorizontal(30),
              }}
              textType="bold"
              textStyle={{ fontFamily: fonts.CenturyGothicBold }}
            />
          </View>
        )}
        {user?.interview_status === 2 ||
          (user?.interview_status === null && (
            <View>
              <Space height={20} />
              {interviewsList.map((item, index) => {
                return (
                  <Card
                    key={index}
                    style={{
                      marginHorizontal: scaledHorizontal(25),
                      marginBottom: scaledVertical(40),
                    }}
                  >
                    <View
                      style={{
                        paddingHorizontal: scaledHorizontal(15),
                        paddingVertical: scaledVertical(10),
                        backgroundColor: colors.stone100,
                        alignSelf: "center",
                        borderRadius: 8,
                      }}
                    >
                      <Text
                        size={12}
                        lineHeight={18}
                        variant="OpificioNeueRegular"
                      >
                        {t("wawancara")} {index + 1}
                      </Text>
                    </View>
                    <Space height={5} />
                    <Text
                      textAlign="center"
                      type="bold"
                      variant="CenturyGothicBold"
                      color={colors.accent}
                    >
                      {item?.type_label}
                    </Text>
                    <ListInterview data={item} />
                    <Space height={25} />
                    <Button
                      onPress={() => Linking.openURL(item?.link)}
                      title={t("menuju_link")}
                      style={{ paddingVertical: scaledVertical(25) }}
                      textType="bold"
                      textStyle={{ fontFamily: fonts.CenturyGothicBold }}
                    />
                  </Card>
                );
              })}
            </View>
          ))}

        <Space height={110} />
      </ScrollView>
    </View>
  );
};

export default FinalInterviewScreen;
