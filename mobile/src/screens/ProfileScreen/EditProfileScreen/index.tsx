import type { Image } from "react-native-image-crop-picker";
import ImageCropPicker from "react-native-image-crop-picker";
import { Platform, ScrollView, TouchableOpacity, View } from "react-native";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Button from "components/Button";
import Header from "components/Header";
import globalStyles from "utils/GlobalStyles";
import Avatar from "components/Avatar";
import images from "configs/images";
import Text from "components/Text";
import Space from "components/Space";
import TextInput from "components/TextInput";
import fonts from "configs/fonts";
import icons from "configs/icons";
import { useAuth } from "hooks/useAuth";
import { Controller, useForm } from "react-hook-form";
import DomicileActionSheet from "components/DomicileActionSheet";
import type BottomSheet from "@gorhom/bottom-sheet";
import type { QueryType } from "types/QueryTypes";
import { useUser } from "hooks/useUser";
import type { CityType } from "types/UserTypes";
import colors from "configs/colors";
import { apiUpdateProfile, apiUploadImage } from "services/UserService";
import { useDispatch } from "react-redux";
import { onErrorState } from "stores/error/errorSlice";
import NavigationService from "utils/NavigationService";
import { useTranslation } from "react-i18next";

import styles from "./styles";

const EditProfileScreen = () => {
  const timeout: any = useRef(null);
  const actionSheetRef = useRef<BottomSheet>(null);
  const dispatch = useDispatch();
  const { auth, getMe } = useAuth();
  const [submitLoading, setSubmitLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const snapPoints = useMemo(() => [480], []);
  const { user } = useAuth();
  const initialized = useRef(false);
  const { getCityData, cityData } = useUser();
  const [queryCityState, setQueryCityState] = useState({
    type: "collection",
    options: [],
  } as QueryType);
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({
    name: user?.name,
    nameKatakana: user?.name_alias,
    email: user?.email,
    phone: user?.phone,
    domicile: {
      id: user?.city?.id,
      name: user?.city?.name,
      code: user?.city?.code,
    } as CityType,
    address: user?.address,
    generateName: "-",
    profilePicture: user?.profilePicture as any,
    // imageLocalPath: {} as Image,
    // imageServerId: "",
  });

  const createFormData = (photo: Image) => {
    const data: any = new FormData();

    data.append("file", {
      name:
        Platform?.OS === "ios" ? photo?.filename : photo.path.split("/").pop(),
      mime: photo?.mime,
      type: photo?.mime,
      uri:
        Platform.OS === "ios"
          ? photo?.path?.replace("file://", "")
          : photo?.path,
      path:
        Platform.OS === "ios"
          ? photo?.path?.replace("file://", "")
          : photo?.path,
    });

    return data;
  };

  const handleImagePicker = () => {
    ImageCropPicker.openPicker({
      cropping: true,
      mediaType: "photo",
      maxFiles: 1,
    })
      .then(image => {
        setUploadLoading(true);

        apiUploadImage(auth?.accessToken, createFormData(image), dispatch).then(
          res => {
            setForm({ ...form, profilePicture: res });
            setUploadLoading(false);
          },
        );
      })
      .catch(error => {
        window.console.log(error);
      });
  };

  const onSubmit = async () => {
    setSubmitLoading(true);
    apiUpdateProfile(
      auth?.accessToken,
      form?.name,
      form?.nameKatakana,
      form?.email,
      form?.phone,
      form?.domicile?.id,
      form?.address,
      form?.profilePicture?.uuid,
      user?.join_reason,
    ).then(({ success }) => {
      if (success) {
        getMe(auth?.accessToken, auth).then(({ status }) => {
          if (status) {
            dispatch(
              onErrorState({
                visible: true,
                text: t("profil_berhasil_diupdate"),
                icon: icons.searchSuccess,
                withCloseIcon: true,
                withIcon: true,
              }),
            );
            setSubmitLoading(false);
          }
        });
      } else {
        dispatch(
          onErrorState({
            visible: true,
            text: t("profil_gagal_diupdate"),
            icon: icons.searchClose,
            withCloseIcon: true,
            withIcon: true,
          }),
        );
      }
    });
  };
  const onSearch = (search: string) => {
    clearTimeout(timeout.current);
    timeout.current = setTimeout(() => {
      setQueryCityState({
        ...queryCityState,
        options: [["search", "name", search]],
      });
    }, 1000);
    setSearch(search);
  };

  useEffect(() => {
    getCityData(queryCityState);
  }, [queryCityState]);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
    }
  }, []);

  const {
    control,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  const saveCity = (val: CityType) => {
    const data = { ...form, domicile: val };
    setForm(data);
  };

  return (
    <View style={globalStyles().topSafeArea}>
      <Header
        withTextTitle
        textJapan="個人情報を編集します"
        textTitle="Edit Profil"
        withBackButton
        withBell
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Avatar
            image={
              form?.profilePicture
                ? { uri: form?.profilePicture.url }
                : images.userDefault
            }
            borderRadius={148 / 2}
            size={148}
            style={{ padding: 0, borderWidth: 1 }}
          />
          <Button
            isLoading={uploadLoading}
            title={t("ubah_foto")}
            style={styles.btn}
            textType="bold"
            variant="CenturyGothicBold"
            textStyle={{ fontWeight: "600", fontSize: 10 }}
            withBorder={false}
            onPress={handleImagePicker}
          />
          <Space height={20} />
          <Text size={12}>{t("nama_lengkap")}</Text>
          <Space height={4} />
          <Controller
            control={control}
            defaultValue={form?.name}
            render={({ field: { onChange, value } }) => (
              <TextInput
                value={value}
                onChange={text => {
                  onChange(text);
                  setForm({ ...form, name: text });
                }}
                borderLess={false}
                placeholder={t("isi_nama_kamu")}
                textStyle={{ fontFamily: fonts.CenturyGothicBold }}
                stylesBox={{ height: 40 }}
                error={errors.name && errors?.name?.message}
              />
            )}
            name="name"
            rules={{
              required: {
                value: true,
                message: t("nama_lengkap_harus_diisi"),
              },
              minLength: {
                value: 5,
                message: t("nama_lengkap_minimal_karakter"),
              },
            }}
          />

          <Text size={12}>{t("nama_katakana")}</Text>
          <Space height={4} />
          <View
            style={{
              flexDirection: "row",
              marginBottom: 4,
            }}
          >
            <Controller
              control={control}
              defaultValue={form?.nameKatakana}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  value={value}
                  onChange={text => {
                    onChange(text);
                    setForm({ ...form, nameKatakana: text });
                  }}
                  borderLess={false}
                  placeholder={t("isi_nama_katakana")}
                  textStyle={{
                    fontFamily: fonts.CenturyGothicRegular,
                    textAlign: "center",
                    fontWeight: "900",
                  }}
                  stylesBox={{ height: 40 }}
                  //stylesBox={{ flex: 1, marginRight: -8, height: 40 }}
                  error={errors.katakana && errors?.katakana?.message}
                />
              )}
              name="katakana"
            />
          </View>
          <Space height={10} />
          <Text size={12}>{t("email")}</Text>
          <Space height={4} />
          <TextInput
            editable={false}
            value={form.email}
            onChange={text => setForm({ ...form, email: text })}
            borderLess={false}
            placeholder={t("isi_email_kamu")}
            textStyle={{ fontFamily: fonts.CenturyGothicBold }}
            stylesBox={{ height: 40 }}
          />
          <Text size={12}>{t("nomor_telepon")}</Text>
          <Space height={4} />
          <Controller
            control={control}
            defaultValue={form?.phone}
            render={({ field: { onChange, value } }) => (
              <TextInput
                value={value}
                onChange={text => {
                  if (text === "") {
                    setForm({
                      ...form,
                      phone: "",
                    });
                    onChange("");
                  } else if (/^([0-9]{1,100})+$/.test(text)) {
                    setForm({
                      ...form,
                      phone: text,
                    });
                    onChange(text);
                  }
                }}
                error={errors.phone && errors?.phone?.message}
                borderLess={false}
                textStyle={{ fontFamily: fonts.CenturyGothicBold }}
                placeholder={t("isi_nomor_hp_kamu")}
                keyboardType="numeric"
                stylesBox={{ height: 40 }}
              />
            )}
            name="phone"
            rules={{
              required: {
                value: true,
                message: t("nomor_telfon_harus_diisi"),
              },
              minLength: {
                value: 10,
                message: t("nomor_telfon_minimal_karakter"),
              },
            }}
          />
          <Text size={12}>{t("domisili")}</Text>
          <Space height={4} />
          <TouchableOpacity
            onPress={() => {
              actionSheetRef?.current?.snapToPosition(480);
            }}
            style={{
              backgroundColor: "white",
              width: "100%",
              height: 40,
              justifyContent: "center",
              borderRadius: 8,
            }}
          >
            <Text
              style={{ fontWeight: "900", fontFamily: fonts.CenturyGothicBold }}
              size={12}
              textAlign="center"
              color={form?.domicile.name ? colors.black : colors.stone400}
            >
              {form?.domicile.name || t("pilih_domisili_kamu")}
            </Text>
          </TouchableOpacity>
          <Space height={25} />

          <Text size={12}>{t("alamat_lengkap")}</Text>
          <Space height={4} />
          <Controller
            control={control}
            defaultValue={form?.address}
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
          <Space height={20} />
          <Button
            onPress={() => {
              onSubmit();
            }}
            isLoading={submitLoading}
            title={t("simpan")}
            style={[styles.btnUpload, { width: 221, marginBottom: 10 }]}
            textType="bold"
            variant="CenturyGothicBold"
            textStyle={{ fontWeight: "600", fontSize: 12, alignSelf: "center" }}
          />
          <TouchableOpacity
            onPress={() => {
              NavigationService.back();
            }}
          >
            <Text size={10} type="bold" variant="CenturyGothicBold">
              {t("batalkan")}
            </Text>
          </TouchableOpacity>
        </View>
        <Space height={60} />
      </ScrollView>

      <DomicileActionSheet
        actionSheetRef={actionSheetRef}
        snapPoints={snapPoints}
        data={cityData}
        selectedCity={form?.domicile}
        setSelectedCity={saveCity}
        search={search}
        setSearch={onSearch}
      />
    </View>
  );
};

export default EditProfileScreen;
