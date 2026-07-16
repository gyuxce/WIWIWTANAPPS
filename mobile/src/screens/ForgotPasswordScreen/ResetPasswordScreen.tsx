import React, { useState } from "react";
import { View, Image } from "react-native";
import Space from "components/Space";
import Button from "components/Button";
import TextInput from "components/TextInput";
import Text from "components/Text";
import images from "configs/images";
import fonts from "configs/fonts";
import { scaledFontSize, scaledVertical } from "utils/ScaledService";
import globalStyles from "utils/GlobalStyles";
import NavigationService from "utils/NavigationService";
import { type RouteProp } from "@react-navigation/core";
import type { StackNavigationProp } from "@react-navigation/stack";
import type { RootStackParamList } from "types/NavigatorTypes";
import { Controller, useForm } from "react-hook-form";
import { useAuth } from "hooks/useAuth";
import { onErrorState } from "stores/error/errorSlice";
import icons from "configs/icons";
import { useDispatch } from "react-redux";

type ResetPasswordRouteType = RouteProp<
  RootStackParamList,
  "ResetPasswordScreen"
>;

type ResetPasswordNavigationProp = StackNavigationProp<
  RootStackParamList,
  "ResetPasswordScreen"
>;

type Prop = {
  route: ResetPasswordRouteType;
  navigation: ResetPasswordNavigationProp;
};

const ResetPasswordScreen = ({ route }: Prop) => {
  const { postResetPassword } = useAuth();
  const dispatch = useDispatch();
  const [form, setForm] = useState({ password: "", confirm_password: "" } as {
    password: string;
    confirm_password: string;
  });
  const {
    control,
    formState: { errors, isValid },
    watch,
  } = useForm({ mode: "onChange" });

  const onPressSubmit = () => {
    postResetPassword(
      route?.params?.token,
      form?.password,
      form?.confirm_password,
    ).then(({ status }) => {
      if (status === "success") {
        NavigationService.replace("SuccessResetPasswordScreen");
      } else {
        dispatch(
          onErrorState({
            visible: true,
            text: "Password baru tidak boleh sama dengan password lama",
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
          paddingHorizontal: 16,
        },
      ]}
    >
      <Image
        source={images.logoLong2}
        style={{ height: 115, width: "80%", resizeMode: "cover" }}
      />

      <Space height={scaledVertical(40)} />

      <Text size={scaledFontSize(20)}>Kata Sandi Baru</Text>

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
            placeholder="Isi kata sandi kamu..."
            textStyle={{ fontFamily: fonts.CenturyGothicBold }}
            secureTextEntry={true}
          />
        )}
        name="password"
        rules={{
          required: {
            value: true,
            message: "Kata sandi harus diisi.",
          },
          minLength: {
            value: 8,
            message: "Kata sandi minal harus 8 karakter.",
          },
        }}
      />

      <Space height={scaledVertical(20)} />

      <Text size={scaledFontSize(20)}>Ulangi Kata Sandi Baru</Text>

      <Space height={scaledVertical(5)} />

      <Controller
        control={control}
        defaultValue=""
        render={({ field: { onChange, value } }) => (
          <TextInput
            value={value}
            onChange={text => {
              onChange(text);
              setForm({ ...form, confirm_password: text });
            }}
            error={errors.confirm_password && errors?.confirm_password?.message}
            borderLess={false}
            placeholder="Isi ulang kata sandi kamu..."
            textStyle={{ fontFamily: fonts.CenturyGothicBold }}
            secureTextEntry={true}
          />
        )}
        name="confirm_password"
        rules={{
          required: {
            value: true,
            message: "Konfirmasi kata sandi harus diisi.",
          },
          minLength: {
            value: 8,
            message: "Konfirmasi kata sandi minal harus 8 karakter.",
          },
          validate: (val: string) => {
            if (watch("password") !== val) {
              return "Konfirmasi kata sandi kamu tidak sesuai dengan kata sandi baru";
            }
            return;
          },
        }}
      />

      <Space height={scaledVertical(30)} />

      <Button
        variant="CenturyGothicBold"
        textType="bold"
        title="Lanjutkan"
        type="light"
        style={{ paddingVertical: 12, width: "100%" }}
        textStyle={{
          fontSize: scaledFontSize(20),
          lineHeight: 18,
        }}
        disabled={!isValid}
        withBorder={isValid}
        onPress={onPressSubmit}
      />
    </View>
  );
};

export default ResetPasswordScreen;
