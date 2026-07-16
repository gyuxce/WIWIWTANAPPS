/* eslint-disable import/order */
/* eslint-disable max-len */
import React, { useState } from "react";
import { View, Dimensions, Image, ScrollView } from "react-native";
import Space from "components/Space";
import Steps from "components/Steps";
import Text from "components/Text";
import icons from "configs/icons";
import images from "configs/images";
import colors from "configs/colors";
import globalStyles from "utils/GlobalStyles";
import Button from "components/Button";
import {
  // scaledFontSize,
  scaledVertical,
  scaledHorizontal,
} from "utils/ScaledService";
import Carousel from "react-native-reanimated-carousel";
import NavigationService from "utils/NavigationService";
import styles from "./styles";

const SignupScreen = () => {
  // State steps
  const { width } = Dimensions.get("window");
  const { height } = Dimensions.get("window");
  const [steps, setStep] = useState(1);

  const dataLanding = [
    {
      image: images.landingOne,
      step: 1,
      titleRed: "訓練",
      title: "Fitur Pelatihan Komprehensif",
      content:
        "Wiwitan menawarkan program pelatihan teknis, kursus bahasa Jepang, dan pelatihan keterampilan manusia yang terbaik guna mencetak tenaga kerja yang berkualitas untuk meningkatkan kualitas hidup di Jepang.",
    },
    {
      image: images.landingTwo,
      step: 2,
      titleRed: "学習",
      title: "Pengalaman Belajar Efektif",
      content:
        "Nikmati pengalaman belajar yang luar biasa dengan akses ke teknologi mutakhir, pelatihan online dan offline, serta pendampingan yang efektif. Ciptakan masa depan Anda dengan Wiwitan.",
    },
    {
      image: images.landingThree,
      step: 3,
      titleRed: "支払い",
      title: "Pembiayaan Fleksibel",
      content:
        "Kami menawarkan opsi pembiayaan fleksibel, termasuk cicilan, dana talang, dan beasiswa, untuk membantu Anda mencapai impian tanpa tekanan keuangan. Pilih opsi yang sesuai dengan kebutuhan Anda bersama Wiwitan.",
    },
  ];

  return (
    <ScrollView>
      <View
        style={[
          globalStyles().topSafeArea,
          {
            justifyContent: "center",
            alignItems: "center",
            paddingVertical: scaledVertical(60),
            paddingHorizontal: scaledHorizontal(20),
          },
        ]}
      >
        <Space height={scaledVertical(25)} />
        <Steps step={steps} maxStep={3} />
        <Space height={scaledVertical(20)} />
        <Carousel
          width={(width * 90) / 100}
          height={(height * 70) / 100}
          data={dataLanding}
          scrollAnimationDuration={1000}
          enabled={false}
          defaultIndex={steps - 1}
          onSnapToItem={index => setStep(index + 1)}
          renderItem={({ index, item }) => (
            <View
              style={{
                //justifyContent: "center",
                paddingHorizontal: scaledHorizontal(20),
                width: "100%",
              }}
            >
              <Image
                key={index}
                source={item.image}
                style={{ alignSelf: "center" }}
                //style={{ marginLeft: scaledHorizontal(20) }}
              />
              <Space height={scaledVertical(25)} />
              <View style={styles.containerNumber}>
                <Text
                  size={20}
                  color={colors.white}
                  type="bold"
                  variant="CenturyGothicBold"
                >
                  {item.titleRed}
                </Text>
              </View>
              <Space height={scaledVertical(10)} />
              <Text
                size={20}
                variant="OpificioNeueRegular"
                textAlign="center"
                style={{ width: "100%" }}
              >
                {item.title}
              </Text>
              <Space height={scaledVertical(50)} />
              <Text
                size={12}
                variant="CenturyGothicRegular"
                textAlign="center"
                color={colors.black}
                style={{ width: "100%" }}
              >
                {item.content}
              </Text>
            </View>
          )}
        />
        <Space height={scaledVertical(20)} />
        <View
          style={{
            marginHorizontal: scaledHorizontal(25),
            flexDirection: "row",
            gap: 5,
          }}
        >
          {steps !== 1 ? (
            <Button
              icon={icons.leftArrow}
              onPress={() => setStep(steps - 1)}
              style={{
                width: scaledHorizontal(50),
                height: scaledHorizontal(50),
              }}
            />
          ) : null}

          <Button
            icon={icons.rightArrow}
            onPress={() => {
              steps === 3
                ? NavigationService.replace("GuestScreen")
                : setStep(steps + 1);
            }}
            style={{
              width: scaledHorizontal(50),
              height: scaledHorizontal(50),
              marginLeft: scaledHorizontal(20),
            }}
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default SignupScreen;
