
import React, { useState, useMemo } from 'react';
import { Goal } from '../types';
import { 
  ArrowLeft, Calendar, Plus, Trash2, TrendingUp, History, 
  Save, AlertCircle, FileText, Hash, Zap, CheckCircle2, Flame 
} from 'lucide-react';

interface GoalDetailScreenProps {
  goal: Goal;
  onClose: () => void;
  onAddHistory: (goalId: string, value: number, date: string, note: string) => void;
  onDeleteHistory: (goalId: string, historyId: string) => void;
  onDeleteGoal: (goalId: string) => void;
}

interface CalendarDay {
  day?: number;
  date?: string;
  active?: boolean;
  type: 'empty' | 'day';
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
  
  const todayStr = new Date().toISOString().split('T')[0];
  const todayEntry = goal.history.find(h => h.date === todayStr);
  const isCheckedToday = !!todayEntry;

  const stats = useMemo(() => {
    if (goal.type !== 'streak') return null;

    // Explicitly type dates as string[] to help TS inference
    const dates: string[] = Array.from(new Set(goal.history.map(h => h.date))).sort();
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    if (dates.length > 0) {
      const today = new Date();
      today.setHours(0,0,0,0);
      
      // Typing the map parameter d as string to resolve new Date() overload error
      const sortedDates = dates.map((d: string) => new Date(d)).sort((a, b) => a.getTime() - b.getTime());
      
      for (let i = 0; i < sortedDates.length; i++) {
        const current = sortedDates[i];
        const prev = i > 0 ? sortedDates[i-1] : null;

        if (prev) {
          const diff = (current.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);
          if (diff === 1) {
            tempStreak++;
          } else {
            tempStreak = 1;
          }
        } else {
          tempStreak = 1;
        }
        longestStreak = Math.max(longestStreak, tempStreak);
      }

      const lastDate = sortedDates[sortedDates.length - 1];
      const diffFromToday = (today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24);
      
      if (diffFromToday <= 1) {
        let chain = 0;
        for(let i = sortedDates.length - 1; i >= 0; i--) {
            const d = sortedDates[i];
            const nextDateVal = sortedDates[i+1];
            if(!nextDateVal || (nextDateVal.getTime() - d.getTime()) / (1000 * 60 * 60 * 24) === 1) {
                chain++;
            } else {
                break;
            }
        }
        currentStreak = chain;
      }
    }

    return { currentStreak, longestStreak, totalDays: dates.length };
  }, [goal.history, goal.type]);

  const calendarDays = useMemo(() => {
      const days: CalendarDay[] = [];
      const now = new Date();
      const month = now.getMonth();
      const year = now.getFullYear();
      const firstDay = new Date(year, month, 1).getDay();
      const daysInMonth = new Date(year, month + 1, 0).getDate();

      const padding = firstDay === 0 ? 6 : firstDay - 1;
      for (let i = 0; i < padding; i++) {
          days.push({ type: 'empty' });
      }

      for (let d = 1; d <= daysInMonth; d++) {
          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
          const active = goal.history.some(h => h.date === dateStr);
          days.push({ day: d, date: dateStr, active, type: 'day' });
      }
      return days;
  }, [goal.history]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (goal.type === 'numeric' && !newValue) return;
    
    const val = goal.type === 'streak' ? 1 : parseFloat(newValue);
    onAddHistory(goal.id, val, newDate, newNote);
    setNewValue('');
    setNewNote('');
  };

  const handleToggleToday = () => {
    if (isCheckedToday && todayEntry) {
        onDeleteHistory(goal.id, todayEntry.id);
    } else {
        onAddHistory(goal.id, 1, todayStr, 'Günlük onay');
    }
  };

  const sortedHistory = [...goal.history].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const progress = goal.type === 'numeric' 
    ? Math.min(100, Math.max(0, (goal.currentValue / goal.targetValue) * 100))
    : (stats ? Math.min(100, (stats.totalDays / 365) * 100) : 0);

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col animate-fade-in pb-10">
      
      <div className="p-4 border-b border-zinc-900 flex items-center justify-between bg-zinc-950 sticky top-0 z-20">
        <div className="flex items-center gap-3">
            <button onClick={onClose} className="p-2 -ml-2 text-zinc-400 hover:text-white rounded-full hover:bg-zinc-900 transition-colors active:bg-zinc-800">
                <ArrowLeft size={24} />
            </button>
            <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
                  {goal.type === 'streak' ? 'SERİ HEDEFİ' : 'ÖLÇÜLEBİLİR HEDEF'}
                </span>
                <h2 className="text-base font-bold leading-tight truncate max-w-[180px]">{goal.title}</h2>
            </div>
        </div>
        <div className="text-xs font-mono text-zinc-400 bg-zinc-900 px-2 py-1 rounded border border-zinc-800">
            {goal.type === 'numeric' ? `${goal.currentValue} / ${goal.targetValue}` : `${stats?.totalDays} Gün`}
        </div>
      </div>

      <div className="p-5 flex-1 overflow-y-auto">
          
          {goal.type === 'streak' ? (
              <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-zinc-900 rounded-2xl p-5 border border-zinc-800 flex flex-col items-center text-center">
                      <Flame className={`mb-2 ${stats?.currentStreak ? 'text-orange-500 animate-pulse' : 'text-zinc-700'}`} size={32} strokeWidth={2.5} />
                      <div className="text-2xl font-black font-mono leading-none">{stats?.currentStreak}</div>
                      <div className="text-[10px] text-zinc-500 font-bold uppercase mt-1">GÜNCEL SERİ</div>
                  </div>
                  <div className="bg-zinc-900 rounded-2xl p-5 border border-zinc-800 flex flex-col items-center text-center">
                      <CheckCircle2 className="text-emerald-500 mb-2" size={32} />
                      <div className="text-2xl font-black font-mono leading-none">{stats?.totalDays}</div>
                      <div className="text-[10px] text-zinc-500 font-bold uppercase mt-1">TOPLAM GÜN</div>
                  </div>
              </div>
          ) : (
              <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800 mb-6 shadow-sm">
                <div className="flex justify-between items-end mb-4">
                    <div className="flex items-center gap-2 text-indigo-400 text-sm font-bold uppercase tracking-wide">
                        <TrendingUp size={18} />
                        <span>İlerleme Durumu</span>
                    </div>
                    <span className="text-3xl font-bold text-white tracking-tighter">%{progress.toFixed(1)}</span>
                </div>
                <div className="w-full bg-zinc-950 rounded-full h-5 border border-zinc-800 overflow-hidden relative">
                    <div className="h-full bg-gradient-to-r from-indigo-600 to-indigo-400 shadow-[0_0_20px_rgba(79,70,229,0.4)] transition-all duration-1000" style={{ width: `${progress}%` }} />
                </div>
                <p className="text-center text-xs text-zinc-500 mt-3 font-mono">
                    Hedef: <span className="text-white">{goal.targetValue.toLocaleString()} {goal.unit}</span>
                </p>
              </div>
          )}

          {/* Activity Map for Streaks */}
          {goal.type === 'streak' && (
              <div className="mb-8">
                  <h3 className="text-xs font-bold text-zinc-500 mb-3 uppercase tracking-wider flex items-center gap-2">
                      <Calendar size={14} /> Aktivite Haritası
                  </h3>
                  <div className="bg-zinc-900 p-4 rounded-2xl border border-zinc-800">
                      <div className="grid grid-cols-7 gap-1 text-center mb-2">
                          {['P', 'S', 'Ç', 'P', 'C', 'Ct', 'P'].map(d => <div key={d} className="text-[10px] text-zinc-600 font-bold">{d}</div>)}
                      </div>
                      <div className="grid grid-cols-7 gap-1">
                          {calendarDays.map((d, i) => (
                              <div 
                                  key={i} 
                                  className={`aspect-square rounded-sm text-[10px] flex items-center justify-center font-mono ${
                                      d.type === 'empty' ? 'opacity-0' : 
                                      d.active ? 'bg-orange-500 text-black font-bold' : 'bg-zinc-800 text-zinc-600'
                                  } ${d.date === todayStr ? 'ring-2 ring-white/20' : ''}`}
                              >
                                  {d.type === 'day' ? d.day : ''}
                              </div>
                          ))}
                      </div>
                  </div>
              </div>
          )}

          {/* Action Area */}
          <div className="mb-8">
            <h3 className="text-xs font-bold text-zinc-500 mb-3 uppercase tracking-wider flex items-center gap-2">
                {goal.type === 'streak' ? <Zap size={14} /> : <Plus size={14} />} {goal.type === 'streak' ? 'Günü Kaydet' : 'Yeni Kayıt Ekle'}
            </h3>
            
            <div className="bg-zinc-900 p-5 rounded-2xl border border-zinc-800">
                {goal.type === 'streak' ? (
                    <button 
                        onClick={handleToggleToday}
                        className={`w-full py-6 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all active:scale-95 ${
                            isCheckedToday 
                            ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/50' 
                            : 'bg-gradient-to-br from-orange-500 to-red-600 text-white font-black shadow-lg shadow-orange-900/30'
                        }`}
                    >
                        {isCheckedToday ? (
                            <>
                                <CheckCircle2 size={32} />
                                <span className="text-sm">TAMAMLANDI (GERİ AL)</span>
                            </>
                        ) : (
                            <>
                                <Flame size={32} />
                                <span className="text-lg">BUGÜNÜ YAPTIM</span>
                            </>
                        )}
                    </button>
                ) : (
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-zinc-500 block">TARİH SEÇİN</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" size={16} />
                                <input type="date" required value={newDate} onChange={(e) => setNewDate(e.target.value)}
                                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl pl-10 pr-3 py-3 text-sm text-white outline-none"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-indigo-400 block uppercase">YENİ DEĞER ({goal.unit})</label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 pointer-events-none">
                                    <Hash size={20} />
                                </div>
                                <input type="number" required placeholder="0" value={newValue} onChange={(e) => setNewValue(e.target.value)}
                                    className="w-full bg-zinc-950 border-2 border-zinc-800 focus:border-indigo-500 rounded-xl pl-12 pr-4 py-4 text-2xl font-bold text-white outline-none font-mono transition-colors"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-zinc-500 block">NOT (OPSİYONEL)</label>
                            <div className="relative">
                                <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" size={16} />
                                <input type="text" placeholder="Kısa bir not..." value={newNote} onChange={(e) => setNewNote(e.target.value)}
                                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl pl-10 pr-3 py-3 text-sm text-white outline-none"
                                />
                            </div>
                        </div>

                        <button type="submit" className="mt-2 w-full bg-white text-black font-bold py-4 rounded-xl text-sm active:scale-95 shadow-lg shadow-white/5 flex items-center justify-center gap-2">
                            <Save size={18} /> KAYDET
                        </button>
                    </form>
                )}
            </div>
          </div>

          {/* History */}
          <div className="mb-12">
            <h3 className="text-xs font-bold text-zinc-500 mb-3 uppercase tracking-wider flex items-center gap-2">
                <History size={14} /> Geçmiş Hareketler
            </h3>
            
            {sortedHistory.length === 0 ? (
                <div className="text-center py-10 text-zinc-700 text-sm border-2 border-dashed border-zinc-900 rounded-xl">Henüz veri girişi yapılmamış.</div>
            ) : (
                <div className="space-y-3">
                    {sortedHistory.map((entry) => (
                        <div key={entry.id} className="relative pl-6 before:absolute before:left-2 before:top-0 before:bottom-0 before:w-[1px] before:bg-zinc-800 last:before:bottom-auto last:before:h-1/2">
                            <div className="absolute left-[3px] top-1/2 -translate-y-1/2 w-[11px] h-[11px] rounded-full bg-zinc-950 border-2 border-zinc-700 z-10"></div>
                            <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 flex justify-between items-center">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-white font-mono font-bold text-lg">
                                            {goal.type === 'streak' ? 'Tamamlandı' : entry.value.toLocaleString()}
                                        </span>
                                        {goal.type === 'numeric' && <span className="text-xs font-medium text-zinc-500 bg-zinc-950 px-2 py-0.5 rounded-md border border-zinc-800">{goal.unit}</span>}
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs text-zinc-500 flex items-center gap-1"><Calendar size={10} /> {entry.date}</span>
                                        {entry.note && <span className="text-xs text-zinc-400 border-l border-zinc-700 pl-2">{entry.note}</span>}
                                    </div>
                                </div>
                                <button onClick={() => onDeleteHistory(goal.id, entry.id)} className="text-zinc-500 hover:text-red-500 p-3 rounded-lg"><Trash2 size={18} /></button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
          </div>

          <div className="pt-8 border-t border-zinc-800 mb-8">
            <button onClick={() => onDeleteGoal(goal.id)} className="w-full py-4 rounded-xl border border-red-900/50 bg-red-900/10 text-red-500 font-bold text-sm flex items-center justify-center gap-2">
                <AlertCircle size={18} /> BU HEDEFİ TAMAMEN SİL
            </button>
          </div>
      </div>
    </div>
  );
};
