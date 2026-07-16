import BottomSheet from "@gorhom/bottom-sheet";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import Button from "components/Button";
import CertificationSheet from "components/CertificationActionSheet";
import Header from "components/Header";
import Space from "components/Space";
import Text from "components/Text";
import TextInput from "components/TextInput";
import colors from "configs/colors";
import fonts from "configs/fonts";
import icons from "configs/icons";
import { useAuth } from "hooks/useAuth";
import { useCertification } from "hooks/useCertification";
import moment from "moment";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  View,
  Platform,
  ScrollView,
  TouchableOpacity,
  Linking,
  Image,
} from "react-native";
import { useDispatch } from "react-redux";
import { CertificationListType } from "types/CertificationTypes";
import { FileType } from "types/ExamTypes";
import { QueryType } from "types/QueryTypes";
import { ErrorStatus } from "utils/ErrorStatus";
import globalStyles from "utils/GlobalStyles";
import {
  scaledFontSize,
  scaledHorizontal,
  scaledVertical,
} from "utils/ScaledService";
import DocumentPicker from "react-native-document-picker";
import { onErrorState } from "stores/error/errorSlice";
import { apiUploadFile } from "services/UserService";
import Card from "components/Card";
import NavigationService from "utils/NavigationService";
import { apiPostCertification } from "services/CertificationServices";
import { useTranslation } from "react-i18next";
import { usePersist } from "hooks/usePersist";

const UploadCertificationScreen = () => {
  const actionSheetRef = useRef<BottomSheet>(null);
  const dispatch = useDispatch();
  const { language } = usePersist();
  const timeout: any = useRef(null);
  const { auth, user } = useAuth();
  const snapPoints = useMemo(() => [450], []);
  const { certificationList, getCertificationList } = useCertification();
  const [queryList, setQueryList] = useState({
    type: "collection",
    options: [["filter,status,equal,1"]],
  } as QueryType);
  const [showDatepicker, setShowDatepicker] = useState(false);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({
    selectedCertification: {} as CertificationListType,
    address: "",
    certificationDate: "",
    document: {} as FileType,
  });
  const { t } = useTranslation();
  const {
    control,
    formState: { errors },
  } = useForm({ mode: "onChange" });
  const [isLoading, setIsLoading] = useState(false);

  const onSearch = (search: string) => {
    clearTimeout(timeout.current);
    timeout.current = setTimeout(() => {
      setQueryList({
        ...queryList,
        options: [["search", "name", search], ["filter,status,equal,1"]],
      });
    }, 1000);
    setSearch(search);
  };

  useEffect(() => {
    getCertificationList(queryList);
  }, [queryList]);

  const handlePickDocument = async () => {
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
      try {
        setIsLoading(true);
        const result: FileType | any = await apiUploadFile(
          auth?.accessToken,
          data,
        );
        if (result?.url) {
          setForm({ ...form, document: result });
        }
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

  const isValid = () => {
    if (
      !errors?.certificationDate &&
      !errors?.address &&
      form?.selectedCertification?.id &&
      form?.document?.id
    ) {
      return true;
    }

    return false;
  };

  const onPressUploadCertification = async () => {
    let body = {
      name: form?.selectedCertification?.name,
      user_id: user?.id,
      certification_id: form?.selectedCertification?.id,
      location: form?.address,
      cert_date: moment(form?.certificationDate).format("YYYY-MM-DD HH:mm"),
      cert_file_id: form?.document?.uuid,
    };

    apiPostCertification(auth?.accessToken, body).then(() => {
      NavigationService.navigate("CertificationSuccessScreen");
    });
  };

  return (
    <View style={globalStyles().topSafeArea}>
      <Space height={Platform.OS === "android" ? 15 : 0} />
      <Header
        withBell
        totalNotification={4}
        textJapan="日本語能力認定書結果のアップロード"
        textTitle="Unggah Hasil Sertifikasi"
        withTextTitle
        withBackButton
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{
          marginHorizontal: scaledHorizontal(25),
        }}
      >
        <View style={{ alignItems: "center" }}>
          <Space height={20} />
          <Text size={scaledFontSize(20)}>
            {t("sertifikasi")}
            <Text color={colors.red600} size={scaledFontSize(20)}>
              *
            </Text>
          </Text>
          <Space height={10} />
          <Button
            onPress={() => actionSheetRef?.current?.snapToPosition(450)}
            title={
              form?.selectedCertification?.id
                ? form?.selectedCertification?.name
                : t("pilih_sertifikasi")
            }
            style={{
              paddingVertical: scaledVertical(20),
              minWidth: "100%",
            }}
            innerStyle={{
              justifyContent: "space-between",
              alignItems: "center",

              flexDirection: "row",
            }}
            textStyle={{
              fontSize: scaledFontSize(20),
              lineHeight: 18,
              textAlign: "center",
              flex: 1,
              marginLeft: scaledHorizontal(30),
              fontFamily: fonts.CenturyGothicBold,
            }}
            iconRight={icons.iosRight}
            iconStyle={{
              width: 18,
              height: 18,
              resizeMode: "contain",
              marginRight: scaledHorizontal(10),
            }}
          />
          <Space height={20} />
          <Text size={scaledFontSize(20)}>
            {t("alamat_sertifikasi")}
            <Text color={colors.red600} size={scaledFontSize(20)}>
              *
            </Text>
          </Text>
          <Space height={5} />
          <Controller
            control={control}
            defaultValue=""
            render={({ field: { onChange, value } }) => (
              <TextInput
                value={value}
                onChange={text => {
                  onChange(text);
                  setForm({ ...form, address: text });
                }}
                type="textarea"
                textAreaHeight={80}
                error={errors.address && errors?.address?.message}
                borderLess={false}
                placeholder={t("isi_alamat_kamu")}
                textStyle={{
                  fontFamily: fonts.CenturyGothicBold,
                  textAlignVertical: "top",
                }}
                withError={true}
              />
            )}
            name="address"
            rules={{
              required: {
                value: true,
                message: t("alamat_harus_diisi"),
              },
              minLength: {
                value: 10,
                message: t("alamat_minimal_10_karakter"),
              },
            }}
          />

          <Text size={scaledFontSize(20)}>
            {t("tanggal_sertifikasi")}
            <Text color={colors.red600} size={scaledFontSize(20)}>
              *
            </Text>
          </Text>
          <Space height={5} />
          {showDatepicker && (
            <Controller
              control={control}
              defaultValue={
                form?.certificationDate !== ""
                  ? new Date(form?.certificationDate)
                  : new Date()
              }
              render={({ field: { onChange, value } }) => (
                <RNDateTimePicker
                  //maximumDate={moment(new Date()).subtract(8, "year").toDate()}
                  //minimumDate={moment(new Date()).subtract(40, "year").toDate()}
                  value={new Date(value)}
                  mode="date"
                  onChange={(_, selectedDate) => {
                    setShowDatepicker(false);
                    onChange(selectedDate?.toDateString());
                    setForm({
                      ...form,
                      certificationDate: selectedDate?.toDateString() || "",
                    });
                  }}
                />
              )}
              name="certificationDate"
              rules={{
                required: {
                  value: true,
                  message: t("tanggal_sertifikasi_harus_diisi"),
                },
              }}
            />
          )}

          <Space height={scaledVertical(5)} />
          <Button
            onPress={() => setShowDatepicker(true)}
            title={
              form.certificationDate
                ? moment(form.certificationDate).format("DD/MM/YYYY")
                : "DD/MM/YYYY"
            }
            withBorder={false}
            style={{
              paddingVertical: scaledVertical(30),
              minWidth: "100%",
            }}
            innerStyle={{
              justifyContent: "space-between",
              alignItems: "center",

              flexDirection: "row",
            }}
            textStyle={{
              fontSize: scaledFontSize(20),
              lineHeight: 18,
              textAlign: "center",
              flex: 1,
              marginLeft: scaledHorizontal(30),
              fontFamily: fonts.CenturyGothicBold,
            }}
            iconRight={icons.calendar}
            iconStyle={{
              width: 18,
              height: 18,
              resizeMode: "contain",
              marginRight: scaledHorizontal(10),
            }}
          />

          {form.certificationDate === undefined ? (
            <Text
              style={{
                marginTop: 4,
                alignSelf: "flex-end",
                marginBottom: scaledVertical(10),
                fontSize: 12,
                color: colors.red600,
              }}
            >
              Tanggal lahir harus diisi.
            </Text>
          ) : (
            <Text
              style={{
                alignSelf: "flex-end",
                marginTop: 4,
                fontSize: 12,
                color: colors.red600,
                marginBottom: scaledVertical(10),
              }}
            >
              {""}
            </Text>
          )}
        </View>
        <Text size={scaledFontSize(20)} textAlign="center">
          {t("hasil_sertifikasi")}
          <Text color={colors.red600} size={scaledFontSize(20)}>
            *
          </Text>
        </Text>

        {form?.document?.url && (
          <View
            style={{
              padding: 12,
              borderRadius: 12,
              backgroundColor: colors.stone50,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: scaledVertical(10),
            }}
          >
            <View
              style={{
                flexDirection: "row",
                gap: 8,
                alignItems: "center",
                flex: 1,
              }}
            >
              <Image
                style={{ width: 24, height: 24, resizeMode: "contain" }}
                source={icons.document}
              />
              <Text
                size={12}
                numberOfLines={1}
                style={{ paddingRight: 20 }}
                type="bold"
                variant="CenturyGothicBold"
              >
                {form?.document?.filename}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                Linking.openURL(form?.document?.url);
              }}
            >
              <Image
                style={{ width: 16, height: 16, marginLeft: 20 }}
                source={icons.download}
              />
            </TouchableOpacity>
          </View>
        )}

        <Space height={10} />
        <Button
          isLoading={isLoading}
          disabled={isLoading}
          withBorder={!isLoading}
          numberOfLines={1}
          onPress={handlePickDocument}
          title={
            !form?.document?.url
              ? t("upload_hasil_sertifikasi")
              : form?.document?.filename
          }
          style={{ paddingVertical: scaledVertical(25), alignItems: "center" }}
          textStyle={{ fontFamily: fonts.CenturyGothicBold, fontSize: 12 }}
          icon={!form?.document?.url ? icons.upload : null}
          iconStyle={{
            height: 18,
            width: 18,
            resizeMode: "contain",
            marginRight: 10,
          }}
          innerStyle={{ alignItems: "center" }}
        />
        <Space height={4} />
        {language === "id" && (
          <Text textAlign="center" size={12}>
            (Format{" "}
            <Text size={12} variant="CenturyGothicBold" type="bold">
              PDF
            </Text>{" "}
            maksimum 5 MB)
          </Text>
        )}

        {language === "ja" && (
          <Text textAlign="center" size={12}>
            (
            <Text size={12} variant="CenturyGothicBold" type="bold">
              PDF{" "}
              <Text textAlign="center" size={12}>
                形式最大5MB
              </Text>
            </Text>{" "}
            )
          </Text>
        )}

        <Space height={25} />

        <Text
          type="bold"
          color={colors.red}
          size={scaledFontSize(20)}
          variant="CenturyGothicBold"
          textAlign="center"
        >
          (*) {t("wajib_diisi")}
        </Text>
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
          onPress={onPressUploadCertification}
          disabled={!isValid()}
          variant="CenturyGothicBold"
          textType="bold"
          title={t("unggah_hasil")}
          type="light"
          style={{ paddingVertical: 12, minWidth: "100%" }}
          textStyle={{
            fontSize: scaledFontSize(20),
            lineHeight: 18,
          }}
          withBorder={isValid()}
        />
      </Card>

      <CertificationSheet
        actionSheetRef={actionSheetRef}
        snapPoints={snapPoints}
        data={certificationList}
        selectedCertification={form?.selectedCertification}
        setSelectedCertification={certification =>
          setForm({ ...form, selectedCertification: certification })
        }
        search={search}
        setSearch={onSearch}
      />
    </View>
  );
};

export default UploadCertificationScreen;
