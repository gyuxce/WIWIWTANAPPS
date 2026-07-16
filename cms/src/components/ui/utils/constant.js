export const SIZES = {
  XS: 'xs',
  SM: 'sm',
  MD: 'md',
  LG: 'lg',
  CUSTOME: 'custome',
  BASE: 'bs',
};

export const CONTROL_SIZES = {
  [SIZES.XS]: 7,
  [SIZES.SM]: 9,
  [SIZES.BASE]: 10,
  [SIZES.MD]: 10,
  [SIZES.LG]: 14,
};

export const LAYOUT = {
  HORIZONTAL: 'horizontal',
  VERTICAL: 'vertical',
  INLINE: 'inline',
};

export const DIRECTIONS = {
  TOP: 'top',
  RIGHT: 'right',
  BOTTOM: 'bottom',
  LEFT: 'left',
};

export const SELECTION_MODES = {
  YEAR: 'year',
  MONTH: 'month',
  DAY: 'day',
};

export const PICKER_VIEWS = {
  YEAR: 'year',
  MONTH: 'month',
  DATE: 'date',
};

export const STATUS = {
  DANGER: 'danger',
  SUCCESS: 'success',
  WARNING: 'warning',
};

export const STEPS_STATUS = {
  COMPLETE: 'complete',
  PENDING: 'pending',
  IN_PROGRESS: 'in-progress',
  ERROR: 'error',
};

export const PLACEMENT = {
  TOP_START: 'top-start',
  TOP_CENTER: 'top-center',
  TOP_END: 'top-end',
  BOTTOM_START: 'bottom-start',
  BOTTOM_CENTER: 'bottom-center',
  BOTTOM_END: 'bottom-end',
  MIDDLE_START_TOP: 'middle-start-top',
  MIDDLE_START_BOTTOM: 'middle-start-bottom',
  MIDDLE_END_TOP: 'middle-end-top',
  MIDDLE_END_BOTTOM: 'middle-end-bottom',
};

export const DROPDOWN_ITEM_TYPE = {
  DEFAULT: 'default',
  HEADER: 'header',
  DIVIDER: 'divider',
  CUSTOM: 'custom',
};

export const DAY_DURATION = 86400000;

export const OPTION_PLAT_TYPE = [
  {
    value: 0,
    label: 'Hitam',
  },
  {
    value: 1,
    label: 'Kuning',
  },
];

export const OPTION_CUSTOMER_TYPE = [
  {
    value: 0,
    label: 'Corporate',
  },
  {
    value: 1,
    label: 'Individual',
  },
];

export const OPTION_STATUS_MASTER_DATA = [
  {
    value: 1,
    label: 'Aktif',
  },
  {
    value: 0,
    label: 'Tidak Aktif',
  },
];

export const OPTION_STATUS_NOTIFICATION = [
  {
    value: 0,
    label: 'Menunggu',
  },
  {
    value: 1,
    label: 'Terkirim',
  },
];

export const OPTION_GENDER = [
  {
    value: 0,
    label: 'Female',
  },
  {
    value: 1,
    label: 'Male',
  },
];

export const OPTION_CATEGORY_MASTER_DATA = [
  {
    value: 1,
    label: 'External',
  },
  {
    value: 0,
    label: 'Internal',
  },
];

export const OPTION_TIME_RANGE_MASTER_DATA = [
  {
    value: 1,
    label: 'Last 7 days ago',
  },
  {
    value: 2,
    label: 'Last 14 days ago',
  },
  {
    value: 3,
    label: 'Last 1 month ago',
  },
  {
    value: 4,
    label: 'Last 3 months ago',
  },
  {
    value: 5,
    label: 'Last 6 months ago',
  },
  {
    value: 6,
    label: 'Last year ago',
  },
];

export const filterForumConstant = [
  {
    label: 'Trending',
    value: 'count_comment,desc',
  },
  {
    label: 'Populer',
    value: 'count_like,desc',
  },
  {
    label: 'Terbaru',
    value: 'created_at,desc',
  },
  {
    label: 'Terlama',
    value: 'created_at,asc',
  },
];

export const pageConstant = [
  { value: 10, label: '10 / page' },
  { value: 25, label: '25 / page' },
  { value: 50, label: '50 / page' },
  { value: 100, label: '100 / page' },
];

export const STATUS_PRA_LANGUAGE = [
  {
    value: 2,
    label: 'Menuggu Tes',
  },
  {
    value: 1,
    label: 'Selesai',
  },
];

export const STATUS_PRA_CHARACTER = [
  {
    value: 3,
    label: 'Menuggu Hasil',
  },
  {
    value: 1,
    label: 'Selesai',
  },
];

export const STATUS_PRA_TEST_QNA = [
  {
    value: 0,
    label: '0/2 Selesai',
  },
  {
    value: 1,
    label: '1/2 Selesai',
  },
  {
    value: 2,
    label: '2/2 Selesai',
  },
];

export const STATUS_USER_EXAM = {
  SELESAI: 1,
  MENUNGGU_TEST: 2,
  MENUNGGU_HASIL: 3,
  MENUNGGU: 4,
  LULUS: 5,
  TIDAK_LULUS: 6,
  MENUNGGU_QNA: 7,
};

export const STATUS_USER_EXAM_OPTION = [
  {
    value: 1,
    label: 'Selesai',
  },
  {
    value: 2,
    label: 'Menunggu Test',
  },
  {
    value: 3,
    label: 'Menunggu Hasil',
  },
  {
    value: 5,
    label: 'Lulus',
  },
  {
    value: 6,
    label: 'Tidak Lulus',
  },
  {
    value: 7,
    label: 'Menunggu',
  },
];

export const TYPE_CATEGORY_MODUL = [
  {
    value: 1,
    label: 'Teori',
    color: 'bg-red-400',
  },
  {
    value: 2,
    label: 'Praktik',
    color: 'bg-sky-500',
  },
  {
    value: 3,
    label: 'Soft Skill',
    color: 'bg-amber-400',
  },
];

export const STATUS_CERTIFICATION_TITLE = {
  LULUS: 1,
  MENUNGGU: 2,
  TIDAK_LULUS: 3,
};

export const STATUS_CERTIFICATION = [
  {
    value: 1,
    label: 'Lulus',
  },
  {
    value: 2,
    label: 'Menunggu',
  },
  {
    value: 3,
    label: 'Tidak Lulus',
  },
];

export const TYPE_CERTIFICATION = [
  {
    value: 'JLPT',
    label: 'JLPT',
  },
  {
    value: 'Nat-Test',
    label: 'Nat-Test',
  },
  {
    value: 'JFT',
    label: 'JFT',
  },
];

export const TRAINING_PROGRAM = [
  {
    value: 'TITP',
    label: 'TITP',
  },
  {
    value: 'SSW',
    label: 'SSW',
  },
];
export const INTERVIEW_STATUS = [
  {
    value: 2,
    label: 'Menuggu',
  },
  {
    value: 1,
    label: 'Lulus',
  },
];

export const STATUS_WAWANCARA = [
  {
    value: 0,
    label: 'Menunggu',
  },
  {
    value: 1,
    label: 'Lulus',
  },
  {
    value: 2,
    label: 'Tidak Lulus',
  },
];

export const TUJUAN_WAWANCARA = [
  {
    value: 1,
    label: 'Persiapan',
  },
  {
    value: 2,
    label: 'Wawancara Kerja',
  },
];

export const QUESTION_TYPE = [
  {
    value: 1,
    label: 'Pilihan Ganda (Bobot di Soal)',
  },
  {
    value: 2,
    label: 'Pilihan Ganda (Bobot di Opsi Jawaban)',
  },
  {
    value: 3,
    label: 'Membaca',
  },
  {
    value: 6,
    label: 'Menulis',
  },
  {
    value: 4,
    label: 'Rekam Audio',
  },
];

export const COURSE_GROUP = {
  MATERIAL: 1,
  CLASS: 2,
  ASSESMENT: 3,
};
