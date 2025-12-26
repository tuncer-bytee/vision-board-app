import React from 'react';
import { Goal } from '../types';
import { Trash2, ChevronRight, Calendar, GripVertical } from 'lucide-react';
import { DragControls } from 'framer-motion';

interface GoalCardProps {
  goal: Goal;
  onDelete: (id: string) => void;
  onOpenDetail: (goal: Goal) => void;
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
  dragControls
}) => {
  const progress = Math.min(100, Math.max(0, (goal.currentValue / goal.targetValue) * 100));
  
  const lastEntry = goal.history && goal.history.length > 0 
    ? goal.history[goal.history.length - 1] 
    : null;

  return (
    <div 
      onClick={() => onOpenDetail(goal)}
      className="bg-zinc-900 rounded-xl p-0 border border-zinc-800 mb-4 shadow-sm relative overflow-hidden active:bg-zinc-800/50 transition-colors cursor-pointer flex"
    >
      {/* Content Area */}
      <div className="flex-1 p-5 pr-2">
        {/* Header */}
        <div className="mb-4">
            <div className="text-[10px] uppercase tracking-wider font-bold text-zinc-500 mb-1 flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${progress >= 100 ? 'bg-emerald-500' : 'bg-indigo-500'}`}></span>
                {CATEGORY_LABELS[goal.category] || 'GENEL'}
            </div>
            <h3 className="text-lg font-semibold text-white leading-tight mt-1">{goal.title}</h3>
        </div>

        {/* Progress */}
        <div className="mb-4">
            <div className="flex justify-between text-xs text-zinc-400 mb-2 font-mono">
            <span>İLERLEME</span>
            <span className="text-white">%{progress.toFixed(1)}</span>
            </div>
            <div className="w-full bg-zinc-950 rounded-full h-2 overflow-hidden border border-zinc-800">
            <div 
                className={`h-full transition-all duration-700 ease-out ${progress >= 100 ? 'bg-emerald-500' : 'bg-indigo-500'}`}
                style={{ width: `${progress}%` }}
            />
            </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-2">
            <div className="flex flex-col gap-1">
                <div className="flex items-baseline gap-1">
                    <span className="text-lg font-mono text-zinc-200 font-bold">{goal.currentValue.toLocaleString()}</span>
                    <span className="text-xs text-zinc-500">/ {goal.targetValue.toLocaleString()} {goal.unit}</span>
                </div>
                {lastEntry && (
                    <div className="flex items-center gap-1 text-[10px] text-zinc-500">
                        <Calendar size={10} />
                        <span>Son: {lastEntry.date}</span>
                    </div>
                )}
            </div>
        </div>
      </div>

      {/* Actions Area (Right Side) */}
      <div className="w-14 bg-zinc-950/30 border-l border-zinc-800 flex flex-col items-center justify-between py-2">
         {/* Delete Button */}
         <button 
            onClick={(e) => { 
                e.stopPropagation(); 
                onDelete(goal.id); 
            }}
            className="p-3 text-zinc-600 hover:text-red-500 active:text-red-500 transition-colors"
            aria-label="Sil"
         >
            <Trash2 size={18} />
         </button>

         {/* Drag Handle */}
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