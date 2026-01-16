import { z } from "zod";
import { TimeEntryInput } from "../types/timeEntry";
import { ApiError } from "../errors/ApiError";

const timeEntrySchema = z.object({
  date: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date" }),
  project: z.string().min(1, "Project is required"),
  hours: z.number().positive("Hours must be positive"),
  description: z.string().min(1, "Description is required"),
});

export const validateTimeEntry = (data: any): TimeEntryInput => {
  const result = timeEntrySchema.safeParse(data);

  if (!result.success) {
    const messages = result.error.issues.map(issue => issue.message);
    throw new ApiError(400, messages.join(", "));
  }

  return result.data;
};
