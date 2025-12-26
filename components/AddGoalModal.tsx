import React, { useState } from 'react';
import { Category, GoalType } from '../types';
import { ArrowLeft, Check, Target, Zap } from 'lucide-react';

interface AddGoalScreenProps {
  onClose: () => void;
  onAdd: (title: string, category: Category, type: GoalType, current: number, target: number, unit: string) => void;
}

export const AddGoalModal: React.FC<AddGoalScreenProps> = ({ onClose, onAdd }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Category>('other');
  const [type, setType] = useState<GoalType>('numeric');
  const [current, setCurrent] = useState('');
  const [target, setTarget] = useState('');
  const [unit, setUnit] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    
    onAdd(
      title, 
      category, 
      type,
      Number(current) || 0, 
      type === 'streak' ? 365 : Number(target), 
      type === 'streak' ? 'gün' : (unit || 'birim')
    );
    
    onClose();
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col animate-fade-in">
      <div className="p-4 border-b border-zinc-900 flex items-center gap-4 bg-zinc-950 sticky top-0 z-10">
        <button onClick={onClose} className="p-2 -ml-2 text-zinc-400 hover:text-white rounded-full hover:bg-zinc-900 transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-lg font-bold">Yeni Hedef Oluştur</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="p-5 space-y-6 flex-1 overflow-y-auto pb-24">
        
        {/* Title */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-indigo-500 uppercase tracking-wider">HEDEF BAŞLIĞI</label>
          <input 
            required
            type="text" 
            placeholder="Örn: İngilizce Öğrenmek"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-zinc-900 border-b-2 border-zinc-800 focus:border-indigo-500 px-4 py-3 text-xl font-semibold text-white placeholder-zinc-700 outline-none transition-colors rounded-t-lg"
          />
        </div>

        {/* Goal Type Selection */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">HEDEF TİPİ</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setType('numeric')}
              className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${type === 'numeric' ? 'bg-indigo-600/20 border-indigo-500 text-white' : 'bg-zinc-900 border-zinc-800 text-zinc-500'}`}
            >
              <Target size={24} />
              <span className="text-xs font-bold uppercase">Ölçülebilir</span>
            </button>
            <button
              type="button"
              onClick={() => setType('streak')}
              className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${type === 'streak' ? 'bg-orange-600/20 border-orange-500 text-white' : 'bg-zinc-900 border-zinc-800 text-zinc-500'}`}
            >
              <Zap size={24} />
              <span className="text-xs font-bold uppercase">Seri (Streak)</span>
            </button>
          </div>
        </div>

        {/* Category */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">KATEGORİ</label>
          <select 
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-white appearance-none focus:border-indigo-500 outline-none"
          >
            <option value="education">Eğitim</option>
            <option value="finance">Finans</option>
            <option value="health">Sağlık</option>
            <option value="social">Sosyal</option>
            <option value="other">Diğer</option>
          </select>
        </div>

        {type === 'numeric' ? (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">BİRİM</label>
                <input 
                  type="text" 
                  placeholder="TL, kg..."
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-white focus:border-indigo-500 outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">BAŞLANGIÇ</label>
                <input 
                  type="number" 
                  placeholder="0"
                  value={current}
                  onChange={(e) => setCurrent(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-white focus:border-indigo-500 outline-none font-mono"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">HEDEF DEĞER</label>
              <input 
                required={type === 'numeric'}
                type="number" 
                placeholder="100"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-white focus:border-indigo-500 outline-none font-mono"
              />
            </div>
          </div>
        ) : (
          <div className="bg-orange-500/10 border border-orange-500/20 p-4 rounded-xl text-sm text-orange-200 leading-relaxed animate-in slide-in-from-bottom-2 duration-300">
            <p className="font-bold flex items-center gap-2 mb-1">
              <Zap size={14} /> Seri Hedefi Modu
            </p>
            Seri hedeflerinde her gün "Seriyi Sürdür" butonuna basarak ilerleme kaydedersiniz. Uygulama sizin için ardışık günleri takip eder.
          </div>
        )}

        <button 
          type="submit"
          className={`w-full font-bold py-4 rounded-xl mt-8 shadow-lg flex items-center justify-center gap-2 text-lg transition-all active:scale-95 ${type === 'streak' ? 'bg-orange-600 hover:bg-orange-700 shadow-orange-900/20' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-900/20'}`}
        >
          <Check size={20} />
          HEDEFİ KAYDET
        </button>
      </form>
    </div>
  );
};