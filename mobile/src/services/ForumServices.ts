import type { QueryType } from "types/QueryTypes";
import { convertToQuery } from "utils/Utils";
import type {
  ForumPostType,
  ForumTopicType,
  HarshWordType,
  LikeType,
  PostForumType,
} from "types/ForumTypes";
import type { MetaTypes } from "types/MetaTypes";

import BaseService from "./BaseService";

export const apiTopicType = (token: string, param?: QueryType) => {
  return BaseService(
    "/mobile/forum/topics?" + convertToQuery(param),
    token,
  ).get() as Promise<{ data: ForumTopicType[] }>;
};

export const apiMyForumPost = (token: string, param?: QueryType) => {
  return BaseService(
    "/mobile/forum/my-posts?" + convertToQuery(param),
    token,
  ).get() as Promise<{ data: ForumPostType[]; meta: MetaTypes }>;
};

export const apiForumPostPublic = (token: string, param?: QueryType) => {
  return BaseService("/public/forum/posts?" + convertToQuery(param), token)
    .headers({ Authorization: "Bearer " + token })
    .get() as Promise<{ data: ForumPostType[]; meta: MetaTypes }>;
};
export const apiForumPost = (token: string, param?: QueryType) => {
  return BaseService("/mobile/forum/posts?" + convertToQuery(param), token)
    .headers({ Authorization: "Bearer " + token })
    .get() as Promise<{ data: ForumPostType[]; meta: MetaTypes }>;
};

export const apiPostForumPost = (token: string, body: PostForumType) => {
  return BaseService("/mobile/forum/posts", token)
    .headers({ Authorization: "Bearer " + token })
    .json(body)
    .post() as Promise<{ data: ForumPostType }>;
};

export const apiPutForumPost = (
  token: string,
  body: PostForumType,
  id: string,
) => {
  return BaseService("/mobile/forum/posts/" + id, token)
    .headers({ Authorization: "Bearer " + token })
    .json(body)
    .put() as Promise<{ data: ForumPostType }>;
};

export const apiGetHarshWord = (token: string, param?: QueryType) => {
  return BaseService(
    "/base/harsh-words?" + convertToQuery(param),
    token,
  ).get() as Promise<{ data: HarshWordType[] }>;
};

export const apiGetForumDetail = (token: string, id: string) => {
  return BaseService(
    `/mobile/forum/posts/${id}?relations=user%2Ctopic,user.profilePicture`,
    token,
  ).get() as Promise<{ data: ForumPostType }>;
};

export const apiDeleteForumDetail = (token: string, id: string) => {
  return BaseService(`/mobile/forum/posts/${id}`, token)
    .headers({ Authorization: "Bearer " + token })
    .delete() as Promise<{ success: boolean }>;
};

export const apiPostReportPost = (
  token: string,
  body: {
    notes: string;
    post_id?: string;
    type: number;
    comment_id?: string;
    status: string;
  },
) => {
  return BaseService("/mobile/forum/reports", token)
    .headers({ Authorization: "Bearer " + token })
    .json(body)
    .post() as Promise<{ data: any }>;
};

export const apiForumLike = (
  token: string,
  body: { post_id?: string; comment_id?: string; description?: string },
) => {
  return BaseService("/mobile/forum/likes", token)
    .headers({ Authorization: "Bearer " + token })
    .json(body)
    .post() as Promise<{ data: LikeType }>;
};

export const apiForumDislike = (token: string, id: string) => {
  return BaseService(`/mobile/forum/likes/` + id, token)
    .headers({
      Authorization: "Bearer " + token,
    })
    .delete() as Promise<{ success: boolean }>;
};
