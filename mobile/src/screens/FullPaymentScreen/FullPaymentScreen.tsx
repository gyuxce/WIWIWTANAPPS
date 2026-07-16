import Card from "components/Card";
import CardPaymentNominal from "components/CardPaymentNominal";
import Header from "components/Header";
import Section from "components/Section";
import Space from "components/Space";
import React, { useEffect, useState } from "react";
import { View, Platform, ScrollView } from "react-native";
import globalStyles from "utils/GlobalStyles";
import SectionInfo from "components/SectionInfo";
import { scaledFontSize, scaledHorizontal } from "utils/ScaledService";
import Button from "components/Button";
import colors from "configs/colors";
import NavigationService from "utils/NavigationService";
import { usePayment } from "hooks/usePayment";
import { ErrorStatus } from "utils/ErrorStatus";
import { useDispatch } from "react-redux";
import { numberToRupiah } from "utils/Utils";
import { t } from "i18next";

const FullPaymentScreen = () => {
  const [transaction, setTransaction] = useState(null);
  const [payment, setPayment] = useState(null);
  const [isLoadingBtn, setIsloadingBtn] = useState(false);
  const {
    paymentContent,
    getPaymentContent,
    detailPrice,
    getDetailPrice,
    //postPayment,
    initiateTransaction,
    payTransaction,
    getLatestPayment
  } = usePayment();

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
  const dispatch = useDispatch();

  const handlePayment = () => {
    setIsloadingBtn(true);
    const body = {
      price_type: 1,
      payment_type: 1,
      total_amount: detailPrice?.administration,
      total: detailPrice?.administration,
    };
    initiateTransaction(body).then(({ data, status }) => {
      setIsloadingBtn(false);
      if (data && status === "success") {
        setTransaction(data);
        if (data?.checkout_url) {
          NavigationService.navigate("WebViewScreen", {
            uri: data?.checkout_url,
            from: "AdministrationPayment",
          });
        }
      } else {
        ErrorStatus(400, dispatch);
      }
    });
    // postPayment(body).then(({ data, status }) => {
    //   setIsloadingBtn(false);
    //   if (data && status === "success") {
    //     if (data?.checkout_url) {
    //       NavigationService.navigate("WebViewScreen", {
    //         uri: data?.checkout_url,
    //         from: "AdministrationPayment",
    //       });
    //     }
    //   } else {
    //     ErrorStatus(400, dispatch);
    //   }
    // });
  };

  useEffect(() => {
    if (!detailPrice?.administration) {
      getDetailPrice(1);
    }
    getPaymentContent({
      payment_type: 1,
      price_type: 1,
      language_type: 1,
    });
  }, []);

  return (
    <View style={globalStyles().topSafeArea}>
      <Space height={Platform.OS === "android" ? 15 : 0} />

      <ScrollView showsVerticalScrollIndicator={false}>
        <Header
          withBell
          totalNotification={4}
          withBackButton
          withTextTitle
          textJapan="支払い"
          textTitle="Pembayaran"
        />
        <Space height={25} />
        <Section textTitle="Biaya Administrasi" textJapan="手続き費用" />
        <Space height={10} />
        <CardPaymentNominal
          nominal={numberToRupiah(detailPrice?.administration)}
        />
        <Space height={20} />
        <Card style={{ marginHorizontal: scaledHorizontal(25) }}>
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
        <Space height={25} />
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
          title={t("bayar")}
          type="light"
          isLoading={isLoadingBtn}
          onPress={handlePayment}
          style={{ paddingVertical: 12, minWidth: "100%" }}
          textStyle={{
            fontSize: scaledFontSize(20),
            lineHeight: 18,
            fontWeight: "900",
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

export default FullPaymentScreen;
