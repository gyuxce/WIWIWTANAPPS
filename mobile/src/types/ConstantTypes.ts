export type ConstantType = {
  value: number;
  name: string;
};

export type SettingType = {
  id: string;
  name: string;
  slug: string;
  value: string;
  group: string;
  description: string;
};

export const COURSE_TYPE = {
  TEORI: "Teori",
  PRAKTIK: "Praktik",
  SOFT_SKILL: "Soft Skill",
};