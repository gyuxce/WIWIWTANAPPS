import Button from "components/Button";
import CardPaymentNominal from "components/CardPaymentNominal";
import Header from "components/Header";
import Section from "components/Section";
import Space from "components/Space";
import React, { useEffect, useState } from "react";
import { View, Platform, ScrollView } from "react-native";
import globalStyles from "utils/GlobalStyles";
import NavigationService from "utils/NavigationService";
import { scaledFontSize, scaledHorizontal } from "utils/ScaledService";
import SectionInfo from "components/SectionInfo";
import Card from "components/Card";
import colors from "configs/colors";
import PaymentTab from "components/PaymentTab";
import { usePayment } from "hooks/usePayment";
import { numberToRupiah } from "utils/Utils";
import { ErrorStatus } from "utils/ErrorStatus";
import { useDispatch } from "react-redux";
import { CommonActions, useNavigation } from "@react-navigation/core";
import { t } from "i18next";

const InstallmenScreen = () => {
  const {
    postPayment,
    detailPrice,
    getPaymentStatusType,
    paymentContent,
    getPaymentContent,
  } = usePayment();

  const [isLoadingBtn, setIsloadingBtn] = useState(false);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  //0 -> disable, 1 -> checkbox, 2 -> checklist
  // const dataPayment = [
  //   {
  //     title: "Biaya Administrasi",
  //     isChecklist: 1,
  //   },
  //   {
  //     title: "Biaya Pelatihan",
  //     isChecklist: 0,
  //   },
  // ];

  const handlePayment = () => {
    setIsloadingBtn(true);
    const body = {
      price_type: 1,
      payment_type: 2,
      total_amount: detailPrice?.administration,
      total: detailPrice?.administration,
    };
    postPayment(body).then(({ status }) => {
      setIsloadingBtn(false);
      if (status === "success") {
        getPaymentStatusType();
        navigation.dispatch(
          CommonActions.reset({
            index: 1,
            routes: [
              { name: "HomeScreen" },
              {
                name: "InstallmentDetailScreen",
              },
            ],
          }),
        );
      } else {
        ErrorStatus(400, dispatch);
      }
    });
  };

  useEffect(() => {
    getPaymentContent({
      payment_type: 2,
      price_type: 1,
      language_type: 1,
    });
  }, []);

  return (
    <View style={globalStyles().topSafeArea}>
      <Space height={Platform.OS === "android" ? 15 : 0} />
      <Header
        withBell
        totalNotification={4}
        withBackButton
        withTextTitle
        textJapan="支払い"
        textTitle="Pembayaran"
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <Space height={25} />
        <PaymentTab />
        <Space height={30} />
        <Section textTitle="Biaya Administrasi" textJapan="手続き費用" />
        <Space height={10} />
        <CardPaymentNominal
          nominal={numberToRupiah(detailPrice?.administration)}
          style={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}
        />
        <Space height={20} />
        <View style={{ marginHorizontal: scaledHorizontal(25) }}>
          <Card>
            {paymentContent?.items?.map((item: any, index: number) => {
              return (
                <SectionInfo
                  title={item?.child?.title}
                  htmlContent={item?.child?.description}
                  isHtml={true}
                  index={index}
                  key={index}
                  dataLength={paymentContent?.items?.length}
                  withBullet={false}
                  textAlign="center"
                  alignParagraph="center"
                />
              );
            })}
          </Card>
        </View>
        <Space height={50} />
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
          onPress={handlePayment}
          isLoading={isLoadingBtn}
          variant="CenturyGothicBold"
          textType="bold"
          title={t("bayar")}
          type="light"
          style={{ paddingVertical: 12, minWidth: "100%" }}
          textStyle={{
            fontSize: scaledFontSize(20),
            lineHeight: 18,
          }}
        />
        <Button
          onPress={() => NavigationService.back()}
          variant="CenturyGothicBold"
          textType="bold"
          title={t("kembali")}
          type="light"
          style={{ paddingVertical: 12, minWidth: "100%" }}
          withBorder={false}
          textStyle={{
            fontSize: scaledFontSize(20),
            lineHeight: 18,
          }}
        />
      </Card>
    </View>
  );
};

export default InstallmenScreen;
