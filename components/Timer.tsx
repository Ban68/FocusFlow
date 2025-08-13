import React, { useEffect, useCallback, useMemo, useRef, useState } from 'react';
import type { TimerMode, Settings, TimerStatus } from '../types';
import { TimerMode as TimerModeEnum, TimerStatus as TimerStatusEnum } from '../types';
import { ICONS } from '../constants';
import InterruptionModal from './InterruptionModal';

interface TimerProps {
  settings: Settings;
  onSessionComplete: (duration: number, isCompleted: boolean) => void;
  timerMode: TimerMode;
  setTimerMode: (mode: TimerMode) => void;
  pomodorosInSet: number;
  totalSeconds: number;
  setTotalSeconds: (seconds: number) => void;
  secondsLeft: number;
  setSecondsLeft: (seconds: number) => void;
  timerStatus: TimerStatus;
  setTimerStatus: (status: TimerStatus) => void;
}

const CircularProgress: React.FC<{ progress: number; children: React.ReactNode }> = ({ progress, children }) => {
    const radius = 130;
    const stroke = 12;
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
        <div className="relative flex items-center justify-center">
            <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
                <circle
                    stroke="#334155"
                    fill="transparent"
                    strokeWidth={stroke}
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                />
                <circle
                    stroke="#22d3ee"
                    fill="transparent"
                    strokeWidth={stroke}
                    strokeDasharray={circumference + ' ' + circumference}
                    style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.3s ease-out' }}
                    strokeLinecap="round"
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                />
            </svg>
            <div className="absolute">{children}</div>
        </div>
    );
};


const Timer: React.FC<TimerProps> = ({ settings, onSessionComplete, timerMode, setTimerMode, pomodorosInSet, totalSeconds, setTotalSeconds, secondsLeft, setSecondsLeft, timerStatus, setTimerStatus }) => {
  const shouldAutoStart = useRef(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // This useEffect now only handles the timer interval and completion logic
  useEffect(() => {
    if (timerStatus !== TimerStatusEnum.RUNNING) return;

    if (secondsLeft <= 0) {
      setTimerStatus(TimerStatusEnum.STOPPED);
      onSessionComplete(totalSeconds / 60, true);
      if (settings.soundOnComplete) {
          new Audio('https://orangefreesounds.com/wp-content/uploads/2025/08/Clean-and-sharp-metal-ding-sound-effect.mp3').play().catch(error => {
              console.error("Failed to play sound:", error);
          });
      }
      shouldAutoStart.current = true;
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timerStatus, secondsLeft, onSessionComplete, totalSeconds, settings.soundOnComplete, setSecondsLeft, setTimerStatus]);
  
  const toggleTimer = () => {
    setTimerStatus(prev => prev === TimerStatusEnum.RUNNING ? TimerStatusEnum.PAUSED : TimerStatusEnum.RUNNING);
  };
  
  const resetTimer = () => {
    setTimerStatus(TimerStatusEnum.STOPPED);
    // Recalculate totalSeconds based on current timerMode and settings
    const newTotalSeconds = (() => {
      switch (timerMode) {
        case TimerModeEnum.WORK: return settings.workDuration * 60;
        case TimerModeEnum.SHORT_BREAK: return settings.shortBreakDuration * 60;
        case TimerModeEnum.LONG_BREAK: return settings.longBreakDuration * 60;
        default: return settings.workDuration * 60;
      }
    })();
    setTotalSeconds(newTotalSeconds);
    setSecondsLeft(newTotalSeconds);
  };

  const handleVoidPomodoro = (reason: string) => {
    console.log(`Pomodoro voided: ${reason}`);
    onSessionComplete(totalSeconds / 60, false);
    setIsModalOpen(false);
    // Reset timer after voiding
    resetTimer();
  };
  
  const extendFlow = () => {
    setSecondsLeft(prev => prev + 5 * 60); // Add 5 minutes
    setTotalSeconds(prev => prev + 5 * 60);
    if (timerStatus !== TimerStatusEnum.RUNNING) {
      setTimerStatus(TimerStatusEnum.RUNNING);
    }
  };
  
  const progress = (totalSeconds > 0) ? ((totalSeconds - secondsLeft) / totalSeconds) * 100 : 0;
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  const modeText = useMemo(() => {
      switch(timerMode) {
          case TimerModeEnum.WORK: return `Focus #${pomodorosInSet + 1}`;
          case TimerModeEnum.SHORT_BREAK: return "Short Break";
          case TimerModeEnum.LONG_BREAK: return "Long Break";
      }
  }, [timerMode, pomodorosInSet]);

  return (
    <div className="flex flex-col items-center p-8 bg-slate-800/50 rounded-2xl border border-slate-700/50">
      <CircularProgress progress={progress}>
        <div className="text-center">
            <p className="text-6xl font-bold tracking-tighter text-white">{`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`}</p>
            <p className="text-cyan-400 font-medium mt-1">{modeText}</p>
        </div>
      </CircularProgress>

      <div className="flex items-center space-x-4 mt-8">
        <button 
          onClick={() => setIsModalOpen(true)}
          className="p-3 bg-slate-700 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-full transition-colors"
          title="Void Pomodoro"
          disabled={timerMode !== TimerModeEnum.WORK || timerStatus !== TimerStatusEnum.RUNNING}
        >
          {ICONS.TRASH}
        </button>
        <button onClick={toggleTimer} className="p-4 bg-cyan-500 text-slate-900 rounded-full hover:bg-cyan-400 transition-colors shadow-lg shadow-cyan-500/20">
            {timerStatus === TimerStatusEnum.RUNNING ? ICONS.PAUSE : ICONS.PLAY}
        </button>
        <button onClick={resetTimer} className="p-3 bg-slate-700 hover:bg-slate-600 text-slate-400 hover:text-white rounded-full transition-colors" title="Reset Timer">
            {ICONS.RESET}
        </button>
      </div>

      {timerMode === TimerModeEnum.WORK && (
        <button 
          onClick={extendFlow}
          className="mt-6 text-sm text-cyan-400 hover:text-cyan-300 bg-slate-700/50 px-4 py-2 rounded-lg transition-colors"
        >
          I'm in flow, extend +5 min
        </button>
      )}

      <InterruptionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleVoidPomodoro} 
      />
    </div>
  );
};

export default Timer;
