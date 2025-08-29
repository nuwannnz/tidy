import { Day } from '../entity/dates.js';

export interface CreateTaskDto {
  title: string;
  description?: string;
  day: Day;
  fullDate: string;
}
