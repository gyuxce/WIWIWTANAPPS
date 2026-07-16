import Button from "components/Button";
import Card from "components/Card";
import ForumComment from "components/ForumComment";
import Section from "components/Section";
import Space from "components/Space";
import Text from "components/Text";
import colors from "configs/colors";
import images from "configs/images";
import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import globalStyles from "utils/GlobalStyles";
import NavigationService from "utils/NavigationService";
import {
  scaledFontSize,
  scaledHorizontal,
  scaledVertical,
} from "utils/ScaledService";
import CarouselGuest from "components/CarouselGuest";
import type { ICarouselInstance } from "react-native-reanimated-carousel";
import Options from "components/CarouselGuest/Options";
import { useSeminar } from "hooks/useSeminar";
import type { QueryType } from "types/QueryTypes";
import type { SeminarType } from "types/SeminarTypes";
import { ErrorStatus } from "utils/ErrorStatus";
import { useDispatch } from "react-redux";
import { isCloseToRight } from "utils/Utils";
import { useForum } from "hooks/useForum";
import type { ForumPostType } from "types/ForumTypes";

import styles from "./styles";
import {
  InterviewComponent,
  PaymentComponent,
  PratestComponent,
  SertifikasiComponent,
  TrainingComponent,
} from "./ConfigCarousel";
import TechnicalTraining from "./ListTraining/TechnicalTraining";
import SkilledTraining from "./ListTraining/SkilledTraining";
import { useNavigation } from "@react-navigation/core";
import { usePersist } from "hooks/usePersist";

const GuestScreen = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const ref = React.useRef<ICarouselInstance>(null);
  const dispatch = useDispatch();
  const [seminarQuery] = useState({
    type: "pagination",
    relations: ["cover"],
    page: 1,
    limit: 5,

    options: [["filter,status,equal,1"]],
  } as QueryType);
  const [loadingTrendingPost, setLoadingTrendingPost] = useState(false);
  const [trendingQuery, _] = useState({
    type: "pagination",
    relations: ["user", "topic"],
    page: 1,
    limit: 3,
    type_post: "trending",
    q: "",
    order_by: "created_at",
    sort_by: "asc",
    options: [["filter,is_publish,equal,1"]],
  } as QueryType);
  const { getTrendingPostPublic, trendingPostPublic } = useForum();
  const { getSeminarList, seminarList, metaSeminar } = useSeminar();
  const { changeInstall } = usePersist();
  const [selectedTraining, setSelectedTraining] = useState(1);
  const navigation = useNavigation();

  useEffect(() => {
    getSeminarList([] as SeminarType[], seminarQuery).then(({ status }) => {
      if (status === "failed") {
        ErrorStatus(500, dispatch);
      }
    });
    setLoadingTrendingPost(true);
    getTrendingPostPublic([] as ForumPostType[], trendingQuery).then(() => {
      setLoadingTrendingPost(false);
    });
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      changeInstall(false);
    });
    return unsubscribe;
  }, []);

  const listComponent = [
    {
      component: <PratestComponent />,
    },
    {
      component: <PaymentComponent />,
    },
    {
      component: <TrainingComponent />,
    },
    {
      component: <SertifikasiComponent />,
    },
    {
      component: <InterviewComponent />,
    },
  ];

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
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <Space height={20} />
        <Card style={{ marginHorizontal: scaledHorizontal(25) }}>
          <Image source={images.imageParent} style={styles.imageParent} />
          <Space height={20} />
          <Text textAlign="center" size={48} color={colors.accent}>
            ようこそ！
          </Text>
          <Text
            textAlign="center"
            size={16}
            color={colors.accent}
            type="bold"
            variant="CenturyGothicBold"
          >
            Selamat datang di Wiwitan!
          </Text>
          <Space height={20} />
          <Text textAlign="center" size={12} color={colors.black}>
            Yuk bergabung dengan keluarga Wiwitan dan segera nikmati program
            pembelajaran untuk masa depan kamu yang baru di Jepang!
          </Text>
        </Card>

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
            2 Jenis Pelatihan
          </Text>
          <Space height={15} />

          <View style={{ flexDirection: "row", gap: 5 }}>
            <Button
              title="TITP"
              onPress={() => setSelectedTraining(0)}
              disabled={true}
              style={{
                flex: 1,
                borderRadius: 12,
                borderLeftWidth: selectedTraining === 0 ? 1 : 0,
                borderRightWidth: selectedTraining === 0 ? 1 : 0,
                borderTopWidth: selectedTraining === 0 ? 1 : 0,
                borderBottomWidth: selectedTraining === 0 ? 1 : 0,
                paddingVertical: 10,
              }}
            />
            <Button
              title="SSW"
              onPress={() => setSelectedTraining(1)}
              style={{
                flex: 1,
                borderRadius: 12,
                borderLeftWidth: selectedTraining === 1 ? 1 : 0,
                borderRightWidth: selectedTraining === 1 ? 1 : 0,
                borderTopWidth: selectedTraining === 1 ? 1 : 0,
                borderBottomWidth: selectedTraining === 1 ? 1 : 0,
                paddingVertical: 10,
              }}
            />
          </View>
          {selectedTraining === 0 && <TechnicalTraining />}
          {selectedTraining === 1 && <SkilledTraining />}
        </Card>

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
            Proses Pelatihan Anda
          </Text>
          <CarouselGuest
            carouselRef={ref}
            setCurrentIndex={setCurrentIndex}
            listComponent={listComponent}
          />
          <Options
            carouselRef={ref}
            currentIndex={currentIndex}
            guestList={listComponent}
            setCurrentIndex={setCurrentIndex}
          />
        </Card>
        <Space height={30} />
        <Section textTitle="Trending di Forum" textJapan="フォーラムで人気" />
        <Space height={10} />
        {loadingTrendingPost ? (
          <View>
            <Space height={100} />
            <ActivityIndicator size={"large"} color={colors.black} />
          </View>
        ) : (
          <View>
            {trendingPostPublic?.length > 0 ? (
              <>
                {trendingPostPublic.map((item, index) => {
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
        <Card style={styles.containerCardSection}>
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
        <Space height={30} />
      </ScrollView>
      <Card style={styles.containerCardButton}>
        <Button
          onPress={() => NavigationService.navigate("LoginScreen")}
          variant="CenturyGothicBold"
          textType="bold"
          title="Masuk"
          type="light"
          style={{ paddingVertical: 12, minWidth: "100%" }}
          textStyle={{
            fontSize: scaledFontSize(20),
            lineHeight: 18,
          }}
        />
      </Card>
    </View>
  );
};

export default GuestScreen;
