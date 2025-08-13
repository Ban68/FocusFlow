
import React from 'react';
import type { Screen } from '../types';
import { Screen as ScreenEnum } from '../types';
import { ICONS } from '../constants';

interface HeaderProps {
  activeScreen: Screen;
  setActiveScreen: (screen: Screen) => void;
}

const NavButton: React.FC<{
    screen: Screen;
    activeScreen: Screen;
    onClick: (screen: Screen) => void;
    icon: React.ReactNode;
    label: string;
}> = ({ screen, activeScreen, onClick, icon, label }) => {
    const isActive = activeScreen === screen;
    const activeClasses = 'bg-slate-700 text-cyan-400';
    const inactiveClasses = 'text-slate-400 hover:bg-slate-800 hover:text-cyan-300';
    
    return (
        <button
            onClick={() => onClick(screen)}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors duration-200 ${isActive ? activeClasses : inactiveClasses}`}
        >
            {icon}
            <span className="hidden sm:inline">{label}</span>
        </button>
    );
};

const Header: React.FC<HeaderProps> = ({ activeScreen, setActiveScreen }) => {
  return (
    <header className="flex flex-col sm:flex-row sm:justify-between items-center bg-slate-900/50 backdrop-blur-sm p-3 rounded-xl border border-slate-700/50">
      <div className="flex items-center space-x-2">
         <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
         </svg>
        <h1 className="text-xl font-bold text-white">FocusFlow</h1>
      </div>
      <nav className="flex items-center space-x-1 sm:space-x-2 bg-slate-800/70 p-1 rounded-lg mt-2 sm:mt-0">
        <NavButton screen={ScreenEnum.DASHBOARD} activeScreen={activeScreen} onClick={setActiveScreen} icon={ICONS.TIMER} label="Timer" />
        <NavButton screen={ScreenEnum.TASKS} activeScreen={activeScreen} onClick={setActiveScreen} icon={ICONS.TASKS} label="Tasks" />
        <NavButton screen={ScreenEnum.STATS} activeScreen={activeScreen} onClick={setActiveScreen} icon={ICONS.STATS} label="Stats" />
        <NavButton screen={ScreenEnum.SETTINGS} activeScreen={activeScreen} onClick={setActiveScreen} icon={ICONS.SETTINGS} label="Settings" />
      </nav>
    </header>
  );
};

export default Header;
