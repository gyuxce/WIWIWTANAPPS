import { createSlice } from "@reduxjs/toolkit";
import { QuestionSessionType } from "types/ExamTypes";
import type { Character } from "types/ExampleTypes";
import type { AuthType, UserType } from "types/UserTypes";

export type PersistState = {
  character: Character;
  dataLoading: boolean;
  isNewInstall: boolean;
  auth: AuthType;
  user: UserType;
  name_katakana: string;
  wrongAttemptPassword: {
    attempt: number;
    lastTime: number;
    loginTry: number;
  };

  tesBahasa: QuestionSessionType;
  sessionTestBahasa: QuestionSessionType[];
  screenUsage: number;
  language: string;
  pratestMedia: {
    fileId: string;
    timeMilisecond: number;
    sessionId: string;
  };
};

export const persistSlice = createSlice({
  name: "persist",
  initialState: {
    character: {} as Character,
    dataLoading: false,
    isNewInstall: true,
    auth: {} as AuthType,
    user: {} as UserType,
    name_katakana: "" as string,
    wrongAttemptPassword: {
      attempt: 0,
      lastTime: 0,
      loginTry: 0,
    },

    tesBahasa: {} as QuestionSessionType,
    sessionTestBahasa: [] as QuestionSessionType[],
    screenUsage: 0,
    language: "id",
    pratestMedia: {
      fileId: "",
      timeMilisecond: 0,
      sessionId: "",
    },
  } as PersistState,
  reducers: {
    onLoadingGetCharacterData: state => {
      state.dataLoading = true;
    },
    onGetCharacterData: (state, action: { payload: Character }) => {
      state.character = action.payload;
      state.dataLoading = false;
    },
    onNewInstall: (state, action: { payload: boolean }) => {
      state.isNewInstall = action.payload;
    },

    onLogin: (
      state,
      action: { payload: { auth: AuthType; user: UserType } },
    ) => {
      state.auth = action.payload.auth;
      state.user = action.payload.user;
    },
    onSaveKatakana: (state, action: { payload: string }) => {
      state.name_katakana = action.payload;
    },
    onWrongAttemptPassword: (
      state,
      action: {
        payload: {
          wrongAttemptPassword: {
            attempt: number;
            lastTime: number;
            loginTry: number;
          };
        };
      },
    ) => {
      state.wrongAttemptPassword = action.payload.wrongAttemptPassword;
    },

    onGetLanguageTest: (state, action: { payload: QuestionSessionType }) => {
      state.tesBahasa = action.payload;
    },
    onPushTestBahasaSession: (
      state,
      action: { payload: QuestionSessionType[] },
    ) => {
      state.sessionTestBahasa = action.payload;
    },
    onScreenUsage: (state, action: { payload: number }) => {
      state.screenUsage = action.payload;
    },
    onChangeLanguage: (state, action: { payload: string }) => {
      state.language = action.payload;
    },
    onPratestMedia: (
      state,
      action: {
        payload: {
          fileId: string;
          timeMilisecond: number;
          sessionId: string;
        };
      },
    ) => {
      state.pratestMedia = action.payload;
    },
  },
});

export const {
  onLoadingGetCharacterData,
  onGetCharacterData,
  onNewInstall,
  onLogin,
  onWrongAttemptPassword,
  onSaveKatakana,
  onGetLanguageTest,
  onPushTestBahasaSession,
  onScreenUsage,
  onChangeLanguage,
  onPratestMedia,
} = persistSlice.actions;

export default persistSlice.reducer;
