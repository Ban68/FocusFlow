
export enum Screen {
  DASHBOARD = 'DASHBOARD',
  TASKS = 'TASKS',
  STATS = 'STATS',
  SETTINGS = 'SETTINGS',
}

export enum TimerMode {
  WORK = 'WORK',
  SHORT_BREAK = 'SHORT_BREAK',
  LONG_BREAK = 'LONG_BREAK',
}

export enum TimerStatus {
  RUNNING = 'RUNNING',
  PAUSED = 'PAUSED',
  STOPPED = 'STOPPED',
}

export interface Task {
  id: string;
  title: string;
  isToday: boolean;
  completed: boolean;
  pomodoros: number;
  pomodorosCompleted: number;
}

export interface Session {
  id: string;
  date: string; // YYYY-MM-DD
  duration: number; // in minutes
  isCompleted: boolean;
}

export interface Settings {
  workDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  pomodorosPerSet: number;
  soundOnComplete: boolean;
}
