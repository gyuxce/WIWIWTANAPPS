/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-shadow */
import React, { useEffect, useMemo, useRef, useState } from "react";
import { View, ScrollView, KeyboardAvoidingView, Alert } from "react-native";
import Space from "components/Space";
import Steps from "components/Steps";
import Header from "components/Header";
import Card from "components/Card";
import Button from "components/Button";
import { scaledFontSize } from "utils/ScaledService";
import globalStyles from "utils/GlobalStyles";
import colors from "configs/colors";
import Section from "components/Section";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import type { FirebaseAuthTypes } from "@react-native-firebase/auth";
import {
  getAuth,
  getIdToken,
  GoogleAuthProvider,
  FacebookAuthProvider,
  AppleAuthProvider,
  signInWithCredential,
} from "@react-native-firebase/auth";
import { AccessToken, LoginManager } from "react-native-fbsdk-next";
import type {
  CityType,
  UserSignupProcessTypes,
  UserSignupTypes,
} from "types/UserTypes";
import { useForm } from "react-hook-form";
import { useAuth } from "hooks/useAuth";
import DomicileActionSheet from "components/DomicileActionSheet";
import type BottomSheet from "@gorhom/bottom-sheet";
import { useUser } from "hooks/useUser";
import type { QueryType } from "types/QueryTypes";
import { useConstant } from "hooks/useConstant";
import NavigationService from "utils/NavigationService";
import moment from "moment";
import { useDispatch } from "react-redux";
import { onLogin } from "stores/persist/persistSlice";
import type { RouteProp } from "@react-navigation/core";
import { CommonActions, useNavigation } from "@react-navigation/core";
import type { StackNavigationProp } from "@react-navigation/stack";
import type { RootStackParamList } from "types/NavigatorTypes";
import { WEB_CLIENT_ID } from "@env";
import LoadingModal from "components/LoadingModal/LoadingModal";
import appleAuth from "@invertase/react-native-apple-authentication";
import { apiPostSocialAccount } from "services/AuthServices";
import { usePayment } from "hooks/usePayment";

import FifthStep from "./SignupSteps/FifthStep";
//import FourthStep from "./SignupSteps/FourthStep";
import ThirdStep from "./SignupSteps/ThirdStep";
import SecondStep from "./SignupSteps/SecondStep";
import FirstStep from "./SignupSteps/FirstStep";
import SixStep from "./SignupSteps/SixStep";

GoogleSignin.configure({
  webClientId: WEB_CLIENT_ID,
});

type SignupScreenRouteType = RouteProp<RootStackParamList, "SignupScreen">;

type SignupScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "SignupScreen"
>;

type Prop = {
  route: SignupScreenRouteType;
  navigation: SignupScreenNavigationProp;
};

const SignupScreen = ({ route }: Prop) => {
  const actionSheetRef = useRef<BottomSheet>(null);
  const { postSignup } = useAuth();
  const { cityData, getCityData } = useUser();
  const {
    getBloodData,
    getLastEducationData,
    getRegisterInformationData,
    getTrainingProgram,
    bloodType,
    //registerInformation,
    lastEducation,
    trainingProgram,
  } = useConstant();
  const [steps, setStep] = useState(route?.params?.step || 1);
  const [form, setForm] = useState({
    email: route?.params?.email || "",
    password: "",
    confirmPassword: "",
    fullname: route?.params?.fullname || "",
    phone: "",
    address: "",
    cityBirth: "",
    dateBirth: "",
    bloodPressure: 1,
    education: 2,
    ethnic: "",
    trainingAgreement: 1,
    informationSource: 1,
    otherSourceText: "",
    facebook_id: route?.params?.facebook_id || "",
    google_id: route?.params?.google_id || "",
    apple_id: route?.params?.apple_id || "",
    trainingProgram: 2,
    nik: "",
    major: "",
  } as UserSignupTypes);
  const navigation = useNavigation();
  const timeout: any = useRef(null);
  const dispatch = useDispatch();
  const [selectedCity, setSelectedCity] = useState({} as CityType);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [prices, setPrices] = useState<any>([]);
  const [queryCityState, setQueryCityState] = useState({
    type: "collection",
    options: [],
  } as QueryType);
  const { getPrice } = usePayment();
  const authInstance = getAuth();

  useEffect(() => {
    getCityData(queryCityState);
  }, [queryCityState]);

  useEffect(() => {
    getPriceData();
    getBloodData();
    getRegisterInformationData();
    getLastEducationData();
    getTrainingProgram();
  }, []);

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

  const getPriceData = async () => {
    try {
      const resp = await getPrice();
      if (resp?.status === "success" && "data" in resp) {
        setPrices(resp.data);
      }
    } catch (error) {
      window.console.log(error);
    }
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

      await signInWithCredential(authInstance, credential).then(({ user }) => {
        setShowModal(true);
        sosmedVerifyToken(user, "google");
      });
    } catch (e) {
      const err = (e as Error).message;
      window.console.log("Error : ", err);
    }
  };

  const signInFacebook = async () => {
    try {
      await LoginManager.logInWithPermissions(["public_profile", "email"]);

      const data = await AccessToken.getCurrentAccessToken();

      if (data) {
        const credential = FacebookAuthProvider.credential(data?.accessToken);

        await signInWithCredential(authInstance, credential).then(
          ({ user }) => {
            setShowModal(true);
            sosmedVerifyToken(user, "facebook");
          },
        );
      }
    } catch (e) {
      const err = (e as Error).message;
      window.console.log("Error : ", err);
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

      await signInWithCredential(authInstance, appleCredential).then(
        ({ user }) => {
          setShowModal(true);
          sosmedVerifyToken(user, "apple", tempName);
        },
      );
    } else {
      // handle this - retry?
    }
  };

  const sosmedVerifyToken = async (
    user: FirebaseAuthTypes.User,
    provider: string | undefined,
    tempName?: string,
  ) => {
    let isNewUser = false;
    if (!user) {
      isNewUser = true;
    }
    await apiPostSocialAccount(await getIdToken(user, true)).then(
      ({ exist, data }) => {
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
      },
    );
    setShowModal(false);
    if (isNewUser) {
      const _tempName = tempName || user?.email?.split("@")?.[0];
      setForm({
        ...form,
        apple_id: provider === "apple" ? user?.uid : "",
        google_id: provider === "google" ? user?.uid : "",
        facebook_id: provider === "facebook" ? user?.uid : "",
        fullname: user?.displayName || _tempName || "",
        email: user?.email || "",
      });
      setStep(2);
      setValue("email", user?.email || "");
      setValue("fullname", user?.displayName || "");
    }
  };

  const {
    control,
    watch,
    setError,
    clearErrors,
    formState: { errors },
    setValue,
  } = useForm({ mode: "onChange" });

  const snapPoints = useMemo(() => [480], []);

  const onRegistration = () => {
    let password = form?.password;
    const isBySosmed = form?.google_id || form?.facebook_id || form?.apple_id;
    if (isBySosmed) {
      password = "p4ssword";
    }
    const data: UserSignupProcessTypes = {
      name: form?.fullname,
      email: form?.email,
      password,
      password_confirmation: password,
      phone: form?.phone,
      address: form?.address,
      city_id: selectedCity?.id,
      birthplace: form?.cityBirth,
      dob: moment(form?.dateBirth).format("YYYY/MM/DD"),
      ethnic_origin: form?.ethnic,
      blood_type: form?.bloodPressure,
      last_education: form?.education,
      is_training: form?.trainingProgram,
      register_information: form?.informationSource,
      training_program: form?.trainingProgram || 2,
      other_register_information: form?.otherSourceText,
      google_id: form?.google_id,
      facebook_id: form?.facebook_id,
      apple_id: form?.apple_id,
      id_card: form?.nik,
      study_program: form?.major,
    };

    postSignup(data).then(({ id, message, status }) => {
      if (id || status === "success") {
        if (isBySosmed) {
          NavigationService.replace("SignupSuccessScreen");
        } else {
          Alert.alert(
            "Registrasi berhasil!",
            "Mohon cek email anda untuk mengaktifkan akun",
            [
              {
                text: "OK",
                onPress: () => NavigationService.replace("SignupSuccessScreen"),
              },
            ],
          );
        }
      } else {
        if (typeof message !== "string") {
          message = JSON.stringify(message);
        }
        Alert.alert(
          "Registrasi gagal",
          message ?? "Terjadi kesalahan saat registrasi",
          [{ text: "OK" }],
        );
      }
    });
  };

  const isDataValid = () => {
    if (steps === 2) {
      if (
        form?.fullname === "" ||
        form?.nik === "" ||
        form?.phone === "" ||
        form?.trainingProgram === 0
      ) {
        return false;
      }

      if (
        errors?.fullname ||
        errors?.nik ||
        errors?.phone ||
        errors?.trainingProgram
      ) {
        return false;
      } else {
        return true;
      }
    }

    if (steps === 3) {
      if (form?.address === "") {
        return false;
      }
      if (!selectedCity?.id || errors?.bloodPressure || errors?.address) {
        return false;
      } else {
        return true;
      }
    }

    if (steps === 4) {
      if (
        form?.cityBirth === "" ||
        form?.dateBirth === "" ||
        form?.major === ""
      ) {
        return false;
      }

      if (
        errors?.major ||
        errors?.education ||
        errors?.dateBirth ||
        errors?.cityBirth
      ) {
        return false;
      } else {
        return true;
      }
    }

    // if (steps === 5) {
    //   if (form?.ethnic === "") {
    //     if (form?.informationSource === 4) {
    //       if (form?.otherSourceText !== "") {
    //         return false;
    //       }
    //     }
    //     return false;
    //   }

    //   if (errors.ethnic) {
    //     return false;
    //   } else {
    //     return true;
    //   }
    // }

    return false;
  };

  const priceInfo = useMemo(() => {
    return [...prices]?.filter(
      (item: any) => item?.program_id === form?.trainingProgram,
    );
  }, [form?.trainingProgram, prices]);

  return (
    <View style={[globalStyles().topSafeArea]}>
      <Header
        withLogo
        withBackButton
        onBackButton={() => {
          if (
            steps === 2 &&
            (route?.params?.provider ||
              form?.apple_id ||
              form?.google_id ||
              form?.facebook_id)
          ) {
            NavigationService.back();
          } else if (steps !== 1) {
            setStep(steps - 1);
          } else {
            NavigationService.back();
          }
        }}
      />
      <Space height={20} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={"height"}
        contentContainerStyle={{ height: "100%" }}
      >
        <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
          <Section textJapan="新しいアカウント作成" textTitle="Daftar Baru" />
          <Space height={20} />
          <Steps step={steps} maxStep={5} />

          <Space height={20} />
          {/* step 1 */}
          {steps === 1 ? (
            <FirstStep
              onPress={() => setStep(2)}
              onPressGoogleLogin={signInGoogle}
              onPressFacebookLogin={signInFacebook}
              onPressAppleLogin={signInApple}
              form={form}
              setForm={setForm}
              control={control}
              errors={errors}
              watch={watch}
              setError={setError}
              clearErrors={clearErrors}
            />
          ) : null}
          {steps === 2 ? (
            <SecondStep
              form={form}
              setForm={setForm}
              control={control}
              errors={errors}
              trainingProgram={trainingProgram}
              isByApple={
                route?.params?.provider === "apple" || form?.apple_id
                  ? true
                  : false
              }
            />
          ) : null}
          {steps === 3 ? (
            <SixStep
              form={form}
              setForm={setForm}
              control={control}
              errors={errors}
              onPressDomicile={() => {
                actionSheetRef?.current?.snapToPosition(480);
              }}
              selectedCity={selectedCity}
              bloodType={bloodType}
            />
          ) : null}

          {/* step 3 */}
          {steps === 4 ? (
            <ThirdStep
              form={form}
              setForm={setForm}
              control={control}
              errors={errors}
              lastEducation={lastEducation}
            />
          ) : null}
          {/* step 4 */}
          {/* {steps === 5 ? (
            <FourthStep
              form={form}
              setForm={setForm}
              control={control}
              errors={errors}
              watch={watch}
              registerInformation={registerInformation}
            />
          ) : null} */}
          {/* step 5 */}
          {steps === 5 ? (
            <FifthStep priceInfo={priceInfo} onPressSubmit={onRegistration} />
          ) : null}

          {/* accept first and fifth there are next and back button */}
          <Space height={50} />
        </ScrollView>
        {steps !== 1 && steps !== 5 ? (
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
              variant="CenturyGothicBold"
              textType="bold"
              title="Lanjutkan"
              type="light"
              style={{ paddingVertical: 12, minWidth: "100%" }}
              onPress={() => {
                if (isDataValid()) {
                  setStep(steps + 1);
                }
              }}
              textStyle={{
                fontSize: scaledFontSize(20),
                lineHeight: 18,
              }}
              disabled={!isDataValid()}
              withBorder={isDataValid()}
            />

            <Button
              variant="CenturyGothicBold"
              textType="bold"
              title="Kembali"
              type="light"
              style={{ paddingVertical: 12, minWidth: "100%" }}
              withBorder={false}
              onPress={() => {
                if (
                  steps === 2 &&
                  (route?.params?.provider ||
                    form?.apple_id ||
                    form?.google_id ||
                    form?.facebook_id)
                ) {
                  NavigationService.back();
                } else if (steps !== 1) {
                  setStep(steps - 1);
                } else {
                  NavigationService.back();
                }
              }}
              textStyle={{
                fontSize: scaledFontSize(20),
                lineHeight: 18,
              }}
            />
          </Card>
        ) : null}
        {steps === 3 ? (
          <DomicileActionSheet
            actionSheetRef={actionSheetRef}
            snapPoints={snapPoints}
            data={cityData}
            selectedCity={selectedCity}
            setSelectedCity={setSelectedCity}
            search={search}
            setSearch={onSearch}
          />
        ) : null}
        <LoadingModal
          showModal={showModal}
          onCloseModal={() => setShowModal(false)}
        />
      </KeyboardAvoidingView>
    </View>
  );
};

export default SignupScreen;
