import { PrismaClient } from "../../prisma/generated/prisma/client";

import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

import dayjs from "dayjs";
import { TimeEntryInput } from "../types/timeEntry";
import { ApiError } from "../errors/ApiError";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

export const getAllEntries = async (date?: string) => {
  const where = date ? { date: dayjs(date).startOf("day").toDate() } : {};
  return prisma.timeEntry.findMany({
    where,
    orderBy: { date: "desc" },
  });
};

export const createEntry = async (data: TimeEntryInput) => {
  await checkDailyLimit(data.date, data.hours);

  return prisma.timeEntry.create({
    data,
  });
};

export const updateEntry = async (id: string, data: TimeEntryInput) => {
  await checkDailyLimit(data.date, data.hours, id);

  return prisma.timeEntry.update({
    where: { id },
    data,
  });
};

export const deleteEntry = async (id: string) => {
  return prisma.timeEntry.delete({ where: { id } });
};

// Проверка лимита 24 часа в день
const checkDailyLimit = async (
  date: string,
  hours: number,
  excludeId?: string
) => {
  const start = dayjs(date).startOf("day").toDate();
  const end = dayjs(date).endOf("day").toDate();

  const entries = await prisma.timeEntry.findMany({
    where: {
      date: { gte: start, lte: end },
      id: excludeId ? { not: excludeId } : undefined,
    },
  });

  const total = entries.reduce((sum: number, e) => sum + e.hours, 0);

  if (total + hours > 24) {
    throw new ApiError(
      400,
      `Daily hours limit exceeded. Current total: ${total}, trying to add: ${hours}`
    );
  }
};
