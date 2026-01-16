export const PROJECTS = [
  'Viso Internal',
  'Client A', 
  'Client B',
  'Personal Development'
] as const;

export type Project = typeof PROJECTS[number];

export function isValidProject(value: string): value is Project {
  return PROJECTS.includes(value as Project);
}

export interface TimeEntry {
  id: string;
  date: string;
  project: Project;
  hours: number;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTimeEntryDto {
  date: string;
  project: Project;
  hours: number;
  description: string;
}

export interface GroupedEntries {
  [date: string]: TimeEntry[];
}