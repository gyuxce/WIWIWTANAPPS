import {
  createStore,
  combineReducers,
  applyMiddleware,
  AnyAction,
  CombinedState,
} from "redux";
import { persistReducer as pReducer, persistStore } from "redux-persist";
import thunk from "redux-thunk";
import logger from "redux-logger";
import AsyncStorage from "@react-native-async-storage/async-storage";

import type { PersistState } from "./persist/persistSlice";
import persist from "./persist/persistSlice";
import type { ErrorState, ErrorType } from "./error/errorSlice";
import error from "./error/errorSlice";
import type { UserState } from "./user/userSlice";
import user from "./user/userSlice";
import type { ConstantState } from "./constant/constantSlice";
import constant from "./constant/constantSlice";
import type { ForumState } from "./forum/forumSlice";
import forum from "./forum/forumSlice";
import type { SeminarState } from "./seminar/seminarSlice";
import seminar from "./seminar/seminarSlice";
import type { AppState as appState } from "./app/appSlice";
import app from "./app/appSlice";
import type { NotificationState } from "./notification/notificationSlice";
import notification from "./notification/notificationSlice";
import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2";
import { ExamState } from "./exam/examSlice";
import exam from "./exam/examSlice";
import { PaymentState } from "./payment/paymentSlice";
import payment from "./payment/paymentSlice";
import { CertificationState } from "./certification/certificationSlice";
import certification from "./certification/certificationSlice";
import { InterviewState } from "./interview/interviewSlice";
import interview from "./interview/interviewSlice";
import { TrainingState } from "./training/trainingSlices";
import training from "./training/trainingSlices";

export interface StoreStateType {
  persist: PersistState;
  error: ErrorState;
  user: UserState;
  constant: ConstantState;
  forum: ForumState;
  seminar: SeminarState;
  app: appState;
  notification: NotificationState;
  exam: ExamState;
  payment: PaymentState;
  certification: CertificationState;
  interview: InterviewState;
  training: TrainingState;
}

const rootReducer = combineReducers({
  persist,
  error,
  user,
  constant,
  forum,
  seminar,
  app,
  notification,
  exam,
  payment,
  certification,
  interview,
  training,
});

export const resetAllState = () => ({
  type: "RESET_ALL_STATE",
});

const rootReducerWithReset = (
  state:
    | CombinedState<{
        persist: PersistState;
        error: { error: ErrorType };
        user: UserState;
        constant: ConstantState;
        forum: ForumState;
        seminar: SeminarState;
        app: appState;
        notification: NotificationState;
        exam: ExamState;
        payment: PaymentState;
        certification: CertificationState;
        interview: InterviewState;
        training: TrainingState;
      }>
    | undefined,
  action: AnyAction,
) => {
  if (action.type === "RESET_ALL_STATE") {
    // Create a new state object with initial state for each slice
    const initialState = rootReducer(undefined, {
      type: undefined,
    });

    return initialState;
  }

  return rootReducer(state, action);
};

export type AppState = ReturnType<typeof rootReducerWithReset>;

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  version: 3,
  whitelist: ["persist"], // select reducer to persist
  stateReconciler: autoMergeLevel2,
};

//@ts-ignore
const persistedReducer = pReducer(persistConfig, rootReducerWithReset);

const store = createStore(persistedReducer, applyMiddleware(thunk, logger));
const persistor = persistStore(store);

export { store, persistor };
