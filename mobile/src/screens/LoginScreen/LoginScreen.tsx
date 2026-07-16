/* eslint-disable max-len */
import React, { useCallback, useState } from "react";
import {
  View,
  Image,
  Platform,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import Space from "components/Space";
import Button from "components/Button";
import TextInput from "components/TextInput";
import Text from "components/Text";
import images from "configs/images";
import fonts from "configs/fonts";
import colors from "configs/colors";
import NavigationService from "utils/NavigationService";
import {
  scaledFontSize,
  scaledHorizontal,
  scaledVertical,
} from "utils/ScaledService";
import globalStyles from "utils/GlobalStyles";
import icons from "configs/icons";
import { AccessToken, LoginManager } from "react-native-fbsdk-next";
import { useDispatch } from "react-redux";
import { CommonActions, useNavigation } from "@react-navigation/core";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import type { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { getAuth, getIdToken, GoogleAuthProvider, FacebookAuthProvider, AppleAuthProvider, signInWithCredential } from "@react-native-firebase/auth";
import { onLogin } from "stores/persist/persistSlice";
import { useAuth } from "hooks/useAuth";
import { Controller, useForm } from "react-hook-form";
import { onErrorState } from "stores/error/errorSlice";
import appleAuth from "@invertase/react-native-apple-authentication";
import { WEB_CLIENT_ID } from '@env';
import LoadingModal from "components/LoadingModal/LoadingModal";
import ModalAlert from "components/ModalAlert";
import type { ModalAlertProps } from "types/AppTypes";
import moment from "moment";
import { usePersist } from "hooks/usePersist";
import type { UserType } from "types/UserTypes";
import { apiPostSocialAccount } from "services/AuthServices";

GoogleSignin.configure({
  webClientId: WEB_CLIENT_ID,
});

const LoginScreen = () => {
  const [form, setForm] = useState({} as { email: string; password: string });
  const { postSignin, getMe } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const { wrongAttemptPassword, attemptPassword } = usePersist();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [showModalAlert, setShowModalAlert] = useState({} as ModalAlertProps);
  const authInstance = getAuth();

  const signInGoogle = async () => {
    try {
      await GoogleSignin.signOut();

      await GoogleSignin.signIn();

      const googleTokens = await GoogleSignin.getTokens();
      const credential = GoogleAuthProvider.credential(
        googleTokens.idToken,
        googleTokens.accessToken,
      );

      await signInWithCredential(authInstance, credential)
        .then(({ user }) => {
          setShowModal(true);
          sosmedVerifyToken(user, "google");
        });
    } catch (e: any) {
      let errorMessage = "Google SignIn Error:";
      if (e && e.code) {
        errorMessage += `\n\n[${e.code}]`;
      }
      if (e && e.message) {
        errorMessage += `\n${e.message}`;
      }
      window.console.log(errorMessage);
      Alert.alert(
        "Login gagal",
        errorMessage,
        [
          {text: "OK"},
        ],
      );
      dispatch(
        onErrorState({
          visible: true,
          text: 'Terjadi kesalahan pada sistem, silahkan coba lagi nanti.',
          icon: icons.searchClose,
          withCloseIcon: true,
          withIcon: true,
        }),
      );
    }
  };

  const signInFacebook = async () => {
    try {
      await LoginManager.logInWithPermissions(["public_profile", "email"]);

      const data = await AccessToken.getCurrentAccessToken();

      if (data) {
        const credential = FacebookAuthProvider.credential(
          data?.accessToken,
        );
        await signInWithCredential(authInstance, credential)
          .then(({ user }) => {
            setShowModal(true);
            sosmedVerifyToken(user, "facebook");
          });
      }
    } catch (e: any) {
      let errorMessage = "Facebook SignIn Error:";
      if (e && e.code) {
        errorMessage += `\n\n[${e.code}]`;
      }
      if (e && e.message) {
        errorMessage += `\n${e.message}`;
      }
      window.console.log(errorMessage);
      Alert.alert(
        "Login gagal",
        errorMessage,
        [
          {text: "OK"},
        ],
      );
      dispatch(
        onErrorState({
          visible: true,
          text: 'Terjadi kesalahan pada sistem, silahkan coba lagi nanti.',
          icon: icons.searchClose,
          withCloseIcon: true,
          withIcon: true,
        }),
      );
    }
  };

  const signInApple = async () => {
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
    });

    const { identityToken, nonce, fullName } = appleAuthRequestResponse;
    const tempName = `${fullName?.givenName} ${fullName?.familyName}`;
    // can be null in some scenarios
    if (identityToken) {
      const appleCredential = AppleAuthProvider.credential(
        identityToken,
        nonce,
      );
      await signInWithCredential(authInstance, appleCredential)
        .then(({ user }) => {
          setShowModal(true);
          sosmedVerifyToken(user, "apple", tempName);
        });
    } else {
      // handle this - retry?
    }
  };

  const sosmedVerifyToken = async (
    user: FirebaseAuthTypes.User,
    provider: string,
    tempName?: string,
  ) => {
    let isNewUser = false;
    if (!user) { isNewUser = true; }
    await apiPostSocialAccount(await getIdToken(user, true)).then(({data}) => {
      if (data) {
        dispatch(
          onLogin({
            auth: {
              accessToken: data?.access_token,
              refreshToken: data?.refresh_token,
            },
            user: data?.user,
          }),
        );
        setShowModal(false);
        const firstTimeLoginWithApple =
          data?.user?.apple_id && !data?.user?.active_date;
        if (firstTimeLoginWithApple) {
          Alert.alert(
            "Selamat datang!",
            "Untuk meningkatkan pengalaman Anda, mohon perbarui nama profil Anda terlebih dahulu. \n Nama yang Anda masukkan akan digunakan untuk keperluan identifikasi dan pelayanan yang lebih personal. Data Anda akan disimpan secara aman sesuai dengan kebijakan privasi kami.",
            [
              {
                text: "OK",
                onPress: () => {
                  navigation.dispatch(
                    CommonActions.reset({
                      index: 0,
                      routes: [{ name: "HomeScreen" }],
                    }),
                  );
                },
              },
            ],
          );
        } else {
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: "HomeScreen" }],
            }),
          );
        }
      } else {
        isNewUser = true;
      }
    });
    setShowModal(false);
    if (isNewUser) {
      Alert.alert(
        "Anda belum terdaftar",
        "Mohon isi formulir pendaftaran ini",
        [
          {text: "OK"},
        ],
      );
      const _tempName = tempName || user?.email?.split("@")?.[0];
      NavigationService.navigate("SignupScreen", {
        fullname: user?.displayName || _tempName || "",
        email: user?.email || "",
        step: !provider ? 1 : 2,
        apple_id: provider === "apple" ? user?.uid : "",
        google_id: provider === "google" ? user?.uid : "",
        facebook_id: provider === "facebook" ? user?.uid : "",
        user,
        provider,
      });
    }
  };

  const {
    control,
    formState: { errors, isValid },
  } = useForm({ mode: "onChange" });

  const showingModal = () => {
    setShowModalAlert({
      showModal: true,
      titleBig: "Silahkan tunggu beberapa saat lagi",
      time:
        wrongAttemptPassword.lastTime === 0
          ? new Date(
              moment(new Date())
                .add(
                  wrongAttemptPassword?.loginTry === 0
                    ? 10
                    : wrongAttemptPassword?.loginTry === 1
                    ? 12
                    : wrongAttemptPassword?.loginTry === 2
                    ? 15
                    : wrongAttemptPassword?.loginTry === 3
                    ? 30
                    : 60,

                  "second",
                )
                .toDate(),
            ).getTime()
          : wrongAttemptPassword?.lastTime,
      leftText: "Lupa kata sandi",
      leftFunction: () => {
        setShowModalAlert({ showModal: false, title: "" });
        NavigationService.navigate("ForgotPasswordScreen");
      },
      rightText: "Kembali",
      rightFunction: () => {
        setShowModalAlert({ showModal: false, title: "" });
      },
    });
  };

  const onPressLogin = useCallback(() => {
    if (
      wrongAttemptPassword?.attempt !== 3 ||
      (wrongAttemptPassword?.lastTime !== 0 &&
        wrongAttemptPassword?.loginTry > 1)
    ) {
      setShowModal(true);
      postSignin({
        email: form?.email,
        password: form?.password,
        is_mobile: "1",
      }).then(({ data, status, message }) => {
        if (status !== "success") {
          dispatch(
            onErrorState({
              visible: true,
              text: message || "Something went wrong",
              icon: icons.searchClose,
              withCloseIcon: true,
              withIcon: true,
            }),
          );
          Alert.alert(
            "Login gagal",
            message,
            [
              {text: "OK"},
            ],
          );
          window.console.log('Error: ' + data);
          if (wrongAttemptPassword?.loginTry < 1) {
            attemptPassword(
              wrongAttemptPassword.attempt + 1,
              0,
              wrongAttemptPassword?.loginTry,
            );
          }
          setShowModal(false);
          if (
            wrongAttemptPassword?.attempt === 0 &&
            wrongAttemptPassword?.loginTry > 0
          ) {
            showingModal();
          }
        } else {
          dispatch(
            onLogin({
              auth: {
                accessToken: data?.access_token,
                refreshToken: data?.refresh_token,
              },
              user: {} as UserType,
            }),
          );
          getMe(data?.access_token, {
            accessToken: data?.access_token,
            refreshToken: data?.refresh_token,
          }).then(() => {
            attemptPassword(0, 0, 0);
            setShowModal(false);
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: "HomeScreen" }],
              }),
            );
          });
        }
      });
    } else {
      showingModal();
    }
  }, [wrongAttemptPassword, form]);

  return (
    <KeyboardAvoidingView
      style={[
        globalStyles().container,
        {
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: scaledHorizontal(25),
        },
      ]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Image
        source={images.logoLong2}
        style={{ height: 115, width: "80%", resizeMode: "contain" }}
      />
      <Space height={scaledVertical(60)} />

      <Text size={scaledFontSize(20)}>Email</Text>
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
            message: "Email harus di isi",
          },
          minLength: {
            value: 4,
            message: "Email minimal harus 4 karakter",
          },
          pattern: {
            value: /\S+@\S+\.\S+/,
            message: "Email tidak sesuai",
          },
        }}
      />

      <Space height={scaledVertical(10)} />
      <Text size={scaledFontSize(20)}>Kata Sandi</Text>
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
            message: "Kata sandi minal harus 8 karakter.",
          },
        }}
      />

      <Space height={scaledVertical(10)} />

      <Button
        variant="CenturyGothicBold"
        textType="bold"
        title="Masuk"
        type="light"
        style={{ paddingVertical: 12, minWidth: "100%" }}
        onPress={() => {
          if (isValid) {
            onPressLogin();
          }
        }}
        textStyle={{
          fontSize: scaledFontSize(20),
          lineHeight: 18,
        }}
        disabled={!isValid}
        withBorder={isValid}
      />
      <Space height={20} />

      <Text
        type="bold"
        color={colors.red}
        style={{ textDecorationLine: "underline" }}
        onPress={() => NavigationService.navigate("ForgotPasswordScreen")}
        size={scaledFontSize(20)}
        variant="CenturyGothicBold"
      >
        Lupa Kata Sandi
      </Text>

      <Space height={scaledVertical(40)} />

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
          atau Masuk dengan
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

      <Space height={scaledVertical(10)} />

      <View
        style={{
          flexDirection: "row",
          padding: 10,
        }}
      >
        <Button
          onPress={signInGoogle}
          icon={icons.google}
          withBorder={false}
          style={{ borderRadius: 0, paddingVertical: 5 }}
          iconStyle={{ height: 22, width: 22, resizeMode: "contain" }}
        />
        <Button
          onPress={signInFacebook}
          icon={icons.facebook}
          withBorder={false}
          iconStyle={{ height: 22, width: 22, resizeMode: "contain" }}
          style={{ borderRadius: 0, paddingVertical: 5, marginLeft: 10 }}
        />
        {Platform.OS === "ios" ? (
          <Button
            onPress={signInApple}
            icon={icons.apple}
            iconStyle={{ height: 22, width: 22, resizeMode: "contain" }}
            withBorder={false}
            style={{ borderRadius: 0, marginLeft: 10 }}
          />
        ) : null}
      </View>

      <Space height={scaledVertical(30)} />

      <Text
        type="bold"
        color={colors.red}
        style={{ textDecorationLine: "underline" }}
        size={scaledFontSize(20)}
        variant="CenturyGothicBold"
        onPress={() => NavigationService.navigate("SignupScreen")}
      >
        Buat Akun
      </Text>
      <LoadingModal
        showModal={showModal}
        onCloseModal={() => setShowModal(false)}
      />
      <ModalAlert
        onHide={() => setShowModalAlert({ showModal: false, title: "" })}
        showModal={showModalAlert?.showModal}
        animation={"zoom"}
        title={showModalAlert?.title}
        leftFunction={showModalAlert.leftFunction}
        rightFunction={showModalAlert.rightFunction}
        leftText={showModalAlert.leftText}
        rightText={showModalAlert.rightText}
        //withIcon
        time={showModalAlert?.time}
        withForgotPassword
        titleBig={showModalAlert.titleBig}
      />
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
