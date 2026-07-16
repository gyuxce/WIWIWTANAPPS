import type { Dayjs } from "dayjs";
import type { ImageSourcePropType } from "react-native";

export interface DateProps {
  today?: boolean;
  date: Dayjs;
  currentMonth: boolean;
  event: EventProps[];
}

export interface EventProps {
  date: string;
  headerTitle: string;
  title: string;
  type: "theory" | "pratical" | "softSkill";
  image?: ImageSourcePropType | null;
  numberEvent: string;
  description: string;
  link?: string;
  urlFile?: string;
  btnTitle?: string;
}
