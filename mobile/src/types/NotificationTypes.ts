import type { UserType } from "./UserTypes";

export type ForumNotificationTypes = {
  id: string;
  category: string;
  title: string;
  body: string;
  priority: number;
  status: string;
  data: {
    module: string;
    comment: string;
    post_id: string;
    comment_id: null;
  };
  user: UserType;
  created_at: string;
};

export type ForYouNotificationTypes = {
  id: string;
  category: string;
  title: string;
  body: string;
  priority: number;
  status: string;
  data: {
    module: string;
    module_id: string;
    title: string;
  };
  user: UserType;
  created_at: string;
};
