
import React, { useEffect } from 'react';
import type { Task, Settings, TimerStatus } from '../types';
import { TimerMode } from '../types';
import Timer from './Timer';
import BreakSuggestion from './BreakSuggestion';
import TaskItem from './TaskItem';

interface DashboardViewProps {
  tasks: Task[];
  settings: Settings;
  activeTaskId: string | null;
  setActiveTaskId: (id: string | null) => void;
  timerMode: TimerMode;
  setTimerMode: (mode: TimerMode) => void;
  pomodorosInSet: number;
  totalSeconds: number;
  setTotalSeconds: (seconds: number) => void;
  secondsLeft: number;
  setSecondsLeft: (seconds: number) => void;
  timerStatus: TimerStatus;
  setTimerStatus: (status: TimerStatus) => void;
  onSessionComplete: (duration: number, isCompleted: boolean) => void;
}

const DashboardView: React.FC<DashboardViewProps> = ({ tasks, settings, activeTaskId, setActiveTaskId, timerMode, setTimerMode, pomodorosInSet, totalSeconds, setTotalSeconds, secondsLeft, setSecondsLeft, timerStatus, setTimerStatus, onSessionComplete }) => {

  const activeTask = tasks.find(t => t.id === activeTaskId);
  const todayTasks = tasks
    .filter(t => t.isToday && !t.completed)
    .sort((a, b) => a.priority - b.priority);

  useEffect(() => {
    if (!activeTaskId && todayTasks.length > 0) {
      setActiveTaskId(todayTasks[0].id);
    }
  }, [activeTaskId, todayTasks, setActiveTaskId]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <Timer
          settings={settings}
          onSessionComplete={onSessionComplete}
          timerMode={timerMode}
          setTimerMode={setTimerMode}
          pomodorosInSet={pomodorosInSet}
          totalSeconds={totalSeconds}
          setTotalSeconds={setTotalSeconds}
          secondsLeft={secondsLeft}
          setSecondsLeft={setSecondsLeft}
          timerStatus={timerStatus}
          setTimerStatus={setTimerStatus}
        />
        {timerMode !== TimerMode.WORK && <BreakSuggestion />}
      </div>
      <div className="flex flex-col space-y-4">
        <div className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50">
          <h2 className="text-lg font-bold text-white mb-3">
            {activeTask ? 'Current Task' : 'No Active Task'}
          </h2>
          {activeTask ? (
             <div className="p-4 rounded-lg bg-slate-700 border-l-4 border-cyan-400">
                <p className="font-bold text-xl text-white">{activeTask.title}</p>
                <p className="text-slate-300 mt-1">Estimated Pomodoros: {activeTask.pomodoros}</p>
             </div>
          ) : (
             <p className="text-slate-400">Select a task from your 'To-Do Today' list to begin.</p>
          )}
        </div>
        <div className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50 flex-grow">
          <h2 className="text-lg font-bold text-white mb-3">To-Do Today</h2>
          <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
            {todayTasks.length > 0 ? (
              todayTasks.map(task => (
                <TaskItem
                  key={task.id}
                  title={task.title}
                  progress={{ current: task.pomodorosCompleted, total: task.pomodoros }}
                  onClick={() => setActiveTaskId(task.id)}
                  className={`transition-all duration-200 border-l-4 ${
                    task.id === activeTaskId
                      ? 'bg-slate-700/80 border-cyan-400'
                      : 'bg-slate-800 hover:bg-slate-700/50 border-slate-600'
                  }`}
                />
              ))
            ) : (
              <p className="text-slate-400 text-center py-4">No tasks for today. Go to the Tasks page to add some!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;

