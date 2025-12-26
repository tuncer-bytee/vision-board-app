import React, { useState, useEffect } from 'react';
import { Reorder } from 'framer-motion';
import { Goal, Category } from './types';
import { AddGoalModal } from './components/AddGoalModal';
import { GoalDetailModal } from './components/GoalDetailModal';
import { DraggableGoalItem } from './components/DraggableGoalItem';
import { ConfirmModal } from './components/ConfirmModal';
import { Plus, Target, LayoutGrid } from 'lucide-react';

const INITIAL_GOALS: Goal[] = [
  {
    id: '1',
    title: 'İngilizce TOEFL Seviyesi',
    category: 'education',
    currentValue: 45,
    targetValue: 120,
    unit: 'puan',
    history: [{ id: '101', date: '2025-10-01', value: 45, note: 'Başlangıç seviyesi testi' }]
  },
  {
    id: '2',
    title: 'Araba İçin Birikim',
    category: 'finance',
    currentValue: 150000,
    targetValue: 500000,
    unit: 'TL',
    history: [{ id: '201', date: '2025-09-15', value: 150000, note: 'Vadeli hesaptaki toplam' }]
  },
  {
    id: '3',
    title: 'Fit Vücut & Diyet',
    category: 'health',
    currentValue: 82,
    targetValue: 70,
    unit: 'kg',
    history: [{ id: '301', date: '2025-10-10', value: 82, note: 'Diyet başlangıcı' }]
  },
  {
    id: '4',
    title: 'Instagram Fenomeni',
    category: 'social',
    currentValue: 2400,
    targetValue: 20000,
    unit: 'takipçi',
    history: [{ id: '401', date: '2025-10-05', value: 2400, note: 'Organik büyüme' }]
  }
];

type ViewState = 'dashboard' | 'add_goal' | 'goal_detail';

export default function App() {
  const [goals, setGoals] = useState<Goal[]>(() => {
    const saved = localStorage.getItem('myGoals2026_v2');
    return saved ? JSON.parse(saved) : INITIAL_GOALS;
  });
  
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);

  // Confirmation Modal State
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [goalToDelete, setGoalToDelete] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('myGoals2026_v2', JSON.stringify(goals));
  }, [goals]);

  // View Navigation Helpers
  const goHome = () => {
    setCurrentView('dashboard');
    setSelectedGoalId(null);
  };

  const openAddGoal = () => {
    setCurrentView('add_goal');
  };

  const openDetail = (goal: Goal) => {
    setSelectedGoalId(goal.id);
    setCurrentView('goal_detail');
  };

  // Logic Helpers
  const handleAddGoal = (title: string, category: Category, current: number, target: number, unit: string) => {
    const newGoal: Goal = {
      id: Date.now().toString(),
      title,
      category,
      currentValue: current,
      targetValue: target,
      unit,
      history: [{
        id: Date.now().toString() + '_init',
        date: new Date().toISOString().split('T')[0],
        value: current,
        note: 'Başlangıç'
      }]
    };
    setGoals(prev => [newGoal, ...prev]);
  };

  const handleAddHistory = (goalId: string, value: number, date: string, note: string) => {
    setGoals(prev => prev.map(g => {
        if (g.id !== goalId) return g;
        const newHistory = [
            ...g.history, 
            { id: Date.now().toString(), date, value, note }
        ];
        return { ...g, currentValue: value, history: newHistory };
    }));
  };

  const handleDeleteHistory = (goalId: string, historyId: string) => {
      setGoals(prev => prev.map(g => {
          if (g.id !== goalId) return g;
          const newHistory = g.history.filter(h => h.id !== historyId);
          const lastEntry = newHistory.length > 0 ? newHistory[newHistory.length - 1] : null;
          return {
              ...g,
              currentValue: lastEntry ? lastEntry.value : 0,
              history: newHistory
          };
      }));
  };

  // Safe Delete Flow
  const requestDeleteGoal = (id: string) => {
    setGoalToDelete(id);
    setConfirmOpen(true);
  };

  const confirmDeleteGoal = () => {
    if (goalToDelete) {
      setGoals(prev => prev.filter(g => g.id !== goalToDelete));
      
      // If we were on the detail screen for this goal, go home
      if (selectedGoalId === goalToDelete) {
        goHome();
      }
    }
    setConfirmOpen(false);
    setGoalToDelete(null);
  };

  // --- RENDER VIEWS ---

  // 1. Add Goal View
  if (currentView === 'add_goal') {
      return <AddGoalModal onClose={goHome} onAdd={handleAddGoal} />;
  }

  // 2. Goal Detail View
  if (currentView === 'goal_detail' && selectedGoalId) {
      const goal = goals.find(g => g.id === selectedGoalId);
      if (goal) {
          return (
            <>
                <GoalDetailModal 
                    goal={goal} 
                    onClose={goHome} 
                    onAddHistory={handleAddHistory}
                    onDeleteHistory={handleDeleteHistory}
                    onDeleteGoal={() => requestDeleteGoal(goal.id)}
                />
                <ConfirmModal 
                    isOpen={confirmOpen}
                    title="Hedefi Sil"
                    message="Bu hedefi ve tüm geçmiş verilerini silmek istediğinize emin misiniz? Bu işlem geri alınamaz."
                    onConfirm={confirmDeleteGoal}
                    onCancel={() => setConfirmOpen(false)}
                />
            </>
          );
      }
  }

  // 3. Dashboard View (Default)
  const totalGoals = goals.length;
  const completedGoals = goals.filter(g => {
      const initial = g.history.length > 0 ? g.history[0].value : 0;
      if (initial > g.targetValue) return g.currentValue <= g.targetValue;
      return g.currentValue >= g.targetValue;
  }).length;

  const totalProgress = goals.length > 0 
    ? goals.reduce((acc, curr) => {
        const initial = curr.history.length > 0 ? curr.history[0].value : 0;
        let p = 0;
        if (initial > curr.targetValue) { // Weight loss logic
             const totalDiff = initial - curr.targetValue;
             const currentDiff = initial - curr.currentValue;
             p = (currentDiff / totalDiff) * 100;
        } else {
             p = (curr.currentValue / curr.targetValue) * 100;
        }
        return acc + Math.min(100, Math.max(0, p));
    }, 0) / goals.length 
    : 0;

  return (
    <div className="min-h-screen pb-24 max-w-md mx-auto bg-zinc-950 text-zinc-100 shadow-2xl min-w-[320px] flex flex-col animate-fade-in">
      
      {/* Navbar Block */}
      <nav className="p-6 pb-2 border-b border-zinc-900 flex justify-between items-center sticky top-0 bg-zinc-950/90 backdrop-blur-sm z-30">
        <div>
           <div className="text-xs font-bold text-zinc-500 tracking-[0.2em] mb-1">HEDEF TAKİP</div>
           <h1 className="text-2xl font-bold tracking-tight text-white">2026 Vizyonum</h1>
        </div>
        <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center border border-zinc-800">
           <LayoutGrid size={20} className="text-zinc-400" />
        </div>
      </nav>

      {/* Stats Block */}
      <div className="p-5 grid grid-cols-2 gap-4">
          <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 flex flex-col justify-between h-28">
              <div className="text-zinc-500 text-xs font-semibold uppercase">Genel İlerleme</div>
              <div className="text-4xl font-mono font-bold text-white">{totalProgress.toFixed(0)}%</div>
          </div>
          <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 flex flex-col justify-between h-28">
              <div className="text-zinc-500 text-xs font-semibold uppercase">Tamamlanan</div>
              <div className="text-4xl font-mono font-bold text-indigo-400">{completedGoals}<span className="text-zinc-600 text-lg">/{totalGoals}</span></div>
          </div>
      </div>

      {/* Content Area */}
      <main className="px-5 flex-1 relative z-20">
        <div className="flex items-center gap-2 mb-4 mt-2">
            <Target className="text-indigo-500" size={16} />
            <h2 className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Hedefler</h2>
        </div>

        {goals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-zinc-600 border border-dashed border-zinc-800 rounded-xl bg-zinc-900/30">
            <Target size={48} className="mb-4 opacity-20" />
            <p className="mb-2 text-sm">Liste boş.</p>
            <p className="text-xs">Yeni bir hedef ekleyerek başla.</p>
          </div>
        ) : (
          <Reorder.Group axis="y" values={goals} onReorder={setGoals} className="space-y-4">
            {goals.map(goal => (
                <DraggableGoalItem 
                    key={goal.id} 
                    goal={goal} 
                    onDelete={requestDeleteGoal}
                    onOpenDetail={openDetail}
                />
            ))}
          </Reorder.Group>
        )}
      </main>

      {/* Footer / Floating Action Block */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-zinc-950 via-zinc-950 to-transparent pointer-events-none flex justify-center max-w-md mx-auto z-40">
        <button 
          onClick={openAddGoal}
          className="pointer-events-auto bg-white text-black hover:bg-zinc-200 rounded-lg py-3 px-6 shadow-lg shadow-zinc-900/50 transform transition hover:scale-105 active:scale-95 flex items-center gap-3 font-bold text-sm w-full justify-center border border-zinc-200"
        >
          <Plus size={20} />
          <span>YENİ HEDEF EKLE</span>
        </button>
      </div>

      <ConfirmModal 
        isOpen={confirmOpen}
        title="Hedefi Sil"
        message="Bu hedefi silmek istediğinize emin misiniz? Bu işlem geri alınamaz."
        onConfirm={confirmDeleteGoal}
        onCancel={() => setConfirmOpen(false)}
      />

    </div>
  );
}