import dayjs from 'dayjs';
import 'dayjs/locale/id';

export const numberToRupiah = (number, label = false) => {
  if (label) {
    const formatter = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0, // Minimum number of decimal places
      maximumFractionDigits: 0, // Maximum number of decimal places
    });

    return formatter.format(number);
  }

  const formatter = new Intl.NumberFormat('id-ID', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  return formatter.format(number).replace(/,/g, '.');
};

export const handleChangeNumber = (val) => {
  const rawValue = val.replace(/\D/g, '');
  return Number(rawValue) || 0;
};

export const formatPhoneNumber = (phoneNumber) => {
  const cleaned = phoneNumber.replace(/\D/g, '');

  if (cleaned.length >= 12) {
    return `${cleaned.substring(0, 4)}-${cleaned.substring(4)}`;
  } else if (cleaned.length === 10) {
    return `(${cleaned.substring(0, 3)})-${cleaned.substring(3)}`;
  } else if (cleaned.length === 11) {
    return `(${cleaned.substring(0, 4)})-${cleaned.substring(4)}`;
  } else {
    return cleaned;
  }
};

export function formatDate(date) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatDateDMY(date) {
  const dmy = date ? dayjs(date).format('D MMM YYYY') : '-';
  return dmy;
}

export function formatDateFullDMY(date, local = undefined) {
  const dmy = date ? dayjs(date).local(local).format('D MMMM YYYY') : '-';
  return dmy;
}

export function formatDateTime(date, local = undefined) {
  const dmy = date ? dayjs(date).local(local).format('D MMMM YYYY HH:mm:ss') : '-';
  return dmy;
}

export function formatTime(date) {
  const dmy = date ? dayjs(date).format('HH:mm:ss') : '-';
  return dmy;
}

export function countProgress(data = []) {
  let total = 0;
  for (let index = 0; index < data.length; index++) {
    total += parseFloat(data[index]) || 0;
  }
  const percent = total / data.length;

  return parseFloat(percent.toFixed(2)) || '0';
}

export function countResult(result, total = 0) {
  let val = 0;
  if (total > 0) {
    val = (result / total) * 100;
  }

  return parseFloat(val.toFixed(2)) || '0';
}
