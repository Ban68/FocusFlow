
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

const SettingsToggle: React.FC<{
  label: string;
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}> = ({ label, enabled, onChange }) => {
  return (
    <div className="flex items-center justify-between py-2">
      <label className="block text-slate-300">{label}</label>
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        onClick={() => onChange(!enabled)}
        className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-cyan-500 ${
          enabled ? 'bg-cyan-500' : 'bg-slate-600'
        }`}
      >
        <span
          className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-200 ${
            enabled ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
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
        <hr className="border-slate-700" />
        <SettingsToggle 
            label="Sound on complete"
            enabled={settings.soundOnComplete}
            onChange={(val) => setSettings({ ...settings, soundOnComplete: val})}
        />
        <hr className="border-slate-700" />
        <button
            onClick={handleReset}
            className="w-full text-center text-slate-400 hover:text-white hover:bg-slate-700 p-3 rounded-lg transition-colors"
        >
            Reset to Defaults
        </button>
        <a
          href="/privacy.html"
          target="_blank"
          rel="noopener noreferrer"
          className="block text-center text-slate-400 hover:text-white underline mt-2"
        >
          Privacy Policy
        </a>
      </div>
    </div>
  );
};

export default SettingsView;

