import React from 'react';
import { Reorder, useDragControls } from 'framer-motion';
import { Goal } from '../types';
import { GoalCard } from './GoalCard';

interface DraggableGoalItemProps {
  goal: Goal;
  onDelete: (id: string) => void;
  onOpenDetail: (goal: Goal) => void;
}

export const DraggableGoalItem: React.FC<DraggableGoalItemProps> = ({ goal, onDelete, onOpenDetail }) => {
  const controls = useDragControls();
  
  return (
    <Reorder.Item
      value={goal}
      dragListener={false} // Tüm kartın sürüklenmesini engelle
      dragControls={controls} // Sadece tutamaç ile sürükle
      className="relative touch-none"
    >
      <GoalCard 
        goal={goal} 
        onDelete={onDelete} 
        onOpenDetail={onOpenDetail} 
        dragControls={controls}
      />
    </Reorder.Item>
  );
};