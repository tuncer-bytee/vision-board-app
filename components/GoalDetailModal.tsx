import React, { useState } from 'react';
import { Goal } from '../types';
import { ArrowLeft, Calendar, Plus, Trash2, TrendingUp, History, Save, AlertCircle, FileText, Hash } from 'lucide-react';

interface GoalDetailScreenProps {
  goal: Goal;
  onClose: () => void;
  onAddHistory: (goalId: string, value: number, date: string, note: string) => void;
  onDeleteHistory: (goalId: string, historyId: string) => void;
  onDeleteGoal: (goalId: string) => void;
}

export const GoalDetailModal: React.FC<GoalDetailScreenProps> = ({ 
    goal, 
    onClose, 
    onAddHistory, 
    onDeleteHistory,
    onDeleteGoal
}) => {
  const [newValue, setNewValue] = useState('');
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [newNote, setNewNote] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newValue) return;
    onAddHistory(goal.id, parseFloat(newValue), newDate, newNote);
    setNewValue('');
    setNewNote('');
  };

  const sortedHistory = [...goal.history].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const progress = Math.min(100, Math.max(0, (goal.currentValue / goal.targetValue) * 100));

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col animate-fade-in pb-10">
      
      {/* Mobile Navbar */}
      <div className="p-4 border-b border-zinc-900 flex items-center justify-between bg-zinc-950 sticky top-0 z-20">
        <div className="flex items-center gap-3">
            <button 
            onClick={onClose} 
            className="p-2 -ml-2 text-zinc-400 hover:text-white rounded-full hover:bg-zinc-900 transition-colors active:bg-zinc-800"
            >
            <ArrowLeft size={24} />
            </button>
            <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">DETAYLAR</span>
                <h2 className="text-base font-bold leading-tight truncate max-w-[180px]">{goal.title}</h2>
            </div>
        </div>
        <div className="text-xs font-mono text-zinc-400 bg-zinc-900 px-2 py-1 rounded border border-zinc-800">
            {goal.currentValue} / {goal.targetValue}
        </div>
      </div>

      <div className="p-5 flex-1 overflow-y-auto">
          
          {/* Main Progress Card */}
          <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800 mb-6 shadow-sm">
             <div className="flex justify-between items-end mb-4">
                <div className="flex items-center gap-2 text-indigo-400 text-sm font-bold uppercase tracking-wide">
                    <TrendingUp size={18} />
                    <span>İlerleme Durumu</span>
                </div>
                <span className="text-3xl font-bold text-white tracking-tighter">%{progress.toFixed(1)}</span>
             </div>
             
             <div className="w-full bg-zinc-950 rounded-full h-5 border border-zinc-800 overflow-hidden relative">
                <div 
                    className="h-full bg-gradient-to-r from-indigo-600 to-indigo-400 shadow-[0_0_20px_rgba(79,70,229,0.4)] relative" 
                    style={{ width: `${progress}%` }}
                >
                    <div className="absolute right-0 top-0 bottom-0 w-[1px] bg-white/50"></div>
                </div>
             </div>
             <p className="text-center text-xs text-zinc-500 mt-3 font-mono">
                Hedef: <span className="text-white">{goal.targetValue.toLocaleString()} {goal.unit}</span>
             </p>
          </div>

          {/* Add Data Form (Redesigned for Mobile) */}
          <div className="mb-8">
            <h3 className="text-xs font-bold text-zinc-500 mb-3 uppercase tracking-wider flex items-center gap-2">
                <Plus size={14} /> Yeni Kayıt Ekle
            </h3>
            <div className="bg-zinc-900 p-5 rounded-2xl border border-zinc-800">
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    
                    {/* Date Input */}
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-zinc-500 block">TARİH SEÇİN</label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" size={16} />
                            <input 
                                type="date" 
                                required
                                value={newDate}
                                onChange={(e) => setNewDate(e.target.value)}
                                className="w-full bg-zinc-950 border border-zinc-700 rounded-xl pl-10 pr-3 py-3 text-sm text-white focus:border-indigo-500 outline-none appearance-none"
                            />
                        </div>
                    </div>

                    {/* Value Input - Highlighted */}
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-indigo-400 block uppercase">YENİ DEĞER ({goal.unit})</label>
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 pointer-events-none">
                                <Hash size={20} />
                            </div>
                            <input 
                                type="number" 
                                required
                                placeholder="0"
                                value={newValue}
                                onChange={(e) => setNewValue(e.target.value)}
                                className="w-full bg-zinc-950 border-2 border-zinc-800 focus:border-indigo-500 rounded-xl pl-12 pr-4 py-4 text-2xl font-bold text-white outline-none font-mono placeholder-zinc-700 transition-colors"
                            />
                        </div>
                    </div>

                    {/* Note Input */}
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-zinc-500 block">NOT (OPSİYONEL)</label>
                        <div className="relative">
                             <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" size={16} />
                            <input 
                                type="text" 
                                placeholder="Kısa bir not..."
                                value={newNote}
                                onChange={(e) => setNewNote(e.target.value)}
                                className="w-full bg-zinc-950 border border-zinc-700 rounded-xl pl-10 pr-3 py-3 text-sm text-white focus:border-indigo-500 outline-none placeholder-zinc-700"
                            />
                        </div>
                    </div>

                    <button type="submit" className="mt-2 w-full bg-white text-black font-bold py-4 rounded-xl text-sm hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2 active:scale-95 transform duration-100 shadow-lg shadow-white/5">
                        <Save size={18} />
                        KAYDET
                    </button>
                </form>
            </div>
          </div>

          {/* History List */}
          <div className="mb-12">
            <h3 className="text-xs font-bold text-zinc-500 mb-3 uppercase tracking-wider flex items-center gap-2">
                <History size={14} /> Geçmiş Hareketler
            </h3>
            
            {sortedHistory.length === 0 ? (
                <div className="text-center py-10 text-zinc-700 text-sm border-2 border-dashed border-zinc-900 rounded-xl">
                    Henüz veri girişi yapılmamış.
                </div>
            ) : (
                <div className="space-y-3">
                    {sortedHistory.map((entry) => (
                        <div key={entry.id} className="relative pl-6 before:absolute before:left-2 before:top-0 before:bottom-0 before:w-[1px] before:bg-zinc-800 last:before:bottom-auto last:before:h-1/2">
                            <div className="absolute left-[3px] top-1/2 -translate-y-1/2 w-[11px] h-[11px] rounded-full bg-zinc-950 border-2 border-zinc-700 z-10"></div>
                            
                            <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 flex justify-between items-center group">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-white font-mono font-bold text-lg">{entry.value.toLocaleString()}</span>
                                        <span className="text-xs font-medium text-zinc-500 bg-zinc-950 px-2 py-0.5 rounded-md border border-zinc-800">
                                            {goal.unit}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs text-zinc-500 flex items-center gap-1">
                                            <Calendar size={10} /> {entry.date}
                                        </span>
                                        {entry.note && (
                                            <span className="text-xs text-zinc-400 border-l border-zinc-700 pl-2">
                                                {entry.note}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <button 
                                    onClick={() => onDeleteHistory(goal.id, entry.id)}
                                    className="text-zinc-500 hover:text-red-500 active:text-red-500 p-3 -mr-2 rounded-lg hover:bg-zinc-950 transition-all"
                                    aria-label="Kaydı Sil"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
          </div>

          {/* Danger Zone */}
          <div className="pt-8 border-t border-zinc-800 mb-8">
            <button 
                onClick={() => onDeleteGoal(goal.id)}
                className="w-full py-4 rounded-xl border border-red-900/50 bg-red-900/10 text-red-500 hover:bg-red-900/20 transition-colors flex items-center justify-center gap-2 font-bold text-sm"
            >
                <AlertCircle size={18} />
                BU HEDEFİ TAMAMEN SİL
            </button>
            <p className="text-center text-[10px] text-zinc-600 mt-2">Bu işlem geri alınamaz.</p>
          </div>

      </div>
    </div>
  );
};