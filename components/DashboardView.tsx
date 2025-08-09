
import React, { useState, useEffect, useCallback } from 'react';
import type { Task, Settings, Session } from '../types';
import { TimerMode } from '../types';
import Timer from './Timer';
import BreakSuggestion from './BreakSuggestion';

interface DashboardViewProps {
  tasks: Task[];
  settings: Settings;
  addSession: (session: Omit<Session, 'id'>) => void;
  activeTaskId: string | null;
  setActiveTaskId: (id: string | null) => void;
  completePomodoroForTask: (taskId: string) => void;
}

const TaskItem: React.FC<{ task: Task; isActive: boolean; onClick: (id: string) => void }> = ({ task, isActive, onClick }) => (
  <div
    onClick={() => onClick(task.id)}
    className={`p-3 rounded-lg cursor-pointer transition-all duration-200 border-l-4 ${isActive ? 'bg-slate-700/80 border-cyan-400' : 'bg-slate-800 hover:bg-slate-700/50 border-slate-600'}`}
  >
    <p className="font-medium text-white">{task.title}</p>
    <div className="flex items-center text-sm text-slate-400 mt-1">
      <span>{task.pomodorosCompleted} / {task.pomodoros}</span>
      <div className="w-full bg-slate-600 rounded-full h-1.5 ml-2">
        <div className="bg-cyan-500 h-1.5 rounded-full" style={{ width: `${(task.pomodorosCompleted / task.pomodoros) * 100}%` }}></div>
      </div>
    </div>
  </div>
);

const DashboardView: React.FC<DashboardViewProps> = ({ tasks, settings, addSession, activeTaskId, setActiveTaskId, completePomodoroForTask }) => {
  const [timerMode, setTimerMode] = useState<TimerMode>(TimerMode.WORK);
  const [pomodorosInSet, setPomodorosInSet] = useState(0);

  const activeTask = tasks.find(t => t.id === activeTaskId);
  const todayTasks = tasks.filter(t => t.isToday && !t.completed);

  const handleSessionComplete = useCallback((duration: number, isCompleted: boolean) => {
    addSession({
      date: new Date().toISOString().split('T')[0],
      duration: duration,
      isCompleted: isCompleted,
    });

    if (timerMode === TimerMode.WORK && isCompleted) {
      if (activeTaskId) {
        completePomodoroForTask(activeTaskId);
      }
      const newPomodorosInSet = pomodorosInSet + 1;
      setPomodorosInSet(newPomodorosInSet);
      if (newPomodorosInSet % settings.pomodorosPerSet === 0) {
        setTimerMode(TimerMode.LONG_BREAK);
        if (settings.soundOnComplete) {
            new Audio('https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3').play();
        }
      } else {
        setTimerMode(TimerMode.SHORT_BREAK);
      }
    } else {
      setTimerMode(TimerMode.WORK);
    }
  }, [addSession, timerMode, activeTaskId, completePomodoroForTask, pomodorosInSet, settings]);

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
          onSessionComplete={handleSessionComplete}
          timerMode={timerMode}
          setTimerMode={setTimerMode}
          pomodorosInSet={pomodorosInSet}
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
                  task={task}
                  isActive={task.id === activeTaskId}
                  onClick={setActiveTaskId}
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

