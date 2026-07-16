import { Image, View } from "react-native";
import React, { useEffect } from "react";
import globalStyles from "utils/GlobalStyles";
import Header from "components/Header";
import images from "configs/images";
import Section from "components/Section";
import Space from "components/Space";
import Text from "components/Text";
import Button from "components/Button";
import icons from "configs/icons";
import { useNavigation } from "@react-navigation/core";
import { scaledHorizontal } from "utils/ScaledService";

import styles from "./styles";

const UploadTest = () => {
  const navigation = useNavigation();

  useEffect(
    () =>
      navigation.addListener("beforeRemove", e => {
        e.preventDefault();
        if (e.data.action.type === "POP" || e.data.action.type === "GO_BACK") {
          return;
        } else {
          navigation.dispatch(e.data.action);
          return;
        }
      }),
    [navigation],
  );
  return (
    <View style={globalStyles().topSafeArea}>
      <Header withTextTitle textJapan="事前テスト" textTitle="Pra Tes" />
      <View style={styles.container}>
        <Image source={images.imagePerjalanan} style={styles.imageHeader} />
        <Space height={48} />
        <Section textJapan="言語テスト" textTitle="Test Bahasa" />
        <Space height={48} />
        <View style={styles.content}>
          <Text variant="CenturyGothicBold" type="bold">
            Upload hasil tes kamu!
          </Text>
          <Space height={12} />
          <Text size={12} lineHeight={18} textAlign="center">
            Tes telah selesai! Tim Wiwitan akan segera memprosesnya, dan hasil
            tes akan segera kami kabari.
          </Text>
          <Space height={20} />
        </View>
        <Button
          title="Upload Hasil Tes"
          style={{
            paddingVertical: 13,
            justifyContent: "flex-start",
            width: "90%",
          }}
          variant="CenturyGothicBold"
          textType="bold"
          icon={icons.upload}
          iconStyle={{
            height: 16,
            width: 16,
            resizeMode: "contain",
            alignSelf: "flex-end",
            marginRight: scaledHorizontal(10),
          }}
        />
        <Space height={15} />
        <Button
          title="Kirim Hasil Tes"
          style={{
            paddingVertical: 13,
            justifyContent: "flex-start",
            width: "90%",
          }}
          disabled
          withBorder={false}
          variant="CenturyGothicBold"
          textType="bold"
        />
      </View>
    </View>
  );
};

export default UploadTest;
