
import React, { useMemo } from 'react';
import type { Session } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface StatsViewProps {
  sessions: Session[];
}

const getStreak = (sessions: Session[]): number => {
    if (sessions.length === 0) return 0;

    const sessionDates = [...new Set(sessions.filter(s => s.isCompleted).map(s => s.date))].sort();
    if (sessionDates.length === 0) return 0;
    
    let currentStreak = 0;
    let today = new Date();
    today.setHours(0,0,0,0);
    
    // Check if the last session date is today or yesterday to count the streak
    const lastSessionDate = new Date(sessionDates[sessionDates.length - 1]);
    lastSessionDate.setHours(0,0,0,0);

    const diffTime = today.getTime() - lastSessionDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays > 1) {
        return 0; // Streak is broken
    }

    currentStreak = 1;
    for (let i = sessionDates.length - 2; i >= 0; i--) {
        const currentDate = new Date(sessionDates[i+1]);
        const prevDate = new Date(sessionDates[i]);
        currentDate.setHours(0,0,0,0);
        prevDate.setHours(0,0,0,0);

        const dayDiff = (currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24);

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
    const last7Days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return d.toISOString().split('T')[0];
    }).reverse();

    return last7Days.map(date => {
        const daySessions = sessions.filter(s => s.date === date);
        return {
            date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
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
