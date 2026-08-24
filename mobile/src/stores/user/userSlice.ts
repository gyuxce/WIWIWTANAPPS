import { createSlice } from "@reduxjs/toolkit";
import type { SettingType } from "types/ConstantTypes";
import type { UserDocumentsType } from "types/DocTypes";
import type { CityType, ProvinceType, StatusTestType } from "types/UserTypes";

export type UserState = {
  cityData: CityType[];
  provinceData: ProvinceType[];
  statusTest: StatusTestType[];
  userDocs: UserDocumentsType[];
  userAdmin: SettingType[];
};

export const userSlice = createSlice({
  name: "user",
  initialState: {
    cityData: [] as CityType[],
    provinceData: [] as ProvinceType[],
    statusTest: [
      {
        title: "Tes Bakat Bahasa",
        slug: "Pra Tes bahasa",
        detailScreen: "PraTestScreen",
        isChecklist: false,
        status: 0,
      },
      {
        title: "Tes Karakter",
        slug: "Pra Tes karakter",
        detailScreen: "PraTestScreen",
        isChecklist: false,
        status: 0,
      },
      {
        title: "Sesi Tanya Jawab",
        slug: "Pra Tes QNA",
        detailScreen: "FrequentlyAskedQuestion",
        isChecklist: false,
        status: 0,
      },
    ] as StatusTestType[],
    userDocs: [] as UserDocumentsType[],
    userAdmin: {} as SettingType[],
  } as UserState,
  reducers: {
    onGetCityData: (state, action: { payload: CityType[] }) => {
      state.cityData = action.payload;
    },
    onGetProvinceData: (state, action: { payload: ProvinceType[] }) => {
      state.provinceData = action.payload;
    },
    onGetStatusTest: (state, action: { payload: StatusTestType[] }) => {
      state.statusTest = action.payload;
    },
    onGetUserDocs: (state, action: { payload: UserDocumentsType[] }) => {
      state.userDocs = action.payload;
    },
    onGetUserAdmin: (state, action: { payload: SettingType[] }) => {
      state.userAdmin = action.payload;
    },
  },
});

export const {
  onGetCityData,
  onGetProvinceData,
  onGetStatusTest,
  onGetUserDocs,
  onGetUserAdmin,
} = userSlice.actions;

export default userSlice.reducer;
