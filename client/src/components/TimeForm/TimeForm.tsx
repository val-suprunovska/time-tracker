import React from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { CalendarIcon, Clock4 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { AxiosError } from "axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useTimeStore } from "@/store/timeStore";
import { PROJECTS, type Project } from "@/types/time-entry";

interface FormValues {
  date: Date;
  project: Project;
  hours: number;
  description: string;
}

export const TimeForm: React.FC = () => {
  const { createEntry, fetchEntries } = useTimeStore();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  const form = useForm<FormValues>({
    defaultValues: {
      date: new Date(),
      project: PROJECTS[0],
      hours: 0,
      description: "",
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const isAxiosError = (
    error: unknown
  ): error is AxiosError<{ message: string }> => {
    return (
      typeof error === "object" &&
      error !== null &&
      "response" in error &&
      error.response !== undefined
    );
  };

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await createEntry({
        date: values.date.toISOString(),
        project: values.project,
        hours: values.hours,
        description: values.description,
        updatedAt: "",
      });

      // Сброс формы
      form.reset({
        date: new Date(),
        project: PROJECTS[0],
        hours: 0,
        description: "",
      });

      fetchEntries();
    } catch (err: unknown) {
      let message = "Failed to save entry";
      console.log("Full error:", JSON.stringify(err));

      // Проверяем, что это AxiosError
      if (err ) {
        const error = err as AxiosError<{
          success?: boolean;
          message?: string;
          error?: string;
        }>;

        // Вариант 1: проверяем поле message
        if (error.response?.data?.message) {
          message = error.response.data.message;
        }
        // Вариант 2: проверяем поле error (если сервер возвращает в error)
        else if (error.response?.data?.error) {
          message = error.response.data.error;
        }
        // Вариант 3: общая ошибка от axios
        else if (error.message) {
          message = error.message;
        }
      }

      setSubmitError(message);
      console.error("Error saving entry:", err);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock4 className="h-5 w-5" />
          Add Time Entry
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Date */}
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn("w-full pl-3 text-left font-normal")}
                        >
                          {field.value
                            ? format(field.value, "PPP")
                            : "Pick a date"}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                      />
                    </PopoverContent>
                  </Popover>
                </FormItem>
              )}
            />

            {/* Project */}
            <FormField
              control={form.control}
              name="project"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a project" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {PROJECTS.map((project) => (
                        <SelectItem key={project} value={project}>
                          {project}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            {/* Hours */}
            <FormField
              control={form.control}
              name="hours"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hours</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.5"
                      value={field.value}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value))
                      }
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Work description..." />
                  </FormControl>
                </FormItem>
              )}
            />

            {submitError && (
              <div className="p-3 bg-red-100 text-red-700 rounded">
                {submitError}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Entry"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
