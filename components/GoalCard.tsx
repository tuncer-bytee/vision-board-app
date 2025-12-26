
import React, { useMemo } from 'react';
import { Goal } from '../types';
import { Trash2, Calendar, GripVertical, Flame, Target, CheckCircle2 } from 'lucide-react';
import { DragControls, motion } from 'framer-motion';

interface GoalCardProps {
  goal: Goal;
  onDelete: (id: string) => void;
  onOpenDetail: (goal: Goal) => void;
  onQuickCheckIn: (goalId: string) => void;
  dragControls?: DragControls;
}

const CATEGORY_LABELS: Record<string, string> = {
  education: 'Eğitim',
  finance: 'Finans',
  health: 'Sağlık',
  social: 'Sosyal',
  other: 'Diğer',
};

export const GoalCard: React.FC<GoalCardProps> = ({ 
  goal, 
  onDelete, 
  onOpenDetail,
  onQuickCheckIn,
  dragControls
}) => {
  const todayStr = new Date().toISOString().split('T')[0];
  const isCheckedToday = goal.history.some(h => h.date === todayStr);

  const streakStats = useMemo(() => {
    if (goal.type !== 'streak') return null;
    // Explicitly type dates as string[] to help TS inference
    const dates: string[] = Array.from(new Set(goal.history.map(h => h.date))).sort();
    if (dates.length === 0) return { current: 0, total: 0 };

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let current = 0;
    // Typing the map parameter d as string to resolve new Date() overload error
    const sortedDates = dates.map((d: string) => new Date(d)).sort((a, b) => b.getTime() - a.getTime());
    
    const lastEntryDate = sortedDates[0];
    const diff = (today.getTime() - lastEntryDate.getTime()) / (1000 * 60 * 60 * 24);

    if (diff <= 1) {
      current = 1;
      for (let i = 0; i < sortedDates.length - 1; i++) {
        const d1 = sortedDates[i];
        const d2 = sortedDates[i + 1];
        const dDiff = (d1.getTime() - d2.getTime()) / (1000 * 60 * 60 * 24);
        if (dDiff === 1) {
          current++;
        } else {
          break;
        }
      }
    }

    return { current, total: dates.length };
  }, [goal.history, goal.type]);

  const progress = goal.type === 'numeric' 
    ? Math.min(100, Math.max(0, (goal.currentValue / goal.targetValue) * 100))
    : 0;
  
  const lastEntry = goal.history && goal.history.length > 0 
    ? goal.history[goal.history.length - 1] 
    : null;

  return (
    <div 
      onClick={() => onOpenDetail(goal)}
      className="bg-zinc-900 rounded-xl p-0 border border-zinc-800 mb-4 shadow-sm relative overflow-hidden active:bg-zinc-800/50 transition-colors cursor-pointer flex"
    >
      <div className="flex-1 p-5 pr-2">
        <div className="mb-4">
            <div className="text-[10px] uppercase tracking-wider font-bold text-zinc-500 mb-1 flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${goal.type === 'streak' ? 'bg-orange-500' : 'bg-indigo-500'}`}></span>
                {CATEGORY_LABELS[goal.category] || 'GENEL'}
                <span className="opacity-30">•</span>
                <span className="flex items-center gap-1">
                    {goal.type === 'streak' ? <Flame size={10} className="text-orange-500" /> : <Target size={10} className="text-indigo-500" />}
                    {goal.type === 'streak' ? 'SERİ' : 'ÖLÇÜM'}
                </span>
            </div>
            <h3 className="text-lg font-semibold text-white leading-tight mt-1">{goal.title}</h3>
        </div>

        {goal.type === 'numeric' ? (
            <div className="mb-4">
                <div className="flex justify-between text-xs text-zinc-400 mb-2 font-mono">
                    <span>İLERLEME</span>
                    <span className="text-white">%{progress.toFixed(1)}</span>
                </div>
                <div className="w-full bg-zinc-950 rounded-full h-2 overflow-hidden border border-zinc-800">
                    <div className="h-full transition-all duration-700 ease-out bg-indigo-500" style={{ width: `${progress}%` }} />
                </div>
            </div>
        ) : (
            <div className="flex items-center gap-3 mb-4">
                <div className="bg-zinc-950/50 border border-zinc-800 rounded-lg p-2.5 flex flex-col flex-1 items-center justify-center">
                    <span className="text-[8px] text-zinc-500 font-bold uppercase mb-0.5">SERİ</span>
                    <div className="flex items-center gap-1 text-orange-500">
                        <span className="text-xl font-black font-mono leading-none">{streakStats?.current || 0}</span>
                        <Flame size={14} />
                    </div>
                </div>

                {!isCheckedToday ? (
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                            e.stopPropagation();
                            onQuickCheckIn(goal.id);
                        }}
                        className="flex-[2] bg-white text-black rounded-lg py-2.5 flex items-center justify-center gap-2 font-black text-xs shadow-lg shadow-white/5 border border-white"
                    >
                        <CheckCircle2 size={16} />
                        BUGÜNÜ YAPTIM
                    </motion.button>
                ) : (
                    <div className="flex-[2] bg-zinc-800/50 border border-zinc-700/50 rounded-lg py-2.5 flex items-center justify-center gap-2 text-emerald-500 font-bold text-xs">
                        <CheckCircle2 size={16} />
                        TAMAMLANDI
                    </div>
                )}
            </div>
        )}

        <div className="flex items-center justify-between mt-2">
            <div className="flex flex-col gap-1">
                {goal.type === 'numeric' && (
                    <div className="flex items-baseline gap-1">
                        <span className="text-lg font-mono text-zinc-200 font-bold">{goal.currentValue.toLocaleString()}</span>
                        <span className="text-xs text-zinc-500">/ {goal.targetValue.toLocaleString()} {goal.unit}</span>
                    </div>
                )}
                {lastEntry && (
                    <div className="flex items-center gap-1 text-[10px] text-zinc-500">
                        <Calendar size={10} />
                        <span>Son Kayıt: {lastEntry.date}</span>
                    </div>
                )}
            </div>
        </div>
      </div>

      <div className="w-14 bg-zinc-950/30 border-l border-zinc-800 flex flex-col items-center justify-between py-2">
         <button 
            onClick={(e) => { 
                e.stopPropagation(); 
                onDelete(goal.id); 
            }} 
            className="p-3 text-zinc-600 hover:text-red-500 transition-colors"
         >
            <Trash2 size={18} />
         </button>
         <div 
            className="p-3 text-zinc-600 hover:text-white cursor-grab active:cursor-grabbing touch-none" 
            onPointerDown={(e) => dragControls?.start(e)}
         >
             <GripVertical size={20} />
         </div>
      </div>
    </div>
  );
};
