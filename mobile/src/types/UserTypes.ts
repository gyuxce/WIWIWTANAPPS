import type { RootType } from "./NavigatorTypes";

export type UserSignupTypes = {
  email: string;
  password: string;
  confirmPassword: string;
  fullname: string;
  phone: string;
  address: string;
  cityBirth: string;
  dateBirth: any;
  bloodPressure: number;
  education: number;
  ethnic: string;
  trainingAgreement: number;
  informationSource: number;
  otherSourceText: string;
  facebook_id?: string;
  google_id?: string;
  apple_id?: string;
  trainingProgram: number;
  nik: string;
  major: string;
};

export type UserSignupProcessTypes = {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone: string;
  address: string;
  city_id: string;
  birthplace: string;
  dob: string;
  ethnic_origin: string;
  blood_type: number;
  last_education: number;
  is_training: number;
  register_information: number;
  training_program: number;
  other_register_information: string;
  facebook_id?: string;
  google_id?: string;
  apple_id?: string;
  id_card: string;
  study_program: string;
};

export type CityType = {
  id: string;
  name: string;
  code: string;
};

export type AuthType = {
  accessToken: string;
  refreshToken: string;
};

export type UserType = {
  id: string;
  name: string;
  email: string;
  name_alias: string;
  name_katakana: string;
  google_id?: string;
  facebook_id?: string;
  apple_id?: string;
  phone: string;
  address: string;
  birthplace: string;
  dob: string;
  is_active: string;
  is_active_label: string;
  bloodtype_label: string;
  last_education_label: string;
  status_training_label: string;
  training_program_label: string;
  info_register_label: string;
  other_register_information: string;
  is_subscription_active: number;
  created_at: string;
  profilePic: {
    id: string;
    filename: string;
    url: string;
    localUrl: string;
  };
  profilePicture: {
    id: string;
    filename: string;
    url: string;
    localUrl: string;
  };
  city: {
    id: string;
    name: string;
    code: string;
    province: {
      id: string;
      name: string;
      code: string;
    };
  };
  training_program: number;
  join_reason: string;
  training_preference_label: string;
  interview_status: number;
  interview_count: number;
  last_phase: number;
  last_phase_label: string;
  interview_status_label: string;
  last_level: number;
  last_level_label: string;
  active_date?: any;
};

export type StatusTestType = {
  title: string;
  slug: string;
  detailScreen: RootType;
  isChecklist: boolean;
  onPressDetail?: () => void;
  status: number;
};

export const KONTAK_ADMIN_SLUG = {
  TITP: "nomor-whatsapp-admin-titp",
  SSW: "nomor-whatsapp-admin-ssw",
  PELATIHAN: "nomor-whatsapp-admin-program-pelatihan",
};

export type SocialAccountType = {
  status: string;
  message: string;
  exist: boolean;
  data: AuthSocialAccount;
};

export type AuthSocialAccount = {
  access_token: string;
  refresh_token: string;
  user: UserType;
};
