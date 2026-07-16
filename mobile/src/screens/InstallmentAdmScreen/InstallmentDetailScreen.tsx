import Button from "components/Button";
import CardPaymentNominal from "components/CardPaymentNominal";
import Header from "components/Header";
import Section from "components/Section";
import Space from "components/Space";
import React, { useEffect, useState } from "react";
import {
  View,
  Platform,
  ScrollView,
  Image,
  RefreshControl,
} from "react-native";
import globalStyles from "utils/GlobalStyles";
import NavigationService from "utils/NavigationService";
import { scaledFontSize, scaledHorizontal } from "utils/ScaledService";
import Card from "components/Card";
import colors from "configs/colors";
import PaymentTab from "components/PaymentTab";
import icons from "configs/icons";
import Text from "components/Text";
import { usePayment } from "hooks/usePayment";
import { ErrorStatus } from "utils/ErrorStatus";
import { useDispatch } from "react-redux";
import { numberToRupiah } from "utils/Utils";
import dayjs from "dayjs";
import { apiUploadImage } from "services/UserService";
import { useAuth } from "hooks/useAuth";
import DocumentPicker from "react-native-document-picker";
import { onErrorState } from "stores/error/errorSlice";
import images from "configs/images";
import CardPaymentPaid from "components/CardPaymentPaid";
import ModalAlert from "components/ModalAlert";
import { t } from "i18next";

const InstallmentDetailScreen = () => {
  const [installmentDetail, setInstallmentDetail] = useState({
    total_amount: "0",
    left_amount: "0",
  } as any);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setUploadLoading] = useState(false);
  const [file, setFile] = useState(null as any);
  const { getPaymentDetail, postPaymentProof, paymentStatusType } =
    usePayment();
  const dispatch = useDispatch();
  const { auth, getMe } = useAuth();
  const [showModal, setShowModal] = useState(false);

  const prepareData = () => {
    setIsLoading(true);
    getPaymentDetail({ payment_type: 2, price_type: 1 }).then(({ data }) => {
      setIsLoading(false);
      if (data) {
        const _data = {
          ...data?.details,
          payments: data?.payments?.map((item: any, i: number) => ({
            ...item,
            title: `${t("cicilan")} ${i + 1}`,
            isChecklist: item?.payment_proof?.status === 2 ? 2 : 0,
          })),
        };
        setInstallmentDetail(_data);
      } else {
        ErrorStatus(500, dispatch);
      }
    });
    getMe(auth?.accessToken, auth);
  };

  const getCurrentPayment = () => {
    const currentPayment = installmentDetail?.payments?.find(
      (item: any) => item?.payment_proof?.status !== 2,
    );
    return currentPayment;
  };

  const handleUpload = async () => {
    try {
      const result: any = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.images, DocumentPicker.types.pdf],
      });
      const data: any = new FormData();
      data.append("file", {
        uri: result.uri,
        name: result.name,
        mime: result?.type,
        type: result.type,
      });
      try {
        setUploadLoading(true);
        const resp = await apiUploadImage(auth?.accessToken, data, dispatch);
        if (resp?.uuid) {
          setFile(resp);
        } else {
          ErrorStatus(400, dispatch);
        }
        setUploadLoading(false);
      } catch (err: any) {
        setFile(null);
        setUploadLoading(false);
        ErrorStatus(400, dispatch);
      }
    } catch (err: any) {
      if (!DocumentPicker.isCancel(err)) {
        dispatch(
          onErrorState({
            visible: true,
            text: err?.message || "Failed to select document",
            icon: icons.searchClose,
            withCloseIcon: true,
            withIcon: true,
          }),
        );
      }
    }
  };

  const handleSubmit = async () => {
    const payment = getCurrentPayment();
    const installment_id =
      installmentDetail?.payments[0]?.installment?.uuid || null;
    if (payment && installment_id && file) {
      setShowModal(false);
      setIsLoading(true);
      postPaymentProof({
        installment_id,
        payment_id: payment?.uuid,
        transaction_id: payment?.transaction?.uuid,
        file_id: file?.uuid,
      }).then(({ status }) => {
        setIsLoading(false);
        if (status === "success") {
          setFile(null);
          prepareData();
          NavigationService.push("PaymentTypeScreen", {
            textJapan: "ありがとうございます！",
            textTitle: t("terimakasih"),
            textSubtitle: t("pembayaran_akan_diverifikasi"),
            textButton: t("lanjutkan_pembayaran_pelatihan"),
            identifier: "pembayaran-pelatihan-success",
            secondBtnText: t("lanjutkan_cicilan_administrasi"),
            secondIdentifier: "go-back",
            image: images.perjalananStatus,
            titleType: "big",
            imageSize: "small",
          });
        } else {
          ErrorStatus(400, dispatch);
        }
      });
    }
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
        <PaymentTab />
        <Space height={30} />
        <Section textTitle="Biaya Administrasi" textJapan="手続き費用" />
        <Space height={10} />
        <CardPaymentNominal
          text={t("total_biaya_administrasi")}
          nominal={numberToRupiah(installmentDetail?.total_amount)}
          style={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}
        />
        {paymentStatusType?.administration_payment_type === 2 && !isLoading && (
          <>
            <CardPaymentNominal
              text={t("sisa_yang_harus_dibayarkan")}
              nominal={numberToRupiah(installmentDetail?.left_amount)}
              style={{ borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
            />
            <Space height={20} />
          </>
        )}
        <View style={{ marginHorizontal: scaledHorizontal(25) }}>
          <Space height={24} />
          {installmentDetail?.payments?.map((item: any, index: number) => {
            return (
              <View
                key={index}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 8,
                  marginTop: 3,
                  flex: 1,
                }}
              >
                <View
                  style={{
                    alignSelf: "flex-start",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <Image
                    source={
                      item.isChecklist === 2
                        ? icons.checklistBox
                        : item.isChecklist === 1
                        ? icons.box
                        : icons.checkbox
                    }
                    style={{ width: 18, height: 18, resizeMode: "cover" }}
                  />
                  <Text
                    size={12}
                    type="bold"
                    variant="CenturyGothicBold"
                    style={{
                      opacity: item.isChecklist > 0 ? 1 : 0.25,
                    }}
                  >
                    {item.title}
                  </Text>
                </View>
                <View
                  style={{
                    alignSelf: "flex-end",
                    marginLeft: "auto",
                  }}
                >
                  <Text
                    style={{
                      opacity: item.isChecklist > 0 ? 1 : 0.25,
                    }}
                    size={12}
                    variant="CenturyGothicBold"
                    type="bold"
                  >
                    {item?.payment_proof?.status === 2
                      ? dayjs(item?.payment_proof?.date).format("DD/MM/YYYY")
                      : item?.payment_proof?.status === 1
                      ? t("menunggu_konfirmasi")
                      : ""}
                  </Text>
                </View>
              </View>
            );
          })}
          <Space height={20} />
        </View>
        {/* {installmentDetail?.left_amount > 0 && !isLoading && (
          <View style={{ marginHorizontal: scaledHorizontal(25) }}>
            <Button
              isLoading={isUploading}
              title={
                !file
                  ? `Upload Bukti Pembayaran (Cicilan ${
                      getCurrentPayment()?.payment_proof?.status === 1
                        ? getCurrentPayment()?.index + 1
                        : getCurrentPayment()?.index || 1
                    })`
                  : file?.filename
              }
              style={{
                paddingVertical: 13,
                justifyContent: "flex-start",
              }}
              onPress={handleUpload}
              disabled={
                getCurrentPayment()?.payment_proof?.status === 1 ||
                installmentDetail?.left_amount === 0
              }
              withBorder={
                getCurrentPayment()?.payment_proof?.status === 1 &&
                installmentDetail?.left_amount === 0
              }
              variant="CenturyGothicBold"
              textType="bold"
              textStyle={{ fontSize: 13 }}
              icon={icons.upload}
              iconStyle={{
                height: 18,
                width: 18,
                resizeMode: "contain",
                alignSelf: "flex-end",
                marginRight: scaledHorizontal(10),
              }}
            />
          </View>
        )} */}
        {installmentDetail?.left_amount === 0 && !isLoading && (
          <CardPaymentPaid />
        )}
        <Space height={50} />
      </ScrollView>
      <ModalAlert
        onHide={() => setShowModal(false)}
        showModal={showModal}
        animation={"zoom"}
        title={t("pastikan_bahwa_bukti_pembayaran")}
        leftFunction={handleSubmit}
        rightFunction={() => setShowModal(false)}
        leftText={t("kirim_bukti_bayar")}
        rightText={t("cek_kembali_deh")}
        iconImage={icons.warningRed}
        withIcon
        titleBig={t("upload_bukti_pembayaran")}
      />
      {installmentDetail?.left_amount > 0 && (
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
            disabled={
              getCurrentPayment()?.payment_proof?.status === 1 ||
              !file ||
              installmentDetail?.left_amount === 0 ||
              isUploading
            }
            isLoading={isLoading}
            onPress={() => setShowModal(true)}
            variant="CenturyGothicBold"
            textType="bold"
            title={t("kirim_bukti_bayar")}
            type="light"
            style={{ paddingVertical: 12, minWidth: "100%" }}
            textStyle={{
              fontSize: scaledFontSize(20),
              lineHeight: 18,
            }}
            withBorder={
              !(
                getCurrentPayment()?.payment_proof?.status === 1 ||
                !file ||
                installmentDetail?.left_amount === 0 ||
                isUploading
              )
            }
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
      )}
    </View>
  );
};

export default InstallmentDetailScreen;
