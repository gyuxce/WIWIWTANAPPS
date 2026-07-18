import {
  ExamProgressType,
  ExamScheduleType,
  IntroductionType,
  PostAnswerType,
  PostStatusType,
  PutAnswerType,
  QuestionSessionType,
  TraningModuleProgressType,
} from "types/ExamTypes";
import BaseService from "./BaseService";
import dayjs from "dayjs";
import { convertToQuery } from "utils/Utils";
import { QueryType } from "types/QueryTypes";
import {
  AssesmentTypeResponse,
  VirtualClassModuleType,
} from "types/TrainingTypes";
import { QuestionResponse, UserExamType } from "types/AssesmentTypes";

export const apiExamProgress = (token: string) => {
  return BaseService("/mobile/training/user-exams/progress", token)
    .headers({ Authorization: "Bearer " + token })
    .get() as Promise<{ data: ExamProgressType[] }>;
};

export const apiExamSchedule = (token: string, sessionId: string) => {
  return BaseService(
    `/training/user-exams/${sessionId}?relations=exam_schedules,exam_schedule_active`,
    token,
  )
    .headers({ Authorization: "Bearer " + token })
    .get() as Promise<{ data: ExamScheduleType }>;
};

export const apiSubmitSchedule = (
  token: string,
  sessionId: string,
  scheduleId: string,
) => {
  return BaseService(`/mobile/training/user-exams/schedule/${sessionId}`)
    .headers({ Authorization: "Bearer " + token })
    .json({ user_exam_schedule_id: scheduleId })
    .put() as Promise<{ data: ExamScheduleType; message: string }>;
};

export const apiTrainingModuleProgress = (token: string) => {
  return BaseService("/mobile/training/module/progress", token)
    .headers({ Authorization: "Bearer " + token })
    .get() as Promise<{ data: TraningModuleProgressType[] }>;
};

export const apiGetLessonClass = (token: string, param?: QueryType) => {
  return BaseService(
    "/mobile/training/module/materi/detail?" + convertToQuery(param),
    token,
  )
    .headers({ Authorization: "Bearer " + token })
    .get() as Promise<{ data: any[] }>;
};
export const apiExamQuestion = (token: string, sessionId: string) => {
  return BaseService("/mobile/training/question/" + sessionId)
    .headers({
      Authorization: "Bearer " + token,
    })
    .get() as Promise<{ data: QuestionSessionType }>;
};

export const apiProgressIntroduction = (token: string, type: string) => {
  return BaseService(`/mobile/training/pratest/${type}`, token)
    .headers({ Authorization: "Bearer " + token })
    .get() as Promise<IntroductionType>;
};

export const apiSetSessionBahasa = (token: string, sessionId: string) => {
  return BaseService(`/mobile/training/user-exams/set-session`)
    .headers({ Authorization: "Bearer " + token })
    .json({
      sesi_question_id: sessionId,
      started_at: dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss"),
    })
    .post() as Promise<{ message: string }>;
};

export const apiPostAnswer = (token: string, body: PostAnswerType) => {
  return BaseService(`/mobile/training/question`, token)
    .headers({
      Authorization: "Bearer " + token,
    })
    .json(body)
    .post() as Promise<{ message: string }>;
};

export const apiPutAnswer = (
  token: string,
  body: PutAnswerType,
  questionId: string,
) => {
  return BaseService(`/mobile/training/question/` + questionId, token)
    .headers({
      Authorization: "Bearer " + token,
    })
    .json(body)
    .put() as Promise<{ message: string }>;
};

export const apiExamSetStatus = (token: string, body: PostStatusType) => {
  return BaseService(`/mobile/training/user-exams/set-status`, token)
    .headers({
      Authorization: "Bearer " + token,
    })
    .json(body)
    .post() as Promise<{ message: string }>;
};

export const apiScreenUsage = (token: string, timer: number) => {
  return BaseService(`/mobile/base/users/screentime-usage`, token)
    .headers({
      Authorization: "Bearer " + token,
    })
    .json({ screentime_usage: timer })
    .post();
};

export const apiModuleDetail = (token: string, param?: QueryType) => {
  return BaseService(
    `/mobile/training/module/materi/content?` + convertToQuery(param),
    token,
  )
    .headers({
      Authorization: "Bearer " + token,
    })
    .get();
};

export const apiModuleVirtualClass = (
  token: string,
  category_id: string,
  event_name?: string,
  start_date?: string,
  end_date?: string,
) => {
  return BaseService(
    `/mobile/training/module/materi/virtual-class?` +
      convertToQuery({
        category_id,
        event_name: encodeURIComponent(event_name || ""),
        start_date: start_date || "",
        end_date: end_date || "",
      }),
    token,
  )
    .headers({ Authorization: "Bearer " + token })
    .get() as Promise<{ data: VirtualClassModuleType[] }>;
};

export const apiModuleAssesment = (
  token: string,
  category_id: string,
  start_date?: string,
  end_date?: string,
  start_weight?: string,
  end_weight?: string,
) => {
  return BaseService(
    `/mobile/training/module/materi/assesment?` +
      convertToQuery({
        category_id,
        start_date: start_date || "",
        end_date: end_date || "",
        start_weight: start_weight || "",
        end_weight: end_weight || "",
      }),
    token,
  )
    .headers({ Authorization: "Bearer " + token })
    .get() as Promise<{ data: AssesmentTypeResponse[] }>;
};

export const apiMaterialDetail = (token: string, param?: QueryType) => {
  return BaseService(
    `/mobile/training/module/materi/detail?` + convertToQuery(param),
    token,
  )
    .headers({
      Authorization: "Bearer " + token,
    })
    .get() as Promise<{ data: any }>;
};

export const apiPostStatusMateri = (
  token: string,
  body: { material_content_id: string; duration: string; status: number },
) => {
  return BaseService("/mobile/training/module/materi", token)
    .headers({
      Authorization: "Bearer " + token,
    })
    .json(body)
    .post();
};

export const apiGetAssesment = (token: string, id: string) => {
  return BaseService(
    `/mobile/training/module/materi/assesment/question/${id}`,
    token,
  )
    .headers({
      Authorization: "Bearer " + token,
    })
    .get() as Promise<{
    data: { question: QuestionResponse; userExam: UserExamType };
  }>;
};

export const apiUpdateStatusAssesment = (token: string, id: string) => {
  return BaseService(`/mobile/training/module/update-status`, token)
    .headers({ Authorization: "Bearer " + token })
    .post({ status: 3, id: id });
};
