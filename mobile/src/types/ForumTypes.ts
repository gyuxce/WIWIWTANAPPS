import type { UserType } from "./UserTypes";

export type ForumTopicType = {
  id: string;
  name: string;
  description: string;
  type: number;
  type_label: string;
  count_post: number;
  created_at: string;
  updated_at: string;
};

export type ForumPostType = {
  id: string;
  title: string;
  description: string;
  index: null;
  is_draft: number;
  is_publish: number;
  count_like: number;
  count_comment: number;
  count_report: number;
  created_at: string;
  updated_at: string;
  user: UserType;
  topic: ForumTopicType;
  is_like_by_user: boolean;
  like: LikeType;
};

export type PostForumType = {
  title: string;
  description: string;
  user_id: string;
  topic_id: string;
  is_draft: number;
  is_publish: number;
  status?: string;
  scheduled_at?: string;
};

export type HarshWordType = {
  id: string;
  name: string;
};

export type LikeType = {
  id: string;
  description: string;
  created_at: string;
  updated_at: string;
};
