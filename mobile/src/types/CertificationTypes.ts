import { FileType } from "./ExamTypes";

export type CertificationListType = {
  id: string;
  name: string;
  detail: string;
  description: string;
  link: string;
  status: number;
  status_label: string;
  created_at: string;
};

export type CertificationUserType = {
  id: string;
  name: string;
  cert_date: string;
  location: string;
  status: number;
  status_label: string;
  percent: number;
  file: FileType;
  created_at: string;
  updated_at: string;
};
