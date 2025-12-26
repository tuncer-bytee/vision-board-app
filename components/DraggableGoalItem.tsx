import React from 'react';
import { Reorder, useDragControls } from 'framer-motion';
import { Goal } from '../types';
import { GoalCard } from './GoalCard';

interface DraggableGoalItemProps {
  goal: Goal;
  onDelete: (id: string) => void;
  onOpenDetail: (goal: Goal) => void;
  onQuickCheckIn: (goalId: string) => void;
}

export const DraggableGoalItem: React.FC<DraggableGoalItemProps> = ({ goal, onDelete, onOpenDetail, onQuickCheckIn }) => {
  const controls = useDragControls();
  
  return (
    <Reorder.Item
      value={goal}
      dragListener={false} 
      dragControls={controls} 
      className="relative touch-none"
    >
      <GoalCard 
        goal={goal} 
        onDelete={onDelete} 
        onOpenDetail={onOpenDetail} 
        onQuickCheckIn={onQuickCheckIn}
        dragControls={controls}
      />
    </Reorder.Item>
  );
};