
import React, { useState, useEffect, useCallback } from 'react';
import type { Screen, Task, Session, Settings } from './types';
import { Screen as ScreenEnum } from './types';
import { DEFAULT_SETTINGS } from './constants';
import Header from './components/Header';
import DashboardView from './components/DashboardView';
import TasksView from './components/TasksView';
import StatsView from './components/StatsView';
import SettingsView from './components/SettingsView';

const App: React.FC = () => {
  const [activeScreen, setActiveScreen] = useState<Screen>(ScreenEnum.DASHBOARD);
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem('focusflow_tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [sessions, setSessions] = useState<Session[]>(() => {
    const savedSessions = localStorage.getItem('focusflow_sessions');
    return savedSessions ? JSON.parse(savedSessions) : [];
  });
  const [settings, setSettings] = useState<Settings>(() => {
    const savedSettings = localStorage.getItem('focusflow_settings');
    return savedSettings ? JSON.parse(savedSettings) : DEFAULT_SETTINGS;
  });
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('focusflow_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('focusflow_sessions', JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem('focusflow_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    // If there is no active task, set one from the 'Today' list
    if (!activeTaskId && tasks.some(t => t.isToday && !t.completed)) {
      setActiveTaskId(tasks.find(t => t.isToday && !t.completed)?.id || null);
    }
  }, [tasks, activeTaskId]);

  const addSession = useCallback((session: Omit<Session, 'id'>) => {
    setSessions(prev => [...prev, { ...session, id: crypto.randomUUID() }]);
  }, []);

  const completePomodoroForTask = useCallback((taskId: string) => {
      setTasks(prevTasks => prevTasks.map(t => {
          if (t.id === taskId) {
              const newPomodorosCompleted = t.pomodorosCompleted + 1;
              return {
                  ...t,
                  pomodorosCompleted: newPomodorosCompleted,
                  completed: newPomodorosCompleted >= t.pomodoros,
              };
          }
          return t;
      }));
  }, []);

  const renderScreen = () => {
    switch (activeScreen) {
      case ScreenEnum.TASKS:
        return <TasksView tasks={tasks} setTasks={setTasks} />;
      case ScreenEnum.STATS:
        return <StatsView sessions={sessions} />;
      case ScreenEnum.SETTINGS:
        return <SettingsView settings={settings} setSettings={setSettings} />;
      case ScreenEnum.DASHBOARD:
      default:
        return (
          <DashboardView
            tasks={tasks}
            settings={settings}
            addSession={addSession}
            activeTaskId={activeTaskId}
            setActiveTaskId={setActiveTaskId}
            completePomodoroForTask={completePomodoroForTask}
          />
        );
    }
  };

  return (
    <div className="bg-slate-900 text-white min-h-screen flex flex-col items-center">
      <div className="w-full max-w-4xl p-4 sm:p-6">
        <Header activeScreen={activeScreen} setActiveScreen={setActiveScreen} />
        <main className="mt-6">
          {renderScreen()}
        </main>
      </div>
    </div>
  );
};

export default App;
