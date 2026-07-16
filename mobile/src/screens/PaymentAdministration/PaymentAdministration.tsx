import Card from "components/Card";
import CardPaymentNominal from "components/CardPaymentNominal";
import Header from "components/Header";
import Section from "components/Section";
import Space from "components/Space";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Platform, ScrollView, View } from "react-native";
import globalStyles from "utils/GlobalStyles";
import NavigationService from "utils/NavigationService";
import { scaledHorizontal, scaledVertical } from "utils/ScaledService";
import SectionInfo from "components/SectionInfo";
import Button from "components/Button";
import fonts from "configs/fonts";
import PaymentTab from "components/PaymentTab";
import { usePayment } from "hooks/usePayment";
import { numberToRupiah } from "utils/Utils";
import colors from "configs/colors";
import { RefreshControl } from "react-native-gesture-handler";
import Toast from 'react-native-root-toast';
import { t } from "i18next";

import { InfoOptionOne, InfoOptionTwo } from "./info";

const PaymentAdministration = () => {
  const { getDetailPrice, detailPrice, getLatestTransaction, initiateTransaction } = usePayment();
  const [isLoading, setIsLoading] = useState(true);

  const toastConfig = {
    duration: Toast.durations.SHORT,
    position: Toast.positions.TOP,
    shadow: true,
    animation: true,
    hideOnPress: true
  };

  const checkCurrentPaymentStatus = (transaction :any) => {
    if (!transaction || Object.keys(transaction).length <= 0) { return; }
    if (transaction.installment && Object.keys(transaction.installment).length >= 1) {
      NavigationService.replace("InstallmentDetailScreen");
    } else {
      NavigationService.replace("FullPaymentDetailScreen", {
        price_type: 1,
      });
    }
  };

  const handleSubmit = async(payment_type: number) => {
    setIsLoading(true);
    let transaction = await initiateTransaction({ 
      price_type: 1,
      payment_type: payment_type 
    });
    setIsLoading(false);
    
    if (transaction.status === 'failed') {
      Toast.show('Error during processing, please contact the administrator', toastConfig);
    } else {
      checkCurrentPaymentStatus(transaction.data);
    }
  }

  const initPage = async() => {
    setIsLoading(true);
    await getDetailPrice(1);
    let transaction = await getLatestTransaction({ price_type: 1 });
    setIsLoading(false);

    if (transaction.status === 'failed') {
      Toast.show('Error during processing, please contact the administrator', toastConfig);
    } else {
      checkCurrentPaymentStatus(transaction.data);
    }
  }

  useEffect(() => {
    initPage();
  }, []);
  return (
    <View style={globalStyles().topSafeArea}>
      <Space height={Platform.OS === "android" ? 15 : 0} />
      <Header
        withBell
        totalNotification={4}
        withBurger
        withTextTitle
        textTitleJapanLeft="支払い"
        textTitleLeft="Pembayaran"
      />
      {isLoading ? (
        <ActivityIndicator
          size="small"
          color={colors.accent}
          style={{ marginTop: 30 }}
        />
      ) : (
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={initPage}
            />
          }
          showsVerticalScrollIndicator={false}
        >
          <Space height={25} />
          <PaymentTab />
          <Space height={30} />
          <Section textTitle="Biaya Administrasi" textJapan="手続き費用" />
          <Space height={10} />
          <CardPaymentNominal
            text={t("total_biaya_administrasi")}
            nominal={numberToRupiah(detailPrice?.administration)}
          />
          <Space height={20} />
          <Card style={{ marginHorizontal: scaledHorizontal(25) }}>
            {InfoOptionOne.map((item, index) => {
              return (
                <SectionInfo
                  title={item.title}
                  subtitle={item.subtitle}
                  index={index}
                  key={index}
                  dataLength={InfoOptionOne.length}
                  withBullet={item.withBullet}
                  textAlign="center"
                  withOption={true}
                  textOption="1"
                />
              );
            })}
            <Space height={20} />
            <Button
              onPress={() => handleSubmit(1)}
              title={t("langsung_lunas")}
              style={{ paddingVertical: scaledVertical(25) }}
              textStyle={{ fontFamily: fonts.CenturyGothicBold, fontSize: 12 }}
            />
          </Card>
          <Space height={20} />
          <Card style={{ marginHorizontal: scaledHorizontal(25) }}>
            {InfoOptionTwo.map((item, index) => {
              return (
                <SectionInfo
                  title={item.title}
                  subtitle={item.subtitle}
                  index={index}
                  key={index}
                  dataLength={InfoOptionTwo.length}
                  withBullet={item.withBullet}
                  textAlign="center"
                  withOption={true}
                  textOption="2"
                />
              );
            })}
            {/* <Space height={20} /> */}
            {/* <Button
              onPress={() =>
                NavigationService.navigate("InstallmentLandingScreen")
              }
              title={t("cicilan")}
              style={{ paddingVertical: scaledVertical(25) }}
              textStyle={{ fontFamily: fonts.CenturyGothicBold, fontSize: 12 }}
            /> */}
          </Card>
          <Space height={50} />
        </ScrollView>
      )}
    </View>
  );
};

export default PaymentAdministration;
