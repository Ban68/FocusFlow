
import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { Screen, Task, Session, Settings, TimerMode, TimerStatus } from './types';
import { Screen as ScreenEnum, TimerMode as TimerModeEnum, TimerStatus as TimerStatusEnum } from './types';
import { DEFAULT_SETTINGS } from './constants';
import { getDuration } from './utils/time';
import { BELL, BELL_ALT, DING, DING_ALT } from './sounds';
import Header from './components/Header';
import DashboardView from './components/DashboardView';
import TasksView from './components/TasksView';
import StatsView from './components/StatsView';
import SettingsView from './components/SettingsView';

const App: React.FC = () => {
  const [activeScreen, setActiveScreen] = useState<Screen>(ScreenEnum.DASHBOARD);
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem('focusflow_tasks');
    if (savedTasks) {
      try {
        return (JSON.parse(savedTasks) as Task[]).map(t => ({ priority: 1, ...t }));
      } catch (error) {
        console.error('Error parsing tasks from localStorage:', error);
      }
    }
    return [];
  });
  const [sessions, setSessions] = useState<Session[]>(() => {
    const savedSessions = localStorage.getItem('focusflow_sessions');
    if (savedSessions) {
      try {
        return JSON.parse(savedSessions);
      } catch (error) {
        console.error('Error parsing sessions from localStorage:', error);
      }
    }
    return [];
  });
  const [settings, setSettings] = useState<Settings>(() => {
    const savedSettings = localStorage.getItem('focusflow_settings');
    if (savedSettings) {
      try {
        return JSON.parse(savedSettings);
      } catch (error) {
        console.error('Error parsing settings from localStorage:', error);
      }
    }
    return DEFAULT_SETTINGS;
  });
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

  // Timer state lifted up to App.tsx
  const [timerMode, setTimerMode] = useState<TimerMode>(TimerModeEnum.WORK);
  const [pomodorosInSet, setPomodorosInSet] = useState(0);
  const shouldAutoStart = useRef(false);
  const [totalSeconds, setTotalSeconds] = useState(getDuration(timerMode, settings));
  const [secondsLeft, setSecondsLeft] = useState(getDuration(timerMode, settings));
  const [timerStatus, setTimerStatus] = useState<TimerStatus>(TimerStatusEnum.STOPPED);

  useEffect(() => {
    const newTotalSeconds = getDuration(timerMode, settings);
    setTotalSeconds(newTotalSeconds);
    setSecondsLeft(newTotalSeconds);
    // Do not reset timerStatus here, it should be controlled by user actions
  }, [timerMode, settings]);

  useEffect(() => {
    if (shouldAutoStart.current) {
      setTimerStatus(TimerStatusEnum.RUNNING);
      shouldAutoStart.current = false;
    }
  }, [timerMode]);



  useEffect(() => {
    const unlockAudio = () => {
      const audio = new Audio();
      audio.play().catch(error => console.error("Error unlocking audio context:", error));
      document.removeEventListener('mousedown', unlockAudio);
      document.removeEventListener('touchstart', unlockAudio);
    };

    document.addEventListener('mousedown', unlockAudio);
    document.addEventListener('touchstart', unlockAudio);

    return () => {
      document.removeEventListener('mousedown', unlockAudio);
      document.removeEventListener('touchstart', unlockAudio);
    };
  }, []);

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
    if (!activeTaskId) {
      const next = tasks
        .filter(t => t.isToday && !t.completed)
        .sort((a, b) => a.priority - b.priority)[0];
      setActiveTaskId(next ? next.id : null);
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

  const markTaskCompleted = useCallback((id: string) => {
    setTasks(prev =>
      prev.map(t =>
        t.id === id
          ? { ...t, completed: true, pomodorosCompleted: t.pomodoros }
          : t
      )
    );

  }, []);

  const playSoundWithFallback = (primary: string, fallback: string) => {
    const audio = new Audio(primary);
    audio.play().catch(error => {
      console.error('Failed to play sound:', error);
      const fallbackAudio = new Audio(fallback);
      fallbackAudio.play().catch(fallbackError => {
        console.error('Failed to play fallback sound:', fallbackError);
      });
    });
  };

  const getSoundForMode = (mode: TimerMode): [string, string] => {
    switch (mode) {
      case TimerModeEnum.WORK:
        return [DING, DING_ALT];
      case TimerModeEnum.SHORT_BREAK:
        return [BELL, BELL_ALT];
      case TimerModeEnum.LONG_BREAK:
        return [DING_ALT, BELL];
      default:
        return [DING, DING_ALT];
    }
  };

  const handleSessionComplete = useCallback((duration: number, isCompleted: boolean) => {
    addSession({
      date: new Date().toISOString().split('T')[0],
      duration: duration,
      isCompleted: isCompleted,
    });

    if (timerMode === TimerModeEnum.WORK && isCompleted) {
      if (activeTaskId) {
        const activeTask = tasks.find(t => t.id === activeTaskId);
        const willBeCompleted = activeTask
          ? activeTask.pomodorosCompleted + 1 >= activeTask.pomodoros
          : false;
        completePomodoroForTask(activeTaskId);
        if (willBeCompleted) {
          const remaining = tasks
            .filter(t => t.isToday && !t.completed && t.id !== activeTaskId)
            .sort((a, b) => a.priority - b.priority);
          if (remaining.length > 0) {
            if (window.confirm('Task completed. Continue with next task?')) {
              setActiveTaskId(remaining[0].id);
            } else {
              setActiveTaskId(null);
            }
          } else {
            setActiveTaskId(null);
          }
        }
      }
      const newPomodorosInSet = pomodorosInSet + 1;
      setPomodorosInSet(newPomodorosInSet);
      if (newPomodorosInSet % settings.pomodorosPerSet === 0) {
        setTimerMode(TimerModeEnum.LONG_BREAK);
      } else {
        setTimerMode(TimerModeEnum.SHORT_BREAK);
      }
    } else {
      setTimerMode(TimerModeEnum.WORK);
    }
  }, [addSession, timerMode, activeTaskId, tasks, completePomodoroForTask, pomodorosInSet, settings, setTimerMode, setPomodorosInSet, setActiveTaskId]);

  useEffect(() => {
    if (timerStatus !== TimerStatusEnum.RUNNING) return;

    if (secondsLeft <= 0) {
      const finishedMode = timerMode;
      setTimerStatus(TimerStatusEnum.STOPPED);
      handleSessionComplete(totalSeconds / 60, true);
      if (settings.soundOnComplete) {
        const [primary, fallback] = getSoundForMode(finishedMode);
        playSoundWithFallback(primary, fallback);
      }
      shouldAutoStart.current = true;
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timerStatus, secondsLeft, totalSeconds, timerMode, settings.soundOnComplete, handleSessionComplete]);

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
            activeTaskId={activeTaskId}
            setActiveTaskId={setActiveTaskId}
            timerMode={timerMode}
            setTimerMode={setTimerMode}
            pomodorosInSet={pomodorosInSet}
            totalSeconds={totalSeconds}
            setTotalSeconds={setTotalSeconds}

            secondsLeft={secondsLeft}
            setSecondsLeft={setSecondsLeft}
            timerStatus={timerStatus}
            setTimerStatus={setTimerStatus}
            onSessionComplete={handleSessionComplete}
            onCompleteTask={markTaskCompleted}
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
