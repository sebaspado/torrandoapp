import { useTasks } from '@/contexts/TaskContext';
import { useEffect } from 'react';

export const TaskDebug = () => {
  const { tasks } = useTasks();

  useEffect(() => {
    console.log('Current tasks:', tasks);
  }, [tasks]);

  return null;
}; 