import React from "react";
import type { StackNavigationOptions } from "@react-navigation/stack";
import {
  CardStyleInterpolators,
  createStackNavigator,
} from "@react-navigation/stack";
import type { RootStackParamList } from "types/NavigatorTypes";
import { View } from "react-native";
import HomeScreen from "screens/HomeScreen/HomeScreen";
import LoginScreen from "screens/LoginScreen/LoginScreen";
import ForgotPasswordScreen from "screens/ForgotPasswordScreen/ForgotPasswordScreen";
import VerifyChangePasswordScreen from "screens/ForgotPasswordScreen/VerifyChangePasswordScreen";
import ResetPasswordScreen from "screens/ForgotPasswordScreen/ResetPasswordScreen";
import SuccessResetPasswordScreen from "screens/ForgotPasswordScreen/SuccessResetPasswordScreen";
import SignupScreen from "screens/LoginScreen/SignupScreen";
import LandingScreen from "screens/LoginScreen/LandingScreen";
import PraTestScreen from "screens/PraTestScreen/PraTestScreen";
// import CountDownTest from "screens/PraTestScreen/CountDownTest";
import UploadTest from "screens/PraTestScreen/UploadTest";
import PrivasiPolicyScreen from "screens/ProfileScreen/PrivasiPolicyScreen";
import EditProfileScreen from "screens/ProfileScreen/EditProfileScreen";
import DownloadScreen from "screens/DownloadScreen/DownloadScreen";
import SplashScreen from "screens/SplashScreen/SplashScreen";
import GuestScreen from "screens/GuestScreen/GuestScreen";
import BannerDetailScreen from "screens/BannerDetailScreen/BannerDetailScreen";
import VideoScreen from "screens/VideoScreen/VideoScreen";
import SignupSuccessScreen from "screens/LoginScreen/SignupSuccessScreen";
import ForumEditorScreen from "screens/ForumEditorScreen/ForumEditorScreen";
import TrainingScreen from "screens/TrainingScreen";
import DetailTrainingScreen from "screens/TrainingScreen/DetailTrainingScreen";
import PaymentAdministration from "screens/PaymentAdministration/PaymentAdministration";
import FullPaymentScreen from "screens/FullPaymentScreen/FullPaymentScreen";
import InstallmentPaymentScreen from "screens/InstallmentPaymentScreen/InstallmentPaymentScreen";
import InstallmenScreen from "screens/InstallmentAdmScreen/InstallmentScreen";
import PaymentTypeScreen from "screens/PaymentTypeScreen/PaymentTypeScreen";
import ForumDetailScreen from "screens/ForumDetailScreen/ForumDetailScreen";
import ForumDraftScreen from "screens/ForumDraftScreen/ForumDraftScreen";
import DocumentScreen from "screens/DocumentScreen/DocumentScreen";
//import TabNavigator from "./TabNavigator";
import NotificationScreen from "screens/NotificationScreen/NotificationScreen";
import ContactAdminScreen from "screens/ContactAdminScreen/ContactAdminScreen";
import { createDrawerNavigator } from "@react-navigation/drawer";
import DrawerView from "components/DrawerView";
import ProfileScreen from "screens/ProfileScreen";
import ForumScreen from "screens/ForumScreen/ForumScreen";
import ForumCategoryScreen from "screens/ForumCategoryScreen/ForumCategoryScreen";
import ProfileMyProgressScreen from "screens/ProfileMyProgressScreen/ProfileMyProgressScreen";
import InstallmentDetailScreen from "screens/InstallmentAdmScreen/InstallmentDetailScreen";
import FullPaymentDetailScreen from "screens/FullPaymentScreen/FullPaymentDetailScreen";
import WebviewScreen from "screens/WebViewScreen/WebViewScreen";
import QuestionListScreen from "screens/QuestionListScreen/QuestionListScreen";
import FinishTestScreen from "screens/PraTestScreen/FinishTest/FinishTestScreen";
import WebviewCharacter from "screens/WebviewCharacter/WebviewCharacter";
import InstallmentPaymentDetailScreen from "screens/InstallmentPaymentScreen/InstallmentPaymentDetailScreen";
import UserForumDetailScreen from "screens/UserForumDetailScreen/UserForumDetailScreen";
import JapanCertificateScreen from "screens/JapanCertificateScreen/JapanCertificateScreen";
import UploadCertificationScreen from "screens/UploadCertificationScreen/UploadCertificationScreen";
import CertificationSuccessScreen from "screens/CertificationSuccessScreen/CertificationSuccessScreen";
import ChangePasswordScreen from "screens/ChangePasswordScreen/ChangePasswordScreen";
import ChangePasswordSuccessScreen from "screens/ChangePasswordSuccessScreen/ChangePasswordSuccessScreen";
import FinalInterviewScreen from "screens/FinalInterviewScreen/FinalInterviewScreen";
import ModulDetailScreen from "screens/ModulDetailScreen/ModulDetailScreen";
import ContentDetailScreen from "screens/ContentDetailScreen/ContentDetailScreen";
import AssesmentQuestionScreen from "screens/AssesmentQuestionScreen/AssesmentQuestionScreen";
import AssesmentTimerStart from "screens/AssesmentTimerStart/AssesmentTimerStart";
import FinishAssesment from "screens/FinishAssesment/FinishAssesment";
import ManagementScreen from "screens/ManagementScreen/ManagementScreen";
import AssesmentReviewScreen from "screens/AssesmentReviewScreen/AssesmentReviewScreen";

const Main = createStackNavigator<RootStackParamList>();
const DrawerStack = createDrawerNavigator<RootStackParamList>();
const options: StackNavigationOptions = {
  headerTintColor: "#65b6e5",
  headerBackTitleVisible: false,
  headerTitleAlign: "center",
  headerTitleStyle: {
    //fontFamily: "Poppins-Regular",
    fontWeight: "bold",
    fontSize: 14,
    color: "#4a4a4a",
  },
  // headerStyle: {
  //   shadowColor: '#000',
  //   shadowOffset: {
  //     width: 0,
  //     height: 3,
  //   },
  //   shadowOpacity: 0.27,
  //   shadowRadius: 4.65,

  //   elevation: 6,
  // },
  // headerLeft: () => (
  //   <TouchableOpacity
  //     onPress={NavigationService.back}
  //     style={{
  //       paddingVertical: scaledVertical(15),
  //       paddingRight: scaledHorizontal(20),
  //     }}>
  //     <Image
  //       source={icon.backIcon}
  //       style={{
  //         height: scaledVertical(36),
  //         width: scaledHorizontal(36),
  //         marginLeft: scaledHorizontal(10),
  //       }}
  //     />
  //   </TouchableOpacity>
  // ),
  // headerBackImage: () => (

  // ),
  //cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
};

// const halfModalBottomOptions: StackNavigationOptions = {
//   cardStyle: { backgroundColor: "transparent" },
//   presentation: "transparentModal",
//   headerShown: false,
//   cardOverlayEnabled: true,
//   cardStyleInterpolator: ({ current: { progress } }) => ({
//     cardStyle: {
//       opacity: progress.interpolate({
//         inputRange: [0, 0.75, 1],
//         outputRange: [0, 0.5, 1],
//       }),
//     },
//     overlayStyle: {
//       opacity: progress.interpolate({
//         inputRange: [0, 1],
//         outputRange: [0, 0.5],
//         extrapolate: "clamp",
//       }),
//     },
//   }),
// };

const MainNavigator = () => {
  return (
    <View style={{ flex: 1 }}>
      <DrawerStack.Navigator
        drawerContent={props => <DrawerView {...props} />}
        screenOptions={{
          header: () => null,
          drawerType: "front",
          swipeEnabled: false,
          drawerContentContainerStyle: { width: "90%" },
          drawerContentStyle: { width: "90%" },
          drawerStyle: { width: "85%" },
        }}
      >
        <DrawerStack.Screen
          name="AppStackNavigator"
          component={AppStackNavigator}
        />
      </DrawerStack.Navigator>
    </View>
  );
};

export const AppStackNavigator = () => {
  return (
    <Main.Navigator screenOptions={options}>
      <Main.Screen
        name="SplashScreen"
        component={SplashScreen}
        options={{
          gestureEnabled: false,
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      />
      <Main.Screen
        name="LandingScreen"
        component={LandingScreen}
        options={{
          gestureEnabled: false,
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      />
      {/* <Main.Screen
          name="TabNavigator"
          component={TabNavigator}
          options={{ headerShown: false, gestureEnabled: false }}
        /> */}
      {/* Tab Navigator */}
      <Main.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          gestureEnabled: false,
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      />
      <Main.Screen
        name="DownloadScreen"
        component={DownloadScreen}
        options={{
          gestureEnabled: false,
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      />
      <Main.Screen
        name="LoginScreen"
        component={LoginScreen}
        options={{
          gestureEnabled: false,
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      />
      <Main.Screen
        name="SignupScreen"
        component={SignupScreen}
        options={{
          gestureEnabled: false,
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      />
      <Main.Screen
        name="VideoScreen"
        component={VideoScreen}
        options={{
          gestureEnabled: false,
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
        }}
      />
      <Main.Screen
        name="UploadTest"
        component={UploadTest}
        options={{
          gestureEnabled: false,
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      />
      <Main.Screen
        name="GuestScreen"
        component={GuestScreen}
        options={{
          gestureEnabled: false,
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      />
      <Main.Screen
        name="BannerDetailScreen"
        component={BannerDetailScreen}
        options={{
          gestureEnabled: false,
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
        }}
      />
      <Main.Screen
        name="PraTestScreen"
        component={PraTestScreen}
        options={{
          gestureEnabled: false,
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      />
      <Main.Screen
        name="PrivasiPolicyScreen"
        component={PrivasiPolicyScreen}
        options={{
          gestureEnabled: false,
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      />
      <Main.Screen
        name="EditProfileScreen"
        component={EditProfileScreen}
        options={{
          gestureEnabled: false,
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      />
      <Main.Screen
        name="ForgotPasswordScreen"
        component={ForgotPasswordScreen}
        options={{
          gestureEnabled: false,
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      />
      <Main.Screen
        name="VerifyChangePasswordScreen"
        component={VerifyChangePasswordScreen}
        options={{
          gestureEnabled: false,
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      />
      <Main.Screen
        name="ResetPasswordScreen"
        component={ResetPasswordScreen}
        options={{
          gestureEnabled: false,
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      />
      <Main.Screen
        name="SuccessResetPasswordScreen"
        component={SuccessResetPasswordScreen}
        options={{
          gestureEnabled: false,
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      />
      <Main.Screen
        name="SignupSuccessScreen"
        component={SignupSuccessScreen}
        options={{
          gestureEnabled: false,
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      />
      <Main.Screen
        name="ForumEditorScreen"
        component={ForumEditorScreen}
        options={{
          gestureEnabled: false,
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      />
      <Main.Screen
        name="PaymentAdministration"
        component={PaymentAdministration}
        options={{
          gestureEnabled: false,
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          animationEnabled: false,
        }}
      />
      <Main.Screen
        name="FullPaymentScreen"
        component={FullPaymentScreen}
        options={{
          gestureEnabled: false,
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      />
      <Main.Screen
        name="InstallmentPaymentScreen"
        component={InstallmentPaymentScreen}
        options={{
          gestureEnabled: false,
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          animationEnabled: false,
        }}
      />
      <Main.Screen
        name="InstallmentLandingScreen"
        component={InstallmenScreen}
        options={{
          gestureEnabled: false,
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      />
      <Main.Screen
        name="PaymentTypeScreen"
        component={PaymentTypeScreen}
        options={{
          gestureEnabled: false,
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      />
      <Main.Screen
        name="ForumDetailScreen"
        component={ForumDetailScreen}
        options={{
          gestureEnabled: false,
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
        }}
      />
      <Main.Screen
        name="ForumDraftScreen"
        component={ForumDraftScreen}
        options={{
          gestureEnabled: false,
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      />
      <Main.Screen
        name="TrainingScreen"
        component={TrainingScreen}
        options={{
          gestureEnabled: false,
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      />
      <Main.Screen
        name="DetailTrainingScreen"
        component={DetailTrainingScreen}
        options={{
          gestureEnabled: false,
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      />
      <Main.Screen
        name="NotificationScreen"
        component={NotificationScreen}
        options={{
          gestureEnabled: false,
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      />
      <Main.Screen
        name="ContactAdminScreen"
        component={ContactAdminScreen}
        options={{
          gestureEnabled: false,
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      />
      <Main.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{
          gestureEnabled: false,
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      />
      <Main.Screen
        name="ForumScreen"
        component={ForumScreen}
        options={{
          gestureEnabled: false,
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      />
      <Main.Screen
        name="ForumCategoryScreen"
        component={ForumCategoryScreen}
        options={{
          gestureEnabled: false,
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      />
      <Main.Screen
        name="DocumentScreen"
        component={DocumentScreen}
        options={{
          gestureEnabled: false,
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      />
      <Main.Screen
        name="ProfileMyProgressScreen"
        component={ProfileMyProgressScreen}
        options={{
          gestureEnabled: false,
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      />
      <Main.Screen
        name="InstallmentDetailScreen"
        component={InstallmentDetailScreen}
        options={{
          gestureEnabled: false,
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          animationEnabled: false,
        }}
      />
      <Main.Screen
        name="QuestionListScreen"
        component={QuestionListScreen}
        options={{
          gestureEnabled: true,
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          animationEnabled: false,
        }}
      />
      <Main.Screen
        name="FinishTestScreen"
        component={FinishTestScreen}
        options={{
          gestureEnabled: false,
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          animationEnabled: false,
        }}
      />
      <Main.Screen
        name="WebviewCharacter"
        component={WebviewCharacter}
        options={{
          gestureEnabled: false,
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          animationEnabled: false,
        }}
      />
      <Main.Screen
        name="FullPaymentDetailScreen"
        component={FullPaymentDetailScreen}
        options={{
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          animationEnabled: false,
        }}
      />
      <Main.Screen
        name="InstallmentPaymentDetailScreen"
        component={InstallmentPaymentDetailScreen}
        options={{
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          animationEnabled: false,
        }}
      />
      <Main.Screen
        name="WebViewScreen"
        component={WebviewScreen}
        options={{
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      />
      <Main.Screen
        name="UserForumDetailScreen"
        component={UserForumDetailScreen}
        options={{
          gestureEnabled: true,
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          animationEnabled: true,
        }}
      />
      <Main.Screen
        name="JapanCertificateScreen"
        component={JapanCertificateScreen}
        options={{
          gestureEnabled: true,
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          animationEnabled: true,
        }}
      />
      <Main.Screen
        name="UploadCertificationScreen"
        component={UploadCertificationScreen}
        options={{
          gestureEnabled: true,
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          animationEnabled: true,
        }}
      />
      <Main.Screen
        name="CertificationSuccessScreen"
        component={CertificationSuccessScreen}
        options={{
          gestureEnabled: true,
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          animationEnabled: true,
        }}
      />
      <Main.Screen
        name="ChangePasswordScreen"
        component={ChangePasswordScreen}
        options={{
          gestureEnabled: true,
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          animationEnabled: true,
        }}
      />
      <Main.Screen
        name="ChangePasswordSuccessScreen"
        component={ChangePasswordSuccessScreen}
        options={{
          gestureEnabled: true,
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          animationEnabled: true,
        }}
      />
      <Main.Screen
        name="FinalInterviewScreen"
        component={FinalInterviewScreen}
        options={{
          gestureEnabled: true,
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          animationEnabled: true,
        }}
      />
      <Main.Screen
        name="ModulDetailScreen"
        component={ModulDetailScreen}
        options={{
          gestureEnabled: true,
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          animationEnabled: true,
        }}
      />
      <Main.Screen
        name="ContentDetailScreen"
        component={ContentDetailScreen}
        options={{
          gestureEnabled: true,
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          animationEnabled: true,
        }}
      />
      <Main.Screen
        name="AssesmentQuestionScreen"
        component={AssesmentQuestionScreen}
        options={{
          gestureEnabled: true,
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          animationEnabled: true,
        }}
      />
      <Main.Screen
        name="AssesmentTimerStart"
        component={AssesmentTimerStart}
        options={{
          gestureEnabled: true,
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          animationEnabled: true,
        }}
      />
      <Main.Screen
        name="FinishAssesment"
        component={FinishAssesment}
        options={{
          gestureEnabled: true,
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          animationEnabled: true,
        }}
      />
      <Main.Screen
        name="ManagementScreen"
        component={ManagementScreen}
        options={{
          gestureEnabled: true,
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          animationEnabled: true,
        }}
      />
      <Main.Screen
        name="AssesmentReviewScreen"
        component={AssesmentReviewScreen}
        options={{
          gestureEnabled: true,
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          animationEnabled: true,
        }}
      />
    </Main.Navigator>
  );
};

export default MainNavigator;
