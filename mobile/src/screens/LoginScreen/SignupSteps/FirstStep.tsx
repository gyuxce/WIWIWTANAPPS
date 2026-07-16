import React from "react";
import { Platform, ScrollView, View } from "react-native";
import Space from "components/Space";
import Button from "components/Button";
import TextInput from "components/TextInput";
import Text from "components/Text";
// import images from "configs/images";
import NavigationService from "utils/NavigationService";
import colors from "configs/colors";
import fonts from "configs/fonts";
import {
  scaledFontSize,
  scaledHorizontal,
  scaledVertical,
} from "utils/ScaledService";
import icons from "configs/icons";
import type { UserSignupTypes } from "types/UserTypes";
import type {
  Control,
  FieldErrors,
  FieldValues,
  UseFormWatch,
} from "react-hook-form";
import { Controller } from "react-hook-form";

interface Props {
  onPress?: () => void;
  onPressGoogleLogin: () => void;
  onPressFacebookLogin: () => void;
  onPressAppleLogin: () => void;
  form: UserSignupTypes;
  setForm: any;
  control: Control<FieldValues>;
  errors: FieldErrors<FieldValues>;
  watch: UseFormWatch<FieldValues>;
  setError: any;
  clearErrors: any;
}
const FirstStep = ({
  onPress,
  onPressGoogleLogin,
  onPressFacebookLogin,
  onPressAppleLogin,
  form,
  setForm,
  control,
  errors,
  watch,
  setError,
  clearErrors,
}: Props) => {
  const checkValid = () => {
    if (
      form?.email === "" ||
      form?.password === "" ||
      form?.confirmPassword === ""
    ) {
      return false;
    }
    if (errors?.email || errors?.password || errors?.confirmPassword) {
      return false;
    }

    return true;
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: scaledHorizontal(25),
      }}
    >
      <Text size={scaledFontSize(20)}>
        Email
        <Text color={colors.red600} size={scaledFontSize(20)}>
          *
        </Text>
      </Text>
      <Space height={5} />

      <Controller
        control={control}
        defaultValue={form?.email}
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

      <Space height={scaledVertical(10)} />
      <Text size={scaledFontSize(20)}>
        Kata Sandi
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
            message: "Kata sandi minimal harus 8 karakter.",
          },
          pattern: {
            value: /^\S+$/,
            message: "Kata sandi tidak boleh mengandung spasi",
          },
          //@ts-ignore
          validate: (val: string) => {
            if (watch("confirmPassword") !== val) {
              setError("confirmPassword", {
                message: "Kata sandi kamu tidak sesuai.",
              });
              return;
            } else {
              clearErrors("confirmPassword");
              return;
            }
          },
        }}
      />

      <Space height={scaledVertical(10)} />
      <Text size={scaledFontSize(20)}>
        Konfirmasi Kata Sandi
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
              setForm({ ...form, confirmPassword: text });
            }}
            error={errors?.confirmPassword && errors?.confirmPassword?.message}
            borderLess={false}
            placeholder="Ulangi kata sandi kamu..."
            textStyle={{ fontFamily: fonts.CenturyGothicBold }}
            secureTextEntry={true}
          />
        )}
        name="confirmPassword"
        rules={{
          required: {
            value: true,
            message: "Konfirmasi kata sandi harus diisi.",
          },
          minLength: {
            value: 8,
            message: "Konfirmasi kata sandi minimal harus 8 karakter.",
          },
          validate: (val: string) => {
            if (watch("password") !== val) {
              return "Kata sandi kamu tidak sesuai.";
            }
            return;
          },
        }}
      />

      <Space height={scaledVertical(10)} />

      <Button
        disabled={!checkValid()}
        variant="CenturyGothicBold"
        textType="bold"
        title="Lanjutkan"
        type="light"
        withBorder={checkValid()}
        style={{ paddingVertical: 12, minWidth: "100%" }}
        onPress={() => {
          if (checkValid()) {
            onPress && onPress();
          }
        }}
        textStyle={{
          fontSize: scaledFontSize(20),
          lineHeight: 18,
        }}
      />

      <Space height={scaledVertical(60)} />

      <View style={{ flexDirection: "row" }}>
        <View
          style={{
            backgroundColor: "black",
            height: 2,
            flex: 1,
            alignSelf: "center",
          }}
        />
        <Text
          style={{
            alignSelf: "center",
            paddingHorizontal: 5,
            fontSize: scaledFontSize(20),
          }}
        >
          atau Daftar dengan
        </Text>
        <View
          style={{
            backgroundColor: "black",
            height: 2,
            flex: 1,
            alignSelf: "center",
          }}
        />
      </View>

      <Space height={scaledVertical(20)} />

      <View
        style={{
          flexDirection: "row",
          padding: 10,
        }}
      >
        <Button
          onPress={onPressGoogleLogin}
          icon={icons.google}
          withBorder={false}
          iconStyle={{ height: 24, width: 24, resizeMode: "contain" }}
          style={{ borderRadius: 0, paddingVertical: 5 }}
        />
        <Button
          onPress={onPressFacebookLogin}
          icon={icons.facebook}
          iconStyle={{ height: 24, width: 24, resizeMode: "contain" }}
          withBorder={false}
          style={{ borderRadius: 0, paddingVertical: 5, marginLeft: 10 }}
        />
        {Platform.OS === "ios" ? (
          <Button
            onPress={onPressAppleLogin}
            icon={icons.apple}
            iconStyle={{ height: 22, width: 22, resizeMode: "contain" }}
            withBorder={false}
            style={{ borderRadius: 0, marginLeft: 10 }}
          />
        ) : null}
      </View>

      <Space height={scaledVertical(20)} />

      <Text size={scaledFontSize(20)}>
        Sudah punya akun? Masuk
        <Text
          size={scaledFontSize(20)}
          type="bold"
          color={colors.red}
          onPress={() => NavigationService.navigate("LoginScreen")}
        >
          {" "}
          di sini
        </Text>
      </Text>

      <Space height={scaledVertical(40)} />
      <Text size={scaledFontSize(20)} textAlign="center">
        Dengan mendaftar, Anda menyetujui{" "}
        <Text
          size={scaledFontSize(20)}
          type="bold"
          variant="CenturyGothicBold"
          style={{ textDecorationLine: "underline" }}
        >
          Ketentuan Layanan
        </Text>{" "}
        dan{" "}
        <Text
          size={scaledFontSize(20)}
          type="bold"
          variant="CenturyGothicBold"
          style={{ textDecorationLine: "underline" }}
        >
          Kebijakan Privasi
        </Text>{" "}
        kami.{" "}
      </Text>
    </ScrollView>
  );
};

export default FirstStep;
