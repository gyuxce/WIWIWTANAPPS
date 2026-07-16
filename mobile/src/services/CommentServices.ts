import type { QueryType } from "types/QueryTypes";
import { convertToQuery } from "utils/Utils";
import type { CommentType } from "types/CommentTypes";
import type { MetaTypes } from "types/MetaTypes";

import BaseService from "./BaseService";

//user,child -> relations
export const apiGetCommentList = (token: string, param?: QueryType) => {
  return BaseService(
    "/mobile/forum/comments?" + convertToQuery(param),
    token,
  ).get() as Promise<{ data: CommentType[]; meta: MetaTypes }>;
};

export const apiPostComment = (
  token: string,
  comment: string,
  post_id: string,
  parent_id = "",
) => {
  return BaseService("/mobile/forum/comments?relations=user%2Cchild", token)
    .headers({ Authorization: "Bearer " + token })
    .json({ comment: comment, post_id: post_id, parent_id: parent_id })
    .post() as Promise<{ data: any }>;
};

export const apiPutComment = (
  token: string,
  comment: string,
  post_id: string,
  parent_id = "",
  comment_id = "",
) => {
  return BaseService(
    `/mobile/forum/comments/${comment_id}?relations=user%2Cchild`,
    token,
  )
    .headers({ Authorization: "Bearer " + token })
    .json({ comment: comment, post_id: post_id, parent_id: parent_id })
    .put() as Promise<{ data: any }>;
};

export const apiDeleteComment = (token: string, commentId: string) => {
  return BaseService(`/mobile/forum/comments/${commentId}`, token)
    .headers({ Authorization: "Bearer " + token })
    .delete() as Promise<{ success: boolean }>;
};
