export type ExamProgressType = {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
  created_by: string;
  updated_by: string;
  deleted_by: string;
  number: string;
  duration: string;
  requested_at: string;
  scheduled_at: string;
  expired_at: string;
  started_at: string;
  finished_at: string;
  weight_total: string;
  weight_achieved: string;
  status_label: string;
  status: number;
  status_pratest: string;
  jadwal_tersedia: number;
  file_tes_character_status: string;
  progress: ProgressType;
  link: string;
};

export type ProgressType = {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
  created_by: string;
  updated_by: string;
  deleted_by: string;
  title: string;
  description: string;
  duration: string;
  is_randomized_question: string;
  is_randomized_items: string;
  retry_count: string;
  weight_total: string;
  weight_minimal: string;
  is_active: boolean;
  type: string;
  link_url: string;
  sesi: SesiType[];
  currentSessionLanguage?: CurrentSessionLanguageType;
};

export type SesiType = {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
  created_by: string;
  updated_by: string;
  deleted_by: string;
  index: number;
  is_header: boolean;
  title: string;
  title_japan?: string;
  description: string;
  body_type: string;
  body_url: string;
  body_file_id: string;
  is_introduction: string;
  language_type: string;
  duration: string;
  count_question: number;
  language_type_label: string;

  isStart?: boolean;
};

export type ExamScheduleType = {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
  created_by: string;
  updated_by: string;
  deleted_by: string;
  number: string;
  duration: string;
  requested_at: string;
  scheduled_at: string;
  expired_at: string;
  started_at: string;
  finished_at: string;
  weight_total: string;
  weight_achieved: string;
  status_label: string;
  status: number;
  status_pratest: string;
  jadwal_tersedia: number;
  file_tes_character_status: string;
  link: string;
  exam_schedules: ScheduleType[];
  exam_schedule_active: ScheduleType;
};

export type ScheduleType = {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
  created_by: string;
  updated_by: string;
  deleted_by: string;
  start_date: string;
  end_date: string;
};

export type TraningModuleProgressType = {
  id: string;
  title: string;
  title_japan: string;
  description: string;
  type_label: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
  materi_count: number;
  materi_count_progress: number;
  virtual_count: number;
  virtual_count_progress: number;
  assesment_count: number;
  assesment_count_progress: number;
  cover: FileType;
};

export type QuestionSessionType = {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
  created_by: string;
  updated_by: string;
  deleted_by: string;
  index: number;
  is_header: boolean;
  title: string;
  description: string;
  body_type: string;
  body_url: string;
  is_introduction: boolean;
  language_type: string;
  duration: string;
  count_question: number;
  language_type_label: string;
  question: QuestionType[];
  file: FileType;
  userStartedSession: userStartedSession;

  remainingDuration?: string;
};

export type QuestionType = {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
  created_by: string;
  updated_by: string;
  deleted_by: string;
  type: number;
  title: string;
  description: string;
  body_type: string;
  body_url: string;
  weight_true: string;
  weight_null: string;
  weight_false: string;
  weight_min: string;
  weight_max: string;
  index: any;
  type_label: string;
  file: FileType;
  question_items: QuestionItemType[];
  userAnswareSelected: UserAnswerSelectedType;
};

export type QuestionItemType = {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
  created_by: string;
  updated_by: string;
  deleted_by: string;
  description: string;
  is_correct: boolean;
  body_type: string;
  body_url: string;
  index: number;
  weight: string;

  selectedQuestion?: boolean;
};

export type FileType = {
  id: string;
  created_at: string;
  updated_at: string;
  adapter: string;
  filename: string;
  url: string;
  local_url: string;
  height: string;
  width: string;
  size: number;
  uuid: string;
  //This not from api
  downloadedUrl?: string;
};

export type IntroductionType = {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
  created_by: string;
  updated_by: string;
  deleted_by: string;
  title: string;
  description: string;
  duration: string;
  is_randomized_question: string;
  is_randomized_items: string;
  retry_count: any;
  weight_total: any;
  weight_minimal: any;
  is_active: boolean;
  type: string;
  link_url: string;
  introduction: {
    id: string;
    created_at: string;
    updated_at: string;
    deleted_at: string;
    created_by: number;
    updated_by: number;
    deleted_by: number;
    index: number;
    is_header: boolean;
    title: string;
    description: string;
    body_type: string;
    body_url: string;
    is_introduction: number;
    language_type: number;
    duration: string;
    count_question: string;
    language_type_label: string;
    child: {
      id: string;
      created_at: string;
      updated_at: string;
      deleted_at: string;
      created_by: number;
      updated_by: number;
      deleted_by: number;
      index: boolean;
      is_header: boolean;
      title: string;
      description: string;
      body_type: string;
      body_url: string;
      is_introduction: number;
      language_type: number;
      duration: number;
      count_question: number;
      language_type_label: string;
    }[];
  }[];
};

export type CurrentSessionLanguageType = {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
  created_by: number;
  updated_by: number;
  deleted_by: number;
  index: number;
  is_header: true;
  title: string;
  description: string;
  body_type: string;
  body_url: string;
  is_introduction: number;
  language_type: string;
  duration: string;
  count_question: number;
  language_type_label: string;
};

export type PostAnswerType = {
  user_exam_id: string;
  question: {
    id: string;
    a_body_type: string;
    a_body_text: string;
    a_body_url: string;
    a_body_file_id: string;
    question_items: { id: string; is_selected: boolean }[];
  };
};

export type PutAnswerType = {
  user_exam_id: string;
  question: {
    a_body_type: string;
    a_body_text: string;
    a_body_url: string;
    a_body_file_id: string;
    question_items: { id: string; is_selected: boolean }[];
  };
};

export type UserAnswerSelectedType = {
  id: string;
  uuid: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
  is_selected: boolean;
  index: number;
  o_description: string;
  o_body_type: string;
  o_body_url: string;
  o_body_file_id: string;
  o_is_correct: string;
  o_weight: string;
  question_item: QuestionItemType;
};

export type userStartedSession = {
  id: string;
  created_at: string;
  updated_at: string;
  started_at: string;
};

export type PostStatusType = {
  user_exam_id: string;
  status: number;
  finished_at: string;
  started_at: string;
};

export type ModuleDetail = {
  id: string;
  group: number;
  parent_id: number;
  is_header: boolean;
  title: string;
  description: string;
  index: string;
  type: string;
  program_type: number;
  level_module: number;
  access_module: number;
  group_label: string;
  program_type_label: string;
  level_module_label: string;
  access_module_label: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
  content?: ModuleDetail[];
  materialContent?: MaterialContent[];
};

export type MaterialContent = {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
  created_by: string;
  updated_by: string;
  deleted_by: string;
  title: string;
  description: string;
  body_type: number;
  body_type_label: string;
  body_url: string;
  duration: string;
  body_text: string;
  cover: Cover;
  file: Cover;
  progress: Progress;
};

export type Cover = {
  id: string;
  created_at: string;
  updated_at: string;
  adapter: string;
  filename: string;
  url: string;
  local_url: string;
  height: string;
  width: string;
  size: number;
};

export type Progress = {
  id: string;
  created_at: Date;
  updated_at: Date;
  status: number;
  status_label: string;
  duration: string;
};

// Converts JSON strings to/from your types
export class Convert {
  public static toModuleDetail(json: string): ModuleDetail {
    return JSON.parse(json);
  }

  public static moduleDetailToJson(value: ModuleDetail): string {
    return JSON.stringify(value);
  }
}
