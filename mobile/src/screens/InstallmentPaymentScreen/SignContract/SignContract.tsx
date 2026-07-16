import Card from "components/Card";
import React, { useEffect, useState } from "react";
import { scaledHorizontal, scaledVertical } from "utils/ScaledService";
import SectionInfo from "components/SectionInfo";
import Space from "components/Space";
import fonts from "configs/fonts";
import Button from "components/Button";
import icons from "configs/icons";
import colors from "configs/colors";
import Text from "components/Text";
import { Image, Linking, TouchableOpacity, View } from "react-native";
import DocumentPicker from "react-native-document-picker";
import { apiUploadDocument } from "services/UserService";
import { useAuth } from "hooks/useAuth";
import { ErrorStatus } from "utils/ErrorStatus";
import { useDispatch } from "react-redux";
import { onErrorState } from "stores/error/errorSlice";
import { useUser } from "hooks/useUser";
import { usePayment } from "hooks/usePayment";

import Info from "./info";
import styles from "./style";
import { FileType } from "types/ExamTypes";
import { t } from "i18next";

interface SignContractProps {
  onSignPress: () => void;
}

const SignContract = ({ onSignPress }: SignContractProps) => {
  const [isAgree, setIsAgree] = useState(false);
  const { detailPrice } = usePayment();
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState({} as FileType);
  const { auth } = useAuth();
  const dispatch = useDispatch();
  const { getUserDocs } = useUser();
  const { checkPaymentDoc } = usePayment();

  const handlePickDocument = async () => {
    try {
      const result: any = await DocumentPicker.pickSingle({
        type: DocumentPicker.types.pdf,
      });
      if (result?.uri) {
        setFile(result);
      }
      const data: any = new FormData();
      data.append("file", {
        uri: result.uri,
        name: result.name,
        mime: result?.type,
        type: result.type,
      });
      data.append("slug", "SURAT PELATIHAN");
      data.append("type", 4);
      try {
        setIsLoading(true);
        await apiUploadDocument(auth?.accessToken, data).then(() => {
          prepareData();
        });

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
    }).then(({ data }) => {
      if (data) {
        const docPelatihan = data?.find(
          item => item?.slug === "SURAT PELATIHAN" && item?.type === 4,
        );
        if (docPelatihan) {
          setFile(docPelatihan?.file);
        }
        checkPaymentDoc();
      }
    });
  };

  useEffect(() => {
    prepareData();
  }, []);

  return (
    <View>
      <Card style={{ marginHorizontal: scaledHorizontal(25) }}>
        <Text
          textAlign="center"
          color={colors.accent}
          size={16}
          type="bold"
          variant="CenturyGothicBold"
        >
          {t("surat_pernyataan_pelatihan")}
          <Text size={16} color={colors.red}>
            *
          </Text>
        </Text>
        {Info.map((item, index) => {
          return (
            <SectionInfo
              subtitle={item.subtitle}
              index={index}
              key={index}
              dataLength={Info.length}
              withBullet={item.withBullet}
              textAlign="center"
            />
          );
        })}
        <Space height={32} />
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
              {detailPrice?.file_training?.filename}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              if (detailPrice?.file_training?.url) {
                Linking.openURL(detailPrice?.file_training?.url);
              }
            }}
          >
            <Image style={styles.docDownloadIcon} source={icons.download} />
          </TouchableOpacity>
        </View>

        <Space height={12} />
        <Button
          isLoading={isLoading}
          disabled={isLoading}
          withBorder={!isLoading}
          numberOfLines={1}
          onPress={handlePickDocument}
          title={!file?.url ? t("upload_surat_pernyataan") : file?.filename}
          style={{ paddingVertical: scaledVertical(25), alignItems: "center" }}
          textStyle={{ fontFamily: fonts.CenturyGothicBold, fontSize: 12 }}
          icon={!file?.url ? icons.upload : null}
          iconStyle={{
            height: 18,
            width: 18,
            resizeMode: "contain",
            marginRight: 10,
          }}
          innerStyle={{ alignItems: "center" }}
        />
      </Card>
      <Space height={12} />

      <TouchableOpacity
        onPress={() => setIsAgree(!isAgree)}
        style={{
          flexDirection: "row",
          gap: 10,
          marginHorizontal: scaledHorizontal(25),
        }}
      >
        <Image
          source={isAgree ? icons.checklistBox : icons.box}
          style={styles.imageCheckbox}
        />
        <Text
          style={{ paddingRight: 16, flex: 1 }}
          size={12}
          variant="CenturyGothicRegular"
        >
          {t("agreement_download_contract")}
        </Text>
      </TouchableOpacity>
      <Space height={15} />

      <Button
        onPress={onSignPress}
        title={t("lanjutkan")}
        disabled={!isAgree || file?.id === undefined}
        style={{
          paddingVertical: scaledVertical(25),
          marginHorizontal: scaledHorizontal(25),
        }}
        textStyle={{ fontFamily: fonts.CenturyGothicBold, fontSize: 12 }}
        withBorder={isAgree && file?.id !== undefined}
      />
    </View>
  );
};

export default SignContract;
