export type SeminarType = {
  id: string;
  name: string;
  link: string;
  description: string;
  started_at: string;
  finished_at: string;
  created_at: string;
  status_label: string;
  cover: {
    id: string;
    created_at: string;
    updated_at: string;
    adapter: string;
    filename: string;
    url: string;
    local_url: string;
    height: null;
    width: null;
    size: number;
  };
};
