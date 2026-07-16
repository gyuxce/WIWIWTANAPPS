import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday";
import isBetween from "dayjs/plugin/isBetween";

dayjs.extend(weekday);
dayjs.extend(isBetween);

export const generateDate = (
  month = dayjs().month(),
  year = dayjs().year(),
) => {
  const firstDateOfMonth = dayjs().year(year).month(month).startOf("month");
  const lastDateOfMonth = dayjs().year(year).month(month).endOf("month");
  const arrayOfDate = [];

  dayjs.locale("en", {
    weekStart: 1,
  });

  // create prefix date
  for (let i = 0; i < firstDateOfMonth.weekday(); i++) {
    const date = firstDateOfMonth.subtract(i + 1, "day");

    arrayOfDate.unshift({
      currentMonth: false,
      date,
    });
  }

  // generate current date
  for (let i = firstDateOfMonth.date(); i <= lastDateOfMonth.date(); i++) {
    const date = firstDateOfMonth.date(i);

    arrayOfDate.push({
      currentMonth: true,
      date,
      today: date.isSame(dayjs(), "day"),
    });
  }

  const remaining = 42 - arrayOfDate.length;

  // create postfix date
  for (let i = 1; i <= remaining; i++) {
    const date = lastDateOfMonth.add(i, "day");

    arrayOfDate.push({
      currentMonth: false,
      date,
    });
  }

  return arrayOfDate;
};

export const months = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

export const days = ["S", "S", "R", "K", "J", "S", "M"];
