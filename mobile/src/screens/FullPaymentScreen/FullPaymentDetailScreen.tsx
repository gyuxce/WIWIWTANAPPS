import CardPaymentNominal from "components/CardPaymentNominal";
import Header from "components/Header";
import Section from "components/Section";
import Space from "components/Space";
import React, { useEffect, useState } from "react";
import { View, Platform, ScrollView, RefreshControl } from "react-native";
import globalStyles from "utils/GlobalStyles";
import PaymentTab from "components/PaymentTab";
import { usePayment } from "hooks/usePayment";
import { numberToRupiah } from "utils/Utils";
import PaymentScreen from "components/PaymentScreen";
import { t } from "i18next";
import NavigationService from "utils/NavigationService";

const FullPaymentDetailScreen = ({ route }: any) => {
  const [isLoading, setIsLoading] = useState(false);
  const { transaction } = usePayment();

  const prepareData = () => {
    //validate
    if (!transaction) { return; }
    // if (!transaction || !transaction.installment) { 
    //   NavigationService.replace("PaymentAdministration");
    // }
  };

  useEffect(() => {
    prepareData();
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
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={prepareData} />
        }
        showsVerticalScrollIndicator={false}
      >
        <Space height={25} />
        <PaymentTab
          active={route?.params?.price_type === 2 ? "training" : "admin"}
        />
        <Space height={30} />
        <Section
          textTitle={
            route?.params?.price_type === 2
              ? "Biaya Pelatihan"
              : "Biaya Administrasi"
          }
          textJapan={
            route?.params?.price_type === 2 ? "研修費用です" : "手続き費用"
          }
        />
        <Space height={10} />
        <CardPaymentNominal
          text={
            route?.params?.price_type === 2
              ? t("total_biaya_pelatihan")
              : t("total_biaya_administrasi")
          }
          nominal={numberToRupiah(transaction.total_amount)}
          style={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}
        />
        <View>
          <Space height={30} />
          <PaymentScreen />
        </View>
        <Space height={50} />
      </ScrollView>
    </View>
  );
};

export default FullPaymentDetailScreen;
