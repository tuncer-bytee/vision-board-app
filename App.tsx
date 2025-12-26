import React, { useState, useEffect } from 'react';
import { Reorder } from 'framer-motion';
import { Goal, Category, GoalType } from './types';
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
    type: 'numeric',
    currentValue: 45,
    targetValue: 120,
    unit: 'puan',
    history: [{ id: '101', date: '2025-10-01', value: 45, note: 'Başlangıç seviyesi testi' }]
  },
  {
    id: '2',
    title: 'Günlük Diyet & Su',
    category: 'health',
    type: 'streak',
    currentValue: 0,
    targetValue: 365,
    unit: 'gün',
    history: [] // Start empty, manual click required
  }
];

type ViewState = 'dashboard' | 'add_goal' | 'goal_detail';

export default function App() {
  const [goals, setGoals] = useState<Goal[]>(() => {
    const saved = localStorage.getItem('myGoals2026_v3');
    return saved ? JSON.parse(saved) : INITIAL_GOALS;
  });
  
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [goalToDelete, setGoalToDelete] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('myGoals2026_v3', JSON.stringify(goals));
  }, [goals]);

  const goHome = () => {
    setCurrentView('dashboard');
    setSelectedGoalId(null);
  };

  const openAddGoal = () => setCurrentView('add_goal');

  const openDetail = (goal: Goal) => {
    setSelectedGoalId(goal.id);
    setCurrentView('goal_detail');
  };

  const handleAddGoal = (title: string, category: Category, type: GoalType, current: number, target: number, unit: string) => {
    const newGoal: Goal = {
      id: Date.now().toString(),
      title,
      category,
      type,
      currentValue: current,
      targetValue: target,
      unit,
      history: type === 'streak' ? [] : [{
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
        // Check if entry for this date already exists to prevent double streak check-ins
        if (g.type === 'streak' && g.history.some(h => h.date === date)) return g;
        
        const newHistory = [
            ...g.history, 
            { id: Date.now().toString(), date, value, note }
        ].sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        
        return { ...g, currentValue: value, history: newHistory };
    }));
  };

  const handleQuickCheckIn = (goalId: string) => {
      const todayStr = new Date().toISOString().split('T')[0];
      handleAddHistory(goalId, 1, todayStr, 'Hızlı Onay');
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

  const requestDeleteGoal = (id: string) => {
    setGoalToDelete(id);
    setConfirmOpen(true);
  };

  const confirmDeleteGoal = () => {
    if (goalToDelete) {
      setGoals(prev => prev.filter(g => g.id !== goalToDelete));
      if (selectedGoalId === goalToDelete) goHome();
    }
    setConfirmOpen(false);
    setGoalToDelete(null);
  };

  if (currentView === 'add_goal') {
      return <AddGoalModal onClose={goHome} onAdd={handleAddGoal} />;
  }

  if (currentView === 'goal_detail' && selectedGoalId) {
      const goal = goals.find(g => g.id === selectedGoalId);
      if (goal) {
          return (
            <>
                <GoalDetailModal goal={goal} onClose={goHome} onAddHistory={handleAddHistory} onDeleteHistory={handleDeleteHistory} onDeleteGoal={() => requestDeleteGoal(goal.id)} />
                <ConfirmModal isOpen={confirmOpen} title="Hedefi Sil" message="Bu hedefi ve tüm geçmiş verilerini silmek istediğinize emin misiniz?" onConfirm={confirmDeleteGoal} onCancel={() => setConfirmOpen(false)} />
            </>
          );
      }
  }

  return (
    <div className="min-h-screen pb-24 max-w-md mx-auto bg-zinc-950 text-zinc-100 shadow-2xl min-w-[320px] flex flex-col animate-fade-in">
      <nav className="p-6 pb-2 border-b border-zinc-900 flex justify-between items-center sticky top-0 bg-zinc-950/90 backdrop-blur-sm z-30">
        <div>
           <div className="text-xs font-bold text-zinc-500 tracking-[0.2em] mb-1">HEDEF TAKİP</div>
           <h1 className="text-2xl font-bold tracking-tight text-white">2026 Vizyonum</h1>
        </div>
        <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center border border-zinc-800">
           <LayoutGrid size={20} className="text-zinc-400" />
        </div>
      </nav>

      <div className="p-5 grid grid-cols-2 gap-4">
          <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 flex flex-col justify-between h-28">
              <div className="text-zinc-500 text-xs font-semibold uppercase">Hedef Sayısı</div>
              <div className="text-4xl font-mono font-bold text-white">{goals.length}</div>
          </div>
          <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 flex flex-col justify-between h-28">
              <div className="text-zinc-500 text-xs font-semibold uppercase">Aktif Seriler</div>
              <div className="text-4xl font-mono font-bold text-orange-400">{goals.filter(g => g.type === 'streak').length}</div>
          </div>
      </div>

      <main className="px-5 flex-1 relative z-20">
        <div className="flex items-center gap-2 mb-4 mt-2">
            <Target className="text-indigo-500" size={16} />
            <h2 className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Hedefler</h2>
        </div>

        {goals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-zinc-600 border border-dashed border-zinc-800 rounded-xl bg-zinc-900/30">
            <Target size={48} className="mb-4 opacity-20" />
            <p className="mb-2 text-sm">Liste boş.</p>
          </div>
        ) : (
          <Reorder.Group axis="y" values={goals} onReorder={setGoals} className="space-y-4">
            {goals.map(goal => (
                <DraggableGoalItem 
                    key={goal.id} 
                    goal={goal} 
                    onDelete={requestDeleteGoal} 
                    onOpenDetail={openDetail}
                    onQuickCheckIn={handleQuickCheckIn}
                />
            ))}
          </Reorder.Group>
        )}
      </main>

      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-zinc-950 via-zinc-950 to-transparent pointer-events-none flex justify-center max-w-md mx-auto z-40">
        <button onClick={openAddGoal} className="pointer-events-auto bg-white text-black hover:bg-zinc-200 rounded-lg py-3 px-6 shadow-lg transform transition active:scale-95 flex items-center gap-3 font-bold text-sm w-full justify-center">
          <Plus size={20} />
          <span>YENİ HEDEF EKLE</span>
        </button>
      </div>

      <ConfirmModal isOpen={confirmOpen} title="Hedefi Sil" message="Emin misiniz?" onConfirm={confirmDeleteGoal} onCancel={() => setConfirmOpen(false)} />
    </div>
  );
}