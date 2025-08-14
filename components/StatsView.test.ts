import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getStreak } from './StatsView';
import type { Session } from '../types';

const createSessions = (dates: string[]): Session[] =>
  dates.map((date, idx) => ({ id: String(idx), date, duration: 25, isCompleted: true }));

describe('getStreak timezone handling', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('calculates streak correctly in UTC timezone', () => {
    process.env.TZ = 'UTC';
    vi.setSystemTime(new Date('2024-01-03T00:00:00'));
    const sessions = createSessions(['2024-01-01', '2024-01-02', '2024-01-03']);
    expect(getStreak(sessions)).toBe(3);
  });

  it('calculates streak correctly in America/Los_Angeles timezone', () => {
    process.env.TZ = 'America/Los_Angeles';
    vi.setSystemTime(new Date('2024-01-03T00:00:00'));
    const sessions = createSessions(['2024-01-01', '2024-01-02', '2024-01-03']);
    expect(getStreak(sessions)).toBe(3);
  });
});
