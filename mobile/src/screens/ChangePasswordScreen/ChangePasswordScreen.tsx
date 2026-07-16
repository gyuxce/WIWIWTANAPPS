import Button from "components/Button";
import Space from "components/Space";
import Text from "components/Text";
import TextInput from "components/TextInput";
import fonts from "configs/fonts";
import images from "configs/images";
import { useAuth } from "hooks/useAuth";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { View, Image, ScrollView, KeyboardAvoidingView } from "react-native";
import { useDispatch } from "react-redux";
import { apiChangePassword } from "services/AuthServices";
import globalStyles from "utils/GlobalStyles";
import NavigationService from "utils/NavigationService";
import {
  scaledFontSize,
  scaledHorizontal,
  scaledVertical,
} from "utils/ScaledService";

const ChangePasswordScreen = () => {
  const { auth } = useAuth();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [form, setForm] = useState({
    old_password: "",
    password: "",
    password_confirmation: "",
  });

  const {
    control,
    formState: { errors, isValid },
    setError,
    clearErrors,
    watch,
  } = useForm({ mode: "onChange" });

  const onPressChangePassword = async () => {
    apiChangePassword(
      auth.accessToken,
      {
        old_password: form?.old_password,
        password: form?.password,
        password_confirmation: form?.password_confirmation,
      },
      dispatch,
    ).then(({ ok }) => {
      if (ok) {
        NavigationService.navigate("ChangePasswordSuccessScreen");
      }
    });
  };
  return (
    <View
      style={[
        globalStyles().container,
        {
          paddingHorizontal: scaledHorizontal(25),
        },
      ]}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={"height"}
        contentContainerStyle={{ height: "100%" }}
      >
        <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
          <Space height={110} />

          <Image
            source={images.logoLong2}
            style={{
              height: 115,
              width: "80%",
              resizeMode: "contain",
              alignSelf: "center",
            }}
          />
          <Space height={scaledVertical(40)} />
          <Text size={scaledFontSize(20)} textAlign="center">
            {t("kata_sandi_lama")}
          </Text>
          <Space height={scaledVertical(5)} />
          <Controller
            control={control}
            defaultValue=""
            render={({ field: { onChange, value } }) => (
              <TextInput
                value={value}
                onChange={text => {
                  onChange(text);
                  setForm({ ...form, old_password: text });
                }}
                error={errors.old_password && errors?.old_password?.message}
                borderLess={false}
                placeholder={t("isi_dengan_kata_sandi_lama")}
                textStyle={{ fontFamily: fonts.CenturyGothicBold }}
                secureTextEntry={true}
              />
            )}
            name="old_password"
            rules={{
              required: {
                value: true,
                message: t("kata_sandi_lama_harus_diisi"),
              },
              minLength: {
                value: 8,
                message: t("kata_sandi_lama_minimal_karakter"),
              },
            }}
          />

          <Text size={scaledFontSize(20)} textAlign="center">
            {t("kata_sandi_baru")}
          </Text>
          <Space height={scaledVertical(5)} />
          <Controller
            control={control}
            defaultValue=""
            render={({ field: { onChange, value } }) => (
              <TextInput
                value={value}
                onChange={text => {
                  onChange(text);
                  setForm({ ...form, password: text });
                }}
                error={errors.password && errors?.password?.message}
                borderLess={false}
                placeholder={t("isi_dengan_kata_sandi_baru")}
                textStyle={{ fontFamily: fonts.CenturyGothicBold }}
                secureTextEntry={true}
              />
            )}
            name="password"
            rules={{
              required: {
                value: true,
                message: t("kata_sandi_baru_harus_diisi"),
              },
              minLength: {
                value: 8,
                message: t("kata_sandi_baru_minimal_karakter"),
              },
              //@ts-ignore
              validate: (val: string) => {
                if (watch("password_confirmation") !== val) {
                  setError("password_confirmation", {
                    message: t("kata_sandi_tidak_sesuai"),
                  });
                  return;
                } else {
                  clearErrors("password_confirmation");
                  return;
                }
              },
            }}
          />

          <Text size={scaledFontSize(20)} textAlign="center">
            {t("ulangi_kata_sandi_baru")}
          </Text>
          <Space height={scaledVertical(5)} />
          <Controller
            control={control}
            defaultValue=""
            render={({ field: { onChange, value } }) => (
              <TextInput
                value={value}
                onChange={text => {
                  onChange(text);
                  setForm({ ...form, password_confirmation: text });
                }}
                error={
                  errors.password_confirmation &&
                  errors?.password_confirmation?.message
                }
                borderLess={false}
                placeholder={t("isi_ulang_dengan_kata_sandi_baru")}
                textStyle={{ fontFamily: fonts.CenturyGothicBold }}
                secureTextEntry={true}
              />
            )}
            name="password_confirmation"
            rules={{
              required: {
                value: true,
                message: t("konfirmasi_kata_sandi_harus_diisi"),
              },
              minLength: {
                value: 8,
                message: t("konfirmasi_kata_sandi_minimal_karakter"),
              },
              validate: (val: string) => {
                if (watch("password") !== val) {
                  return t("konfirmasi_kata_sandi_tidak_sesuai");
                }
                return;
              },
            }}
          />
          <Button
            variant="CenturyGothicBold"
            textType="bold"
            title={t("lanjutkan")}
            type="light"
            style={{ paddingVertical: 12, width: "100%" }}
            textStyle={{
              fontSize: scaledFontSize(20),
              lineHeight: 18,
            }}
            disabled={!isValid}
            withBorder={isValid}
            onPress={onPressChangePassword}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default ChangePasswordScreen;
