import dayjs from "dayjs";

export const parseDate = (date: string) => dayjs(date).startOf("day").toDate();
