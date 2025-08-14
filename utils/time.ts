import type { TimerMode, Settings } from '../types';
import { TimerMode as TimerModeEnum } from '../types';

export function getDuration(mode: TimerMode, settings: Settings): number {
  switch (mode) {
    case TimerModeEnum.WORK:
      return settings.workDuration * 60;
    case TimerModeEnum.SHORT_BREAK:
      return settings.shortBreakDuration * 60;
    case TimerModeEnum.LONG_BREAK:
      return settings.longBreakDuration * 60;
    default:
      return settings.workDuration * 60;
  }
}
