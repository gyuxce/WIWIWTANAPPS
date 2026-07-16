import { Alert, Image, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import globalStyles from "utils/GlobalStyles";
import Header from "components/Header";
import Text from "components/Text";
import Space from "components/Space";
import ConnectButton from "components/ConnectButton";
import icons from "configs/icons";
import Button from "components/Button";

import styles from "./styles";
import { useAuth } from "hooks/useAuth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { WEB_CLIENT_ID } from '@env';
import { getAuth, getIdToken, FirebaseAuthTypes, signInWithCredential, AppleAuthProvider, FacebookAuthProvider, GoogleAuthProvider } from "@react-native-firebase/auth";
import LoadingModal from "components/LoadingModal/LoadingModal";
import { apiPostSocialAccount, apiUserConnect } from "services/AuthServices";
import appleAuth from "@invertase/react-native-apple-authentication";
import { capitalizeFirst, wait } from "utils/Utils";
import { AccessToken, LoginManager } from "react-native-fbsdk-next";
import NavigationService from "utils/NavigationService";
import BaseModal from "components/BaseModal";
import images from "configs/images";
import colors from "configs/colors";
import { ModalAlertProps } from "types/AppTypes";
import ModalAlert from "components/ModalAlert";
import { usePayment } from "hooks/usePayment";
import { Platform } from "react-native";
import { AuthType, UserType } from "types/UserTypes";
import { useDispatch } from "react-redux";
import { resetAllState } from "stores";
import { onLogin } from "stores/persist/persistSlice";
import { inactiveAccount } from "services/UserService";
import { useTranslation } from "react-i18next";

GoogleSignin.configure({
  webClientId: WEB_CLIENT_ID,
});

const PrivasiPolicyScreen = () => {
  const { user, getMe, auth: Auth } = useAuth();
  const [google, setGoogle] = useState(user?.google_id ? true : false);
  const [facebook, setFacebook] = useState(user?.facebook_id ? true : false);
  const [apple, setApple] = useState(user?.apple_id ? true : false);
  const [showModal, setShowModal] = useState(false);
  const [showModalCannotDelete, setShowModalCannotDelete] = useState(false);
  const [showModalAlert, setShowModalAlert] = useState({} as ModalAlertProps);
  const [showModalTimer, setShowModalTimer] = useState(false);
  const [email, setEmail] = useState("");
  const [time, setTime] = useState(10);
  const { paymentStatusType } = usePayment();
  let intervalId: any = null;
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const authInstance = getAuth();

  const onLogout = () => {
    dispatch(onLogin({ auth: {} as AuthType, user: {} as UserType }));
    dispatch(resetAllState());

    NavigationService.navigateResetGuest();
  };

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
    } catch (e) {
      const err = (e as Error).message;
      window.console.log("Error : ", err);
    }
  };

  const signInApple = async () => {
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    });

    const { identityToken, nonce } = appleAuthRequestResponse;

    // can be null in some scenarios
    if (identityToken) {
      const appleCredential = AppleAuthProvider.credential(
        identityToken,
        nonce,
      );

      await signInWithCredential(authInstance, appleCredential)
        .then(({ user }) => {
          setShowModal(true);
          sosmedVerifyToken(user, "apple");
        });
    } else {
      // handle this - retry?
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
    } catch (e) {
      const err = (e as Error).message;
      window.console.log("Error : ", err);
    }
  };

  const sosmedVerifyToken = async (
    user: FirebaseAuthTypes.User,
    provider: string,
  ) => {
    let isNewUser = false;
    if (!user) { isNewUser = true; }
    await apiPostSocialAccount(await getIdToken(user)).then(({ data, exist }) => {
      setShowModal(false);
      if (exist) {
        Alert.alert(
          "Error",
          `Your ${capitalizeFirst(
            provider,
          )} account has already linked to another account.`,
        );
      } else { 
        isNewUser = true;
      }
    });

    if (isNewUser) {
        let body = {
          //adapter: "",
          apple_id: provider === "apple" ? user?.uid : "",
          google_id: provider === "google" ? user?.uid : "",
          facebook_id: provider === "facebook" ? user?.uid : "",
        };
        apiUserConnect(Auth?.accessToken, body).then(() => {
          getMe(Auth.accessToken, Auth).then(() => {
            if (provider === "google") {
              setGoogle(true);
            } else if (provider === "facebook") {
              setFacebook(true);
            } else {
              setApple(true);
            }
          });
        });
      }
  };

  const onDisconnectAccount = async (provider: number) => {
    let body = {
      adapter: provider,
    };
    setShowModal(true);
    apiUserConnect(Auth?.accessToken, body).then(() => {
      getMe(Auth.accessToken, Auth).then(() => {
        Alert.alert(
          "Success",
          `Your ${
            provider === 1 ? "Google" : provider === 2 ? "Facebook" : "Apple"
          } has been unlinked`,
        );
        if (provider === 1) {
          setGoogle(false);
        } else if (provider === 2) {
          setFacebook(false);
        } else {
          setApple(false);
        }
        setShowModal(false);
      });
    });
  };

  const isValid = () => {
    if (email === user?.email) {
      return true;
    }

    return false;
  };

  const onRemoveAccount = () => {
    if (
      user.last_phase === 1 ||
      (user?.last_phase === 2 &&
        paymentStatusType?.is_administration_payment_completed &&
        paymentStatusType?.is_training_payment_completed)
    ) {
      setShowModalAlert({
        titleBig: "Hapus Akun?",
        subtitle:
          "Menghapus akun akan menghapus semua progres kamu. Kamu dapat me-recover akun kamu dengan cara menghubungi admin.",
        showModal: true,
        withIcon: true,
        onChangeTextInput: text => {
          setEmail(text);
        },
        withTextInput: true,
        valueTextInput: email,
        leftFunction: () => {
          setShowModalAlert({ showModal: false });

          wait(500).then(() => {
            setShowModalAlert({
              showModal: true,
              withIcon: true,
              titleBig: "Hapus Akun?",
              subtitle:
                "Semua progres kamu akan terhapus, dana yang telah kamu bayar tidak dapat dikembalikan.",
              leftFunction: () => {
                setShowModalAlert({ showModal: false });
                wait(500).then(() => {
                  runningTime();
                  setShowModalTimer(true);
                });
              },
              withDeletedAccount: true,
              buttonRightDisabled: true,
              leftText: t("hapus_sekarang"),
              rightFunction: () => {
                setShowModalAlert({ showModal: false });
                clearInterval(intervalId);
              },
              rightText: t("cek_kembali_deh"),
            });
          });
        },
        leftText: t("mulai"),
        rightFunction: () => {
          setShowModalAlert({ showModal: false });
        },
        rightText: t("cek_kembali_deh"),
      });
    } else {
      setShowModalCannotDelete(true);
    }
  };

  const runningTime = () => {
    let t = 11;
    if (intervalId === null) {
      intervalId = setInterval(() => {
        if (t === 0) {
          clearInterval(intervalId);
          setTime(0);
          intervalId = null;
          setShowModalTimer(true);
          inactiveAccount(Auth?.accessToken).then(() => {
            onLogout();
          });
        } else {
          t--;
          setTime(t);
        }
      }, 1000);
    }
  };

  return (
    <View style={globalStyles().topSafeArea}>
      <Header
        withTextTitle
        textJapan="プライバシーとセキュリティ"
        textTitle="Privasi & Keamanan"
        withBackButton
        totalNotification={4}
        withBell
      />
      <View style={styles.content}>
        <Text size={12}>{t("email")}</Text>
        <Space height={8} />
        <Text size={12} type="bold" variant="CenturyGothicBold">
          {user?.email}
        </Text>
        <Space height={24} />
        <Text size={12}>{t("koneksi_akun")}</Text>
        <Space height={10} />
        <ConnectButton
          title="Google"
          icon={icons.google}
          textStyle={{ fontWeight: "600", fontSize: 12, alignSelf: "center" }}
          isConnect={google}
          height={20}
          width={20}
          onPress={signInGoogle}
          onPressDisconnect={() => onDisconnectAccount(1)}
        />
        <Space height={8} />
        <ConnectButton
          title="Facebook"
          icon={icons.facebook}
          textStyle={{ fontWeight: "600", fontSize: 12, alignSelf: "center" }}
          width={20}
          onPress={signInFacebook}
          onPressDisconnect={() => onDisconnectAccount(2)}
          isConnect={facebook}
          height={20}
        />
        {Platform.OS === "ios" && (
          <View>
            <Space height={8} />
            <ConnectButton
              onPress={signInApple}
              title="Apple ID"
              icon={icons.apple}
              textStyle={{
                fontWeight: "600",
                fontSize: 12,
                alignSelf: "center",
              }}
              isConnect={apple}
              onPressDisconnect={() => onDisconnectAccount(3)}
              height={20}
              width={16}
            />
          </View>
        )}

        {!apple && (
          <>
            <Space height={24} />
            <Text size={12}>{t("kata_sandi")}</Text>
            <Button
              onPress={() => NavigationService.navigate("ChangePasswordScreen")}
              title={t("ganti_kata_sandi")}
              style={[styles.btn, { marginTop: 8, width: 220 }]}
              textType="bold"
              variant="CenturyGothicBold"
              textStyle={{ fontWeight: "600", fontSize: 10 }}
              withBorder={false}
            />
          </>
        )}
      </View>
      <View style={{ flex: 1, alignItems: "center" }}>
        <View style={styles.borderLine}>
          <Button
            //onPress={() => setShowModalCannotDelete(true)}
            onPress={onRemoveAccount}
            title={t("hapus_akun?")}
            style={[styles.btn, { marginTop: 0, width: 220 }]}
            textType="bold"
            variant="CenturyGothicBold"
            textStyle={{ fontWeight: "600", fontSize: 10 }}
            withBorder={false}
          />
        </View>
      </View>
      <LoadingModal
        showModal={showModal}
        onCloseModal={() => setShowModal(false)}
      />
      <BaseModal
        showModal={showModalCannotDelete}
        onBackButtonPress={() => setShowModalCannotDelete(false)}
        onBackdropPress={() => setShowModalCannotDelete(false)}
      >
        <View style={{ alignItems: "center" }}>
          <Image
            source={images.shipmentError}
            style={{ height: 160, width: 160, resizeMode: "contain" }}
          />
          <Space height={10} />
          <Text color={colors.accent} type="bold" variant="CenturyGothicBold">
            {t("kamu_belum_bisa_menghapus_akun")}
          </Text>
          <Space height={20} />
          <Text size={12} textAlign="center">
            {t("announce_hapus_akun")}
          </Text>
          <Space height={25} />
          <TouchableOpacity onPress={() => setShowModalCannotDelete(false)}>
            <Text style={{ fontWeight: "600" }}>{t("kembali")}</Text>
          </TouchableOpacity>
        </View>
      </BaseModal>
      <BaseModal
        showModal={showModalTimer}
        onBackButtonPress={() => {
          setShowModalTimer(false);
          clearInterval(intervalId);
          setTime(10);
        }}
        onBackdropPress={() => {
          setShowModalTimer(false);
          clearInterval(intervalId);
          setTime(10);
        }}
      >
        <View style={{ alignItems: "center" }}>
          <Image
            source={icons.warningRed}
            style={{ height: 50, width: 50, resizeMode: "contain" }}
          />
          <Space height={15} />
          <Text color={colors.red} type="bold" variant="CenturyGothicBold">
            {t("hapus_akun?")}
          </Text>
          <Space height={40} />
          <Text color={colors.red} type="bold" variant="CenturyGothicBold">
            {time}
          </Text>
          <Space height={40} />
          <Text size={12}>{t("akun_kamu_akan_dihapus")}</Text>
          <Space height={30} />
          <Button
            title={t("batalkan")}
            onPress={() => setShowModalTimer(false)}
            style={{ paddingVertical: 12, width: "100%" }}
            textStyle={{ fontSize: 12 }}
            textType="bold"
            variant="CenturyGothicBold"
          />
        </View>
      </BaseModal>
      <ModalAlert
        onHide={() => {
          setShowModalAlert({ showModal: false, title: "" });
        }}
        showModal={showModalAlert?.showModal}
        animation={"zoom"}
        title={showModalAlert?.title}
        leftFunction={showModalAlert.leftFunction}
        rightFunction={showModalAlert.rightFunction}
        leftText={showModalAlert.leftText}
        rightText={showModalAlert.rightText}
        iconImage={icons.warningRed}
        withIcon={showModalAlert?.withIcon}
        withTextInput={showModalAlert?.withTextInput}
        valueTextInput={showModalAlert?.valueTextInput}
        onChangeTextInput={showModalAlert?.onChangeTextInput}
        titleBigJapan={showModalAlert?.titleBigJapan}
        subtitle={showModalAlert?.subtitle}
        additionalText={showModalAlert?.additionalText}
        titleBig={showModalAlert?.titleBig}
        titleBigColor={colors.red}
        titleTextInput={t("konfirmasi_email_kamu")}
        textInputPlaceholder={t("konfirmasi_email_kamu")}
        textInputOnBottom={true}
        buttonRightDisabled={isValid()}
        withDeletedAccount={showModalAlert?.withDeletedAccount}
        deletedEmail={email}
      />
    </View>
  );
};

export default PrivasiPolicyScreen;
