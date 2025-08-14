
import React, { useState, useEffect, useRef } from 'react';
import { getBreakSuggestion } from '../services/geminiService';
import { ICONS } from '../constants';

const BreakSuggestion: React.FC = () => {
  const [suggestion, setSuggestion] = useState<string>('Loading a break idea...');
  const [loading, setLoading] = useState(true);
  const controllerRef = useRef<AbortController | null>(null);

  const fetchSuggestion = async () => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;
    setLoading(true);
    try {
      const newSuggestion = await getBreakSuggestion(controller.signal);
      if (!controller.signal.aborted) {
        setSuggestion(newSuggestion);
      }
    } catch (e) {
      if ((e as DOMException).name !== 'AbortError') {
        console.error(e);
      }
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchSuggestion();
    return () => {
      controllerRef.current?.abort();
    };
  }, []);

  return (
    <div className="mt-6 p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50 flex flex-col items-center text-center">
      <div className="flex items-center space-x-2 text-cyan-400">
        {ICONS.LIGHTBULB}
        <h3 className="font-bold">Active Break Idea</h3>
      </div>
      <p className="text-white mt-2 min-h-[48px] flex items-center justify-center">
        {loading ? (
          <span className="animate-pulse">Thinking...</span>
        ) : (
          `"${suggestion}"`
        )}
      </p>
      <button 
        onClick={fetchSuggestion} 
        disabled={loading}
        className="text-xs text-slate-400 hover:text-cyan-300 mt-2 disabled:opacity-50 transition-colors"
      >
        Get another idea
      </button>
    </div>
  );
};

export default BreakSuggestion;
