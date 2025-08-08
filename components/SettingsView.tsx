import React from 'react';
import type { Settings } from '../types';
import { DEFAULT_SETTINGS } from '../constants';

interface SettingsViewProps {
  settings: Settings;
  setSettings: (settings: Settings) => void;
}

const SettingsInput: React.FC<{
  label: string;
  value: number;
  onChange: (value: number) => void;
}> = ({ label, value, onChange }) => {
  return (
    <div>
      <label className="block text-slate-300 mb-2">{label}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Math.max(1, parseInt(e.target.value, 10)))}
        min="1"
        className="w-full bg-slate-700 text-white p-3 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
      />
    </div>
  );
};

const SettingsView: React.FC<SettingsViewProps> = ({ settings, setSettings }) => {
  const handleReset = () => {
    setSettings(DEFAULT_SETTINGS);
  };

  return (
    <div className="max-w-md mx-auto p-8 bg-slate-800/50 rounded-2xl border border-slate-700/50">
      <h2 className="text-2xl font-bold text-white mb-6">Settings</h2>
      <div className="space-y-6">
        <SettingsInput
          label="Work Duration (minutes)"
          value={settings.workDuration}
          onChange={(val) => setSettings({ ...settings, workDuration: val })}
        />
        <SettingsInput
          label="Short Break Duration (minutes)"
          value={settings.shortBreakDuration}
          onChange={(val) => setSettings({ ...settings, shortBreakDuration: val })}
        />
        <SettingsInput
          label="Long Break Duration (minutes)"
          value={settings.longBreakDuration}
          onChange={(val) => setSettings({ ...settings, longBreakDuration: val })}
        />
        <SettingsInput
          label="Pomodoros per Set"
          value={settings.pomodorosPerSet}
          onChange={(val) => setSettings({ ...settings, pomodorosPerSet: val })}
        />

        <button
          onClick={handleReset}
          className="w-full text-center text-slate-400 hover:text-white hover:bg-slate-700 p-3 rounded-lg transition-colors"
        >
          Reset to Defaults
        </button>

        {/* ---- Privacy link ---- */}
        <div className="mt-6 text-xs opacity-70">
          <a
            href="/privacy.html"
            target="_blank"
            rel="noopener"
            className="underline"
          >
            Política de privacidad
          </a>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
