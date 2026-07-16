import { QuestionResponse, UserExamType } from "./AssesmentTypes";
import { CertificationListType } from "./CertificationTypes";
import type {
  FileType,
  QuestionSessionType,
  TraningModuleProgressType,
} from "./ExamTypes";
import { MaterialContentType } from "./TrainingTypes";
import type { UserType } from "./UserTypes";

export type RootStackParamList = {
  HomeScreen: undefined;
  AppStackNavigator: undefined;
  TabNavigator: undefined;
  MainNavigator: undefined;
  PraTestScreen: undefined;
  CharacterTestScreen: undefined;
  FrequentlyAskedQuestion: undefined;
  DownloadScreen: { data: QuestionSessionType; isNext: boolean };
  VideoScreen: { uri: string };
  UploadTest: undefined;
  PrivasiPolicyScreen: undefined;
  LoginScreen: undefined;
  ForgotPasswordScreen: undefined;
  VerifyChangePasswordScreen: { email: string };
  ResetPasswordScreen: { token: string };
  SuccessResetPasswordScreen: undefined;
  SignupScreen: {
    fullname?: string;
    email?: string;
    facebook_id?: string;
    apple_id?: string;
    google_id?: string;
    step?: number;
    provider?: string;
    user?: any;
  };
  EditProfileScreen: undefined;
  SplashScreen: undefined;
  GuestScreen: undefined;
  BannerDetailScreen: { id: string };
  LandingScreen: undefined;
  SignupSuccessScreen: undefined;
  ForumEditorScreen: { id?: string; from: string };
  TrainingScreen: undefined;
  DetailTrainingScreen: { categoryCourse: TraningModuleProgressType };
  PaymentAdministration: undefined;
  FullPaymentScreen: undefined;
  InstallmentPaymentScreen: undefined;
  InstallmentLandingScreen: undefined;
  PaymentTypeScreen: {
    textJapan?: string;
    textTitle?: string;
    textSubtitle?: string;
    image?: any;
    textButton?: string;
    identifier?: string;
    titleType?: "big" | "small";
    imageSize?: "big" | "small";
    secondBtnText?: string;
    secondIdentifier?: string;
  };
  ForumScreen: undefined;
  ForumDetailScreen: { id: string };
  ForumDraftScreen: undefined;
  NotificationScreen: undefined;
  ContactAdminScreen: undefined;
  ProfileScreen: undefined;
  ForumCategoryScreen: { id: string; name: string };
  ProfileMyProgressScreen: undefined;
  DocumentScreen: undefined;
  InstallmentDetailScreen: undefined;
  FullPaymentDetailScreen: { price_type: number };
  WebViewScreen: { uri: string; from: string };
  QuestionListScreen: { data: QuestionSessionType };
  FinishTestScreen: undefined;
  WebviewCharacter: { link: string };
  InstallmentPaymentDetailScreen: undefined;
  UserForumDetailScreen: { user: UserType };
  JapanCertificateScreen: undefined;
  UploadCertificationScreen: { data: CertificationListType[] };
  CertificationSuccessScreen: undefined;
  CategoryCourse: object;
  ChangePasswordScreen: undefined;
  ChangePasswordSuccessScreen: undefined;
  FinalInterviewScreen: undefined;
  ModulDetailScreen: {
    level: string;
    categoryId: string;
    materiTitle: string;
    materiProgress: string;
    materiTotal: string;
    materiId: string;
    breadCrumb: { title: string; isActive: string }[];
    data?: MaterialContentType;
    title?: string;
    type_label?: string;
  };
  ContentDetailScreen: {
    level: string;

    materiTitle: string;
    materiProgress: string;
    materiTotal: string;
    materiId: string;
    breadCrumb: { title: string; isActive: string }[];
    data?: MaterialContentType;
    title?: string;
    type_label?: string;
  };
  AssesmentQuestionScreen: {
    id: string;
    data: QuestionResponse;
    userExam: UserExamType;
    assesmentId: string;
    working_date: string;
  };
  AssesmentTimerStart: {
    title: string;
    id: string;
    icon: string;
    working_date: string;
  };
  FinishAssesment: undefined;
  ManagementScreen: { title: string; path: string };
  AssesmentReviewScreen: { title: string; file: FileType };
};

export type RootType =
  | "HomeScreen"
  | "AppStackNavigator"
  | "TabNavigator"
  | "MainNavigator"
  | "PraTestScreen"
  | "CharacterTestScreen"
  | "FrequentlyAskedQuestion"
  | "DownloadScreen"
  | "VideoScreen"
  | "LoginScreen"
  | "SignupScreen"
  | "UploadTest"
  | "LoginScreen"
  | "ForgotPasswordScreen"
  | "VerifyChangePasswordScreen"
  | "ResetPasswordScreen"
  | "SuccessResetPasswordScreen"
  | "PrivasiPolicyScreen"
  | "EditProfileScreen"
  | "SplashScreen"
  | "GuestScreen"
  | "BannerDetailScreen"
  | "LandingScreen"
  | "SignupSuccessScreen"
  | "ForumEditorScreen"
  | "TrainingScreen"
  | "DetailTrainingScreen"
  | "PaymentAdministration"
  | "FullPaymentScreen"
  | "InstallmentPaymentScreen"
  | "InstallmentLandingScreen"
  | "PaymentTypeScreen"
  | "ForumScreen"
  | "ForumDetailScreen"
  | "ForumDraftScreen"
  | "NotificationScreen"
  | "ContactAdminScreen"
  | "ProfileScreen"
  | "ForumScreen"
  | "ForumCategoryScreen"
  | "ProfileMyProgressScreen"
  | "DocumentScreen"
  | "InstallmentDetailScreen"
  | "FullPaymentDetailScreen"
  | "WebViewScreen"
  | "QuestionListScreen"
  | "FinishTestScreen"
  | "WebviewCharacter"
  | "InstallmentPaymentDetailScreen"
  | "JapanCertificateScreen"
  | "UploadCertificationScreen"
  | "CertificationSuccessScreen"
  | "CategoryCourse"
  | "UserForumDetailScreen"
  | "ChangePasswordScreen"
  | "ChangePasswordSuccessScreen"
  | "FinalInterviewScreen"
  | "ModulDetailScreen"
  | "ContentDetailScreen"
  | "AssesmentQuestionScreen"
  | "AssesmentTimerStart"
  | "FinishAssesment"
  | "ManagementScreen"
  | "AssesmentReviewScreen";
