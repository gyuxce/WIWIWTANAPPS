import Card from "components/Card";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Linking,
  Modal,
  TouchableOpacity,
  View,
} from "react-native";
import SectionInfo from "components/SectionInfo";
import Space from "components/Space";
import { scaledHorizontal, scaledVertical } from "utils/ScaledService";
import fonts from "configs/fonts";
import Button from "components/Button";
import icons from "configs/icons";
import Text from "components/Text";
import DocumentPicker from "react-native-document-picker";
import { apiUploadDocument } from "services/UserService";
import { useAuth } from "hooks/useAuth";
import { ErrorStatus } from "utils/ErrorStatus";
import { useDispatch } from "react-redux";
import { onErrorState } from "stores/error/errorSlice";
import { useUser } from "hooks/useUser";
import colors from "configs/colors";
import { usePayment } from "hooks/usePayment";
import { t } from "i18next";

import styles from "./style";
import { Info, Info2, Info3 } from "./info";

interface DownloadContractPaymentProps {
  onSubmit?: () => void;
  isBtnLoading?: boolean;
}

const DownloadContractPayment = ({
  onSubmit,
  isBtnLoading = false,
}: DownloadContractPaymentProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isAgree, setIsAgree] = useState(false);
  const { auth } = useAuth();
  const { detailPrice } = usePayment();
  const dispatch = useDispatch();
  const { getUserDocs, userDocs } = useUser();
  const { checkPaymentDoc, paymentDocStatus } = usePayment();
  const handleUpload = async (slug: string, type: number) => {
    try {
      const result: any = await DocumentPicker.pickSingle({
        type: DocumentPicker.types.pdf,
      });
      const data: any = new FormData();
      data.append("file", {
        uri: result.uri,
        name: result.name,
        mime: result?.type,
        type: result.type,
      });
      data.append("slug", slug);
      data.append("type", type);
      try {
        setIsLoading(true);
        await apiUploadDocument(auth?.accessToken, data);
        prepareData();
        setIsLoading(false);
      } catch (err: any) {
        setIsLoading(false);
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

  const prepareData = () => {
    getUserDocs({
      type: "collection",
      relations: ["file"],
    }).then(() => {
      checkPaymentDoc();
      // if (status === "failed") {
      //   ErrorStatus(500, dispatch);
      // }
    });
  };

  const getDocBySlug = (slug: string) => {
    return userDocs?.find(
      (item: any) => item?.slug === slug && item?.type === 4,
    );
  };

  useEffect(() => {
    prepareData();
  }, []);

  return (
    <View>
      <Card style={{ marginHorizontal: scaledHorizontal(25) }}>
        {Info.map((item, index) => {
          return (
            <SectionInfo
              title={item?.title}
              subtitle={item.subtitle}
              index={0}
              key={index}
              dataLength={Info.length}
              withBullet={item.withBullet}
              textAlign="center"
            />
          );
        })}
        <Space height={20} />
        <Text textAlign="center" size={12}>
          {t("berkas_surat_pernyataan")}
        </Text>
        <Space height={12} />

        <View style={styles.docInfoWrapper}>
          <View style={styles.docInfo}>
            <Image style={styles.docInfoIcon} source={icons.document} />
            <Text
              size={12}
              numberOfLines={1}
              style={{ paddingRight: 20 }}
              type="bold"
              variant="CenturyGothicBold"
            >
              {detailPrice?.file_installment?.filename}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              Linking.openURL(detailPrice?.file_installment?.url);
            }}
          >
            <Image style={styles.docDownloadIcon} source={icons.download} />
          </TouchableOpacity>
        </View>

        <Space height={12} />
        <Button
          numberOfLines={1}
          onPress={() => handleUpload("SURAT CICILAN PRIBADI", 4)}
          title={
            getDocBySlug("SURAT CICILAN PRIBADI")?.file?.filename ||
            t("upload_surat_pernyataan")
          }
          style={{ paddingVertical: scaledVertical(25), alignItems: "center" }}
          textStyle={{ fontFamily: fonts.CenturyGothicBold, fontSize: 12 }}
          icon={
            getDocBySlug("SURAT CICILAN PRIBADI")?.file?.filename
              ? null
              : icons.upload
          }
          iconStyle={{
            height: 24,
            width: 24,
            resizeMode: "contain",
            marginRight: 10,
          }}
          innerStyle={{ alignItems: "center" }}
        />
        <Space height={32} />
        {Info2.map((item, index) => {
          return (
            <SectionInfo
              title={item?.title}
              subtitle={item.subtitle}
              index={1}
              key={index}
              dataLength={Info.length}
              withBullet={item.withBullet}
              textAlign="center"
            />
          );
        })}
        <Button
          numberOfLines={1}
          onPress={() => handleUpload("KTP", 4)}
          title={getDocBySlug("KTP")?.file?.filename || t("upload_ktp")}
          style={{ paddingVertical: scaledVertical(25), alignItems: "center" }}
          textStyle={{ fontFamily: fonts.CenturyGothicBold, fontSize: 12 }}
          icon={getDocBySlug("KTP")?.file?.filename ? null : icons.upload}
          iconStyle={{
            height: 24,
            width: 24,
            resizeMode: "contain",
            marginRight: 10,
          }}
          innerStyle={{ alignItems: "center" }}
        />
        <Space height={32} />
        {Info3.map((item, index) => {
          return (
            <SectionInfo
              title={item?.title}
              subtitle={item.subtitle}
              index={2}
              key={index}
              dataLength={Info.length}
              withBullet={item.withBullet}
              textAlign="center"
            />
          );
        })}
        <Button
          numberOfLines={1}
          onPress={() => handleUpload("KTP WALI", 4)}
          title={
            getDocBySlug("KTP WALI")?.file?.filename || t("upload_ktp_wali")
          }
          style={{ paddingVertical: scaledVertical(25), alignItems: "center" }}
          textStyle={{ fontFamily: fonts.CenturyGothicBold, fontSize: 12 }}
          icon={getDocBySlug("KTP WALI")?.file?.filename ? null : icons.upload}
          iconStyle={{
            height: 24,
            width: 24,
            resizeMode: "contain",
            marginRight: 10,
          }}
          innerStyle={{ alignItems: "center" }}
        />
      </Card>
      <Space height={12} />
      <View style={styles.containerCheckbox}>
        <TouchableOpacity onPress={() => setIsAgree(!isAgree)}>
          <Image
            source={isAgree ? icons.checklistBox : icons.box}
            style={styles.imageCheckbox}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setIsAgree(!isAgree)}>
          <Text
            style={{ paddingRight: 16, flex: 1 }}
            size={12}
            variant="CenturyGothicRegular"
          >
            {t("agreement_download_contract")}
          </Text>
        </TouchableOpacity>
      </View>
      <Space height={12} />
      <Button
        onPress={onSubmit}
        isLoading={isBtnLoading}
        title={t("lanjutkan")}
        disabled={
          !isAgree ||
          !paymentDocStatus?.isCompleteTrainingInstallmentDocsRequirement
        }
        style={{
          paddingVertical: scaledVertical(25),
          marginHorizontal: scaledHorizontal(25),
        }}
        withBorder={
          isAgree &&
          paymentDocStatus?.isCompleteTrainingInstallmentDocsRequirement
        }
        textStyle={{ fontFamily: fonts.CenturyGothicBold, fontSize: 12 }}
      />
      <Modal transparent visible={isLoading}>
        <View
          style={{
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator size={"large"} color={colors.accent} />
        </View>
      </Modal>
    </View>
  );
};

export default DownloadContractPayment;
