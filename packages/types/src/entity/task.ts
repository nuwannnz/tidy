import { Day } from './dates.js';

export interface BaseTask {
  id: string;
}

export interface Task extends BaseTask {
  title: string;
  description?: string;
  day: Day;
  fullDate: string;
}
