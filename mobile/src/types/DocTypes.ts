export type DocDataType = {
  label: string;
  slug: string;
  status?: string;
  allowUpload?: boolean;
  uploadText?: string;
  isRequired?: boolean;
  value?: any;
};

export type DocType = {
  id: string;
  title: string;
  data: DocDataType;
};

export type UserDocumentsType = {
  id: string;
  description: string;
  status: number;
  status_label: string;
  slug: string;
  type: 1;
  type_label: string;
  file: {
    id: string;
    adapter: string;
    filename: string;
    url: string;
    local_url: string;
  };
};
