
import React, { useState } from 'react';

interface InterruptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (reason: string) => void;
}

const InterruptionModal: React.FC<InterruptionModalProps> = ({ isOpen, onClose, onSave }) => {
  const [reason, setReason] = useState('');

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(reason || 'No reason provided');
    setReason('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50" onClick={onClose}>
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 w-full max-w-sm" onClick={e => e.stopPropagation()}>
        <h2 className="text-xl font-bold text-white">Log Interruption</h2>
        <p className="text-slate-400 mt-2">Briefly note what distracted you. This will void the current Pomodoro.</p>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="e.g., Unplanned phone call, got a snack..."
          className="w-full h-24 bg-slate-700 text-white placeholder-slate-500 p-3 mt-4 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
        <div className="flex justify-end space-x-3 mt-4">
          <button onClick={onClose} className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 transition-colors">
            Cancel
          </button>
          <button onClick={handleSave} className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-semibold transition-colors">
            Void Pomodoro
          </button>
        </div>
      </div>
    </div>
  );
};

export default InterruptionModal;
