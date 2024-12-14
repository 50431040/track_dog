import dayjs from "dayjs";

export const transformToISOString = (date: Date) => {
  return new Date(dayjs(date).format("YYYY-MM-DD 00:00:00")).toISOString();
};
