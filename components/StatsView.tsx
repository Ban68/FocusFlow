
import React, { useMemo } from 'react';
import type { Session } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface StatsViewProps {
  sessions: Session[];
}

const DAY_MS = 24 * 60 * 60 * 1000;

const toUTC = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-').map(Number);
    return Date.UTC(year, month - 1, day);
};

export const getStreak = (sessions: Session[], current: Date = new Date()): number => {
    if (sessions.length === 0) return 0;

    const sessionDates = [...new Set(sessions.filter(s => s.isCompleted).map(s => s.date))].sort();
    if (sessionDates.length === 0) return 0;

    const todayUTC = Date.UTC(current.getUTCFullYear(), current.getUTCMonth(), current.getUTCDate());

    const lastSessionUTC = toUTC(sessionDates[sessionDates.length - 1]);
    const diffDays = (todayUTC - lastSessionUTC) / DAY_MS;

    if (diffDays > 1) {
        return 0; // Streak is broken
    }

    let currentStreak = 1;
    for (let i = sessionDates.length - 2; i >= 0; i--) {
        const currentDate = toUTC(sessionDates[i + 1]);
        const prevDate = toUTC(sessionDates[i]);
        const dayDiff = (currentDate - prevDate) / DAY_MS;

        if (dayDiff === 1) {
            currentStreak++;
        } else {
            break;
        }
    }

    return currentStreak;
};

const StatsView: React.FC<StatsViewProps> = ({ sessions }) => {
  const data = useMemo(() => {
    const today = new Date();
    const todayUTC = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());

    const last7Days = Array.from({ length: 7 }, (_, i) => {
        const dateUTC = todayUTC - i * DAY_MS;
        return new Date(dateUTC).toISOString().split('T')[0];
    }).reverse();

    return last7Days.map(date => {
        const daySessions = sessions.filter(s => s.date === date);
        return {
            date: new Date(toUTC(date)).toLocaleDateString('en-US', { weekday: 'short' }),
            Completed: daySessions.filter(s => s.isCompleted).length,
            Voided: daySessions.filter(s => !s.isCompleted).length,
        };
    });
  }, [sessions]);
  
  const totalCompleted = sessions.filter(s => s.isCompleted).length;
  const totalMinutes = sessions.filter(s => s.isCompleted).reduce((acc, s) => acc + s.duration, 0);
  const streak = getStreak(sessions);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 bg-slate-800/50 rounded-2xl border border-slate-700/50 text-center">
          <p className="text-4xl font-bold text-cyan-400">{totalCompleted}</p>
          <p className="text-slate-300 mt-1">Total Pomodoros</p>
        </div>
        <div className="p-6 bg-slate-800/50 rounded-2xl border border-slate-700/50 text-center">
          <p className="text-4xl font-bold text-cyan-400">{Math.round(totalMinutes / 60)}<span className="text-2xl">hr</span> {totalMinutes % 60}<span className="text-2xl">m</span></p>
          <p className="text-slate-300 mt-1">Total Focus Time</p>
        </div>
        <div className="p-6 bg-slate-800/50 rounded-2xl border border-slate-700/50 text-center">
          <p className="text-4xl font-bold text-cyan-400">{streak} 🔥</p>
          <p className="text-slate-300 mt-1">Productivity Streak</p>
        </div>
      </div>
      <div className="p-6 bg-slate-800/50 rounded-2xl border border-slate-700/50">
        <h2 className="text-xl font-bold text-white mb-4">Weekly Activity</h2>
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                    <XAxis dataKey="date" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" allowDecimals={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }} />
                    <Legend wrapperStyle={{ color: '#e2e8f0' }} />
                    <Bar dataKey="Completed" fill="#22d3ee" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Voided" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default StatsView;
