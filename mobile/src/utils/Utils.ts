import colors from "configs/colors";
import images from "configs/images";
import { t } from "i18next";
import moment from "moment";
import "moment/locale/id";
import { COURSE_TYPE } from "types/ConstantTypes";
import { ExamProgressType } from "types/ExamTypes";
import { StatusTestType } from "types/UserTypes";
moment.locale("id");

export const wait = (timeout: any) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};

export const convertToQuery = (obj: any) => {
  const queryParams = [];

  for (const key in obj) {
    if (obj[key] !== undefined) {
      if (Array.isArray(obj[key])) {
        if (key === "options") {
          // Handle nested arrays within 'options' property
          obj[key].forEach((nestedArray: any, index: number) => {
            queryParams.push(`${key}[]=${nestedArray.join(",")}`);
          });
        } else {
          // Handle other arrays by joining their values with commas
          queryParams.push(`${key}=${obj[key].join(",")}`);
        }
      } else {
        //queryParams.push(`${key}=${encodeURIComponent(obj[key])}`);
        queryParams.push(`${key}=${obj[key]}`);
      }
    }
  }

  return queryParams.join("&");
};

export const formatDate = (date: any | number, format: string) => {
  return moment(date).format(format);
};

export const formatTimestamp = (inputTimestamp: string | any) => {
  const timestamp = new Date(inputTimestamp);

  const currentDate = new Date();

  const timeDifference = Math.floor(
    (currentDate.getTime() - timestamp.getTime()) / (24 * 60 * 60 * 1000),
  );

  if (timeDifference === 0) {
    return `${t("hari_ini")} ${timestamp.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    })} WIB`;
  } else if (timeDifference === 1) {
    return `${t("kemarin")} ${timestamp.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    })} WIB`;
  } else {
    return (
      timestamp.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }) +
      ` di ${timestamp.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      })} WIB`
    );
  }
};

export const isCloseToBottom = ({
  layoutMeasurement,
  contentOffset,
  contentSize,
}: any) => {
  const paddingToBottom = 100;
  return (
    layoutMeasurement.height + contentOffset.y >=
    contentSize.height - paddingToBottom
  );
};

export const isCloseToRight = ({
  layoutMeasurement,
  contentOffset,
  contentSize,
}: any) => {
  const paddingToRight = 50; // Adjust this value as needed
  return (
    layoutMeasurement.width + contentOffset.x >=
    contentSize.width - paddingToRight
  );
};

export const convertTranslation = (translate: any, text: string) => {
  translate("id", "ja", text, {
    type: "google",
    timeout: 10000,
  }).then((result: string) => {
    if (result === "Enter a URL") {
      convertTranslation(translate, text);
    } else {
      return result;
    }
    return "";
  });
};

export const numberToRupiah = (
  number: any,
  label = false,
  locales = "en-US",
) => {
  // locales('en-US', 'id-ID')
  if (label) {
    const formatter = new Intl.NumberFormat(locales, {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0, // Minimum number of decimal places, default 2
      maximumFractionDigits: 4, // Maximum number of decimal places
    });

    return formatter.format(number);
  }

  const formatter = new Intl.NumberFormat(locales, {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  return formatter.format(number);
};

export const getCourseImageAndColor = (type: string) => {
  let data = {
    image: images.classOne,
    color: colors.orange,
  };
  if (type === COURSE_TYPE.PRAKTIK) {
    data = {
      image: images.classTwo,
      color: colors.blue,
    };
  }
  if (type === COURSE_TYPE.SOFT_SKILL) {
    data = {
      image: images.classThree,
      color: colors.yellow,
    };
  }
  return data;
};

export const videoExtensions = [
  "mp4",
  "mkv",
  "avi",
  "mov",
  "wmv",
  "flv",
  "webm",
  "m4v",
  "mpeg",
  "mpg",
  "ogv",
  "3gp",
  "f4v",
];

export const imageExtensions = [
  "jpg",
  "jpeg",
  "png",
  "gif",
  "webp",
  "bmp",
  "heic",
  "heif",
];

export const audioExtensions = [
  "mp3",
  "wav",
  "ogg",
  "flac",
  "aac",
  "m4a",
  "wma",
  "amr",
  "aiff",
  "au",
  "mid",
];

export const millisToTime = (milliseconds: number) => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const hours = Math.floor(minutes / 60);

  return `${hours > 0 ? hours + ":" : ""}${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
};

export const alphabet = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];

export const getStatus = (
  examProgress: ExamProgressType[],
  statusTest: StatusTestType[],
  t: any,
) => {
  return [
    {
      title: t("tes_bahasa"),
      status:
        examProgress?.find(
          (item: ExamProgressType) =>
            item?.progress?.title === statusTest?.[0]?.slug,
        )?.status === null ||
        examProgress?.find(
          (item: ExamProgressType) =>
            item?.progress?.title === statusTest?.[0]?.slug,
        )?.status === 3
          ? 1
          : examProgress?.find(
              (item: ExamProgressType) =>
                item?.progress?.title === statusTest?.[0]?.slug,
            )?.progress.currentSessionLanguage === null
          ? 1
          : 2,
    },
    {
      title: t("tes_karakter"),
      status:
        examProgress?.find(
          (item: ExamProgressType) =>
            item?.progress?.title === statusTest?.[1]?.slug,
        )?.status === 1
          ? 2
          : examProgress?.find(
              (item: ExamProgressType) =>
                item?.progress?.title === statusTest?.[1]?.slug,
            )?.status === null
          ? 0
          : 1,
    },
    {
      title: t("tes_tanya_jawab"),
      status:
        examProgress?.find(
          (item: ExamProgressType) =>
            item?.progress?.title === statusTest?.[2]?.slug,
        )?.status === 3
          ? 1
          : examProgress?.find(
              (item: ExamProgressType) =>
                item?.progress?.title === statusTest?.[2]?.slug,
            )?.status === 3
          ? 0
          : examProgress?.find(
              (item: ExamProgressType) =>
                item?.progress?.title === statusTest?.[2]?.slug,
            )?.status === null
          ? 0
          : 2,
    },
  ];
};

export const debounce = (func: any, delay: any) => {
  //@ts-ignore
  let timer;
  //@ts-ignore
  return (...args) => {
    //@ts-ignore
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
};

export const capitalizeFirst = (text: string) => {
  if (text.length > 0) {
    return text.charAt(0).toUpperCase() + text.slice(1);
  } else {
    return text;
  }
};
