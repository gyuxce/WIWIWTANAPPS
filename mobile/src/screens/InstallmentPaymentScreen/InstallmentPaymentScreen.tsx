import CardPaymentNominal from "components/CardPaymentNominal";
import Header from "components/Header";
import Section from "components/Section";
import Space from "components/Space";
import Steps from "components/Steps";
import Text from "components/Text";
import React, { useEffect, useState } from "react";
import { View, Platform, ScrollView, ActivityIndicator } from "react-native";
import globalStyles from "utils/GlobalStyles";
import NavigationService from "utils/NavigationService";
import Button from "components/Button";
import Card from "components/Card";
import colors from "configs/colors";
import { scaledFontSize, scaledHorizontal } from "utils/ScaledService";
import PaymentTab from "components/PaymentTab";
import { usePayment } from "hooks/usePayment";
import { numberToRupiah } from "utils/Utils";
import { t } from "i18next";
import Toast from "react-native-root-toast";

import FullPayment from "./FullPayment/FullPayment";
import PaymentOptions from "./PaymentOptions/PaymentOptions";
import SignContract from "./SignContract/SignContract";
import PaymentTerms from "./PaymentTerms/PaymentTerms";
import DownloadContractPayment from "./DownloadContractPayment/DownloadContractPayment";

const InstallmentPaymentScreen = () => {
  const [isAgree, setIsAgree] = useState(false);
  const {
    getDetailPrice,
    detailPrice,
    getLatestTransaction,
    initiateTransaction,
    getPaymentContent,
    paymentContent,
  } = usePayment();
  //1 lunas 2 cicilan
  const [paymentOptions, setPaymentOptions] = useState(0);
  const [_, setMaxStep] = useState(4);
  const [step, setStep] = useState(1);
  const [isAgreement] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingBtn] = useState(false);

  const toastConfig = {
    duration: Toast.durations.SHORT,
    position: Toast.positions.TOP,
    shadow: true,
    animation: true,
    hideOnPress: true,
  };

  const onPressNext = () => {
    setStep(2);
  };

  const checkCurrentPaymentStatus = (transaction: any) => {
    if (!transaction || Object.keys(transaction).length <= 0) {
      return;
    }
    if (
      transaction.installment &&
      Object.keys(transaction.installment).length >= 1
    ) {
      NavigationService.replace("InstallmentPaymentDetailScreen", {
        price_type: 2,
      });
    } else {
      NavigationService.replace("FullPaymentDetailScreen", {
        price_type: 2,
      });
    }
  };

  const handleSubmit = async (payment_type: number) => {
    setIsLoading(true);
    let transaction = await initiateTransaction({
      price_type: 2,
      payment_type: payment_type,
    });
    setIsLoading(false);

    if (transaction.status === "failed") {
      Toast.show(
        "Error during processing, please contact the administrator",
        toastConfig,
      );
    } else {
      checkCurrentPaymentStatus(transaction.data);
    }
  };

  const initPage = async () => {
    setIsLoading(true);
    await getDetailPrice(2);
    await getPaymentContent({
      payment_type: 2,
      price_type: 1,
      language_type: 1,
    });
    let transaction = await getLatestTransaction({ price_type: 2 });
    setIsLoading(false);

    if (transaction.status === "failed") {
      Toast.show(
        "Error during processing, please contact the administrator",
        toastConfig,
      );
    } else {
      checkCurrentPaymentStatus(transaction.data);
    }
  };

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
        onBackButton={() => {
          if (step !== 1) {
            setStep(step - 1);
          } else {
            NavigationService.back();
          }
        }}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <Space height={25} />
        <PaymentTab active="training" />
        <Space height={30} />
        <Section textTitle="Biaya Pelatihan" textJapan="研修費用です" />
        <Space height={15} />
        <CardPaymentNominal nominal={numberToRupiah(detailPrice?.training)} />
        <Space height={20} />
        {isLoading ? (
          <ActivityIndicator size={"large"} color={colors.accent} />
        ) : (
          <>
            <Steps step={step} maxStep={4} />
            <Space height={15} />

            <Text
              textAlign="center"
              size={20}
              style={{ flex: 1, marginHorizontal: scaledHorizontal(25) }}
            >
              {step === 1 && t("ketentuan_pembayaran")}
              {step === 2 && t("tanda_tangan_surat_pelatihan")}
              {step === 3 && t("pilih_opsi_pembayaran")}
              {step === 4 &&
                paymentOptions === 1 &&
                t("ketentuan_pembayaran_lunas")}
              {step === 4 &&
                paymentOptions === 2 &&
                isAgreement === false &&
                t("upload_dokumen_cicilan_pribadi")}
            </Text>
            <Space height={20} />
            {step === 1 && (
              <PaymentTerms
                data={paymentContent?.items || []}
                isAgree={isAgree}
                setIsAgree={setIsAgree}
                onPressNext={onPressNext}
              />
            )}
            {step === 2 && (
              <SignContract
                onSignPress={() => {
                  setStep(3);
                }}
              />
            )}
            {step === 3 && (
              <PaymentOptions
                setMaxStep={setMaxStep}
                setPaymentOptions={setPaymentOptions}
                setStep={setStep}
              />
            )}

            {step === 4 && paymentOptions === 1 && <FullPayment />}
            {step === 4 && paymentOptions === 2 && isAgreement === false && (
              <DownloadContractPayment
                isBtnLoading={isLoadingBtn}
                onSubmit={() => handleSubmit(2)}
              />
            )}
            {/* End Payment Options */}
          </>
        )}
        <Space height={50} />
      </ScrollView>
      {step === 4 && paymentOptions === 1 && (
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
            isLoading={isLoadingBtn}
            onPress={() => handleSubmit(1)}
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
            onPress={() => setStep(step - 1)}
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
      )}
    </View>
  );
};

export default InstallmentPaymentScreen;
