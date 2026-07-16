import { UserExamType } from "./AssesmentTypes";
import { FileType } from "./ExamTypes";

export type VirtualClassModuleType = {
  id: string;
  group: any;
  parent_id: any;
  is_header: boolean;
  title: string;
  description: string;
  index: number;
  type: string;
  program_type: number;
  level_module: number;
  access_module: number;
  group_label: string;
  program_type_label: string;
  level_module_label: string;
  access_module_label: string;
  created_at: null;
  updated_at: null;
  deleted_at: null;
  classVirtual: VirtualClassType[];
};

export type VirtualClassType = {
  id: string;
  group: number;
  parent_id: number;
  is_header: boolean;
  title: string;
  description: string;
  index: any;
  type: any;
  program_type: number;
  level_module: any;
  access_module: any;
  group_label: string;
  program_type_label: string;
  level_module_label: string;
  access_module_label: string;
  created_at: null;
  updated_at: null;
  deleted_at: null;
  event: EventType;
};

export type EventType = {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
  title: string;
  description: string;
  from: any;
  to: any;
  started_at: string;
  finished_at: any;
  recording_file_id: any;
  external_url: string;
  external_passkey: string;
  status: number;
  cover_file_id: string;
  participant_max: string;
  is_online: any;
  address_id: any;
  is_active: any;
  cover: any;
};

export type TypeAsesment = {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
  title: string;
  description: string;
  duration: string;
  is_randomized_question: boolean;
  is_randomized_items: boolean;
  retry_count: number;
  weight_total: number;
  weight_minimal: number;
  is_active: boolean;
  type: string;
  link_url: string;
  exam_template_type: number;
  exam_template_type_label: string;
};

export type AsesmentStudent = {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
  progress: string;
  event_id: string;
  is_skipped: boolean;
  weight_final: number;
  weight_total: number;
  weight_minimum: any;
  weight_maximum: any;
  working_date: any;
  status: number;
  status_label: string;
  link: string;
  is_scheduled: number;
  is_scheduled_label: string;
  userExam: UserExamType;
};

//export type UserExamType

export type AsesmentType = {
  id: string;
  group: number;
  parent_id: number;
  is_header: any;
  title: string;
  description: string;
  index: number;
  type: number;
  program_type: number;
  level_module: number;
  access_module: null;
  group_label: string;
  program_type_label: string;
  level_module_label: string;
  access_module_label: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
  typeAssesment: TypeAsesment;
  file: FileType;
  assesmentStudent: AsesmentStudent;
};

export type AssesmentTypeResponse = {
  id: string;
  group: any;
  parent_id: any;
  is_header: boolean;
  title: string;
  description: string;
  index: null;
  type: null;
  program_type: number;
  level_module: number;
  access_module: number;
  group_label: null;
  program_type_label: string;
  level_module_label: string;
  access_module_label: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
  event: any;
  assesment: AsesmentType[];
};

export type MaterialContentType = {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
  created_by: number;
  updated_by: number;
  deleted_by: number;
  title: string;
  description: string;
  body_type: number;
  body_type_label: string;
  body_url: string;
  duration: string;
  body_text: string;
  cover: FileType;
  file: FileType;
  progress: MaterialProgressType;
};

export type MaterialProgressType = {
  id: string;
  created_at: string;
  status: number;
  status_label: string;
  duration: any;
  created_by: string;
  updated_by: string;
  deleted_by: string;
};
