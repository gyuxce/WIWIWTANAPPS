import React, { useState } from "react";
import { View, Image } from "react-native";
import globalStyles from "utils/GlobalStyles";
import Text from "components/Text";
import images from "configs/images";
import Space from "components/Space";
import {
  scaledFontSize,
  scaledVertical,
  scaledHorizontal,
} from "utils/ScaledService";
import colors from "configs/colors";
import TextInput from "components/TextInput";
import fonts from "configs/fonts";
import Button from "components/Button";
import { Controller, useForm } from "react-hook-form";
import { useAuth } from "hooks/useAuth";
import NavigationService from "utils/NavigationService";
import { useDispatch } from "react-redux";
import { onErrorState } from "stores/error/errorSlice";
import icons from "configs/icons";

const ForgotPasswordScreen = () => {
  const { postForgotPassword } = useAuth();
  const [form, setForm] = useState({ email: "" } as { email: string });
  const {
    control,
    formState: { errors, isValid },
  } = useForm({ mode: "onChange" });
  const dispatch = useDispatch();

  const onPressForgotPassword = () => {
    postForgotPassword(form?.email).then(({ status }) => {
      if (status === "success") {
        NavigationService.replace("VerifyChangePasswordScreen", {
          email: form?.email,
        });
      } else {
        dispatch(
          onErrorState({
            visible: true,
            text: "Email tidak ditemukan",
            icon: icons.searchClose,
            withCloseIcon: true,
            withIcon: true,
          }),
        );
      }
    });
  };

  return (
    <View
      style={[
        globalStyles().container,
        {
          justifyContent: "center",
          alignItems: "center",
          marginHorizontal: scaledHorizontal(25),
        },
      ]}
    >
      <Image
        source={images.logoLong2}
        style={{ height: 115, width: "80%", resizeMode: "cover" }}
      />
      <Space height={44} />
      <Text size={12} color={colors.black} style={{ paddingHorizontal: 20 }}>
        Masukkan email kamu untuk mendapatkan tautan untuk me-reset password
        kamu.
      </Text>
      <Space height={20} />
      <Text size={scaledFontSize(20)} color={colors.black}>
        Email
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
              setForm({ ...form, email: text });
            }}
            error={errors.email && errors?.email?.message}
            keyboardType="email-address"
            borderLess={false}
            placeholder="Isi email kamu..."
            textStyle={{ fontFamily: fonts.CenturyGothicBold }}
          />
        )}
        name="email"
        rules={{
          required: {
            value: true,
            message: "Email harus diisi.",
          },
          minLength: {
            value: 4,
            message: "Email  minimal harus 4 karakter.",
          },
          pattern: {
            value: /\S+@\S+\.\S+/,
            message: "Email tidak sesuai.",
          },
        }}
      />

      <Space height={scaledVertical(30)} />

      <Button
        variant="CenturyGothicBold"
        textType="bold"
        title="Kirim tautan"
        type="light"
        style={{ paddingVertical: 12, minWidth: "100%" }}
        textStyle={{
          fontSize: scaledFontSize(20),
          lineHeight: 18,
        }}
        onPress={onPressForgotPassword}
        disabled={!isValid}
        withBorder={isValid}
      />
    </View>
  );
};

export default ForgotPasswordScreen;
