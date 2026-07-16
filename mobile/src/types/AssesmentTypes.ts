import { FileType, QuestionType } from "./ExamTypes";

export type QuestionResponse = {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
  created_by: number;
  updated_by: number;
  deleted_by: null;
  index: number;
  is_header: boolean;
  title: string;
  description: string;
  body_type: string;
  body_url: string;
  is_introduction: string;
  language_type: any;
  duration: string;
  count_question: number;
  language_type_label: any;
  file: FileType;
  question: QuestionType[];
};

export type UserExamType = {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
  number: number;
  duration: string;
  requested_at: null;
  scheduled_at: null;
  expired_at: null;
  started_at: null;
  finished_at: null;
  weight_total: string;
  weight_achieved: string;
  status_label: string;
  status: number;
  status_pratest: string;
  jadwal_tersedia: number;
  file_tes_character_status: number;
  link: string;
};
