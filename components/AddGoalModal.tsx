import React, { useState } from 'react';
import { Category } from '../types';
import { ArrowLeft, Check } from 'lucide-react';

interface AddGoalScreenProps {
  onClose: () => void;
  onAdd: (title: string, category: Category, current: number, target: number, unit: string) => void;
}

export const AddGoalModal: React.FC<AddGoalScreenProps> = ({ onClose, onAdd }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Category>('other');
  const [current, setCurrent] = useState('');
  const [target, setTarget] = useState('');
  const [unit, setUnit] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !target) return;
    
    onAdd(
      title, 
      category, 
      Number(current) || 0, 
      Number(target), 
      unit || 'birim'
    );
    
    // Reset and go back
    setTitle('');
    setCategory('other');
    setCurrent('');
    setTarget('');
    setUnit('');
    onClose();
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col animate-fade-in">
      {/* Mobile Navbar */}
      <div className="p-4 border-b border-zinc-900 flex items-center gap-4 bg-zinc-950 sticky top-0 z-10">
        <button 
          onClick={onClose} 
          className="p-2 -ml-2 text-zinc-400 hover:text-white rounded-full hover:bg-zinc-900 transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-lg font-bold">Yeni Hedef Oluştur</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="p-5 space-y-6 flex-1 overflow-y-auto">
        
        {/* Title Input */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-indigo-500 uppercase tracking-wider">HEDEF BAŞLIĞI</label>
          <input 
            required
            type="text" 
            placeholder="Örn: İngilizce Öğrenmek"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-zinc-900 border-b-2 border-zinc-800 focus:border-indigo-500 px-0 py-3 text-xl font-semibold text-white placeholder-zinc-700 outline-none transition-colors rounded-t-lg px-2"
          />
        </div>

        {/* Category & Unit */}
        <div className="grid grid-cols-2 gap-5">
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">KATEGORİ</label>
            <div className="relative">
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Category)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-white appearance-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                >
                  <option value="education">Eğitim</option>
                  <option value="finance">Finans</option>
                  <option value="health">Sağlık</option>
                  <option value="social">Sosyal</option>
                  <option value="other">Diğer</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                    ▼
                </div>
            </div>
          </div>
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
        </div>

        {/* Values */}
        <div className="bg-zinc-900/50 p-5 rounded-2xl border border-zinc-800 space-y-5">
            <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">BAŞLANGIÇ DEĞERİ</label>
                <input 
                    type="number" 
                    placeholder="0"
                    value={current}
                    onChange={(e) => setCurrent(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl p-3 text-lg font-mono text-white focus:border-indigo-500 outline-none"
                />
            </div>
            <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">HEDEF DEĞER</label>
                <input 
                    required
                    type="number" 
                    placeholder="100"
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl p-3 text-lg font-mono text-white focus:border-indigo-500 outline-none"
                />
            </div>
        </div>

        <button 
          type="submit"
          className="w-full bg-indigo-600 active:bg-indigo-700 text-white font-bold py-4 rounded-xl mt-8 shadow-lg shadow-indigo-900/20 flex items-center justify-center gap-2 text-lg"
        >
          <Check size={20} />
          HEDEFİ KAYDET
        </button>
      </form>
    </div>
  );
};