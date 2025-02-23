import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Goal } from '@/types/goal';

export const useGoalManager = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user?.email) {
      try {
        const storedGoals = localStorage.getItem(`goals_${session.user.email}`);
        if (storedGoals) {
          const parsed = JSON.parse(storedGoals);
          setGoals(parsed.map((g: any) => ({
            ...g,
            createdAt: new Date(g.createdAt)
          })));
        }
      } catch (error) {
        console.error('Failed to load goals:', error);
      }
    }
  }, [session]);

  const addGoal = (goal: Goal) => {
    setGoals(prev => {
      const updated = [...prev, goal];
      if (session?.user?.email) {
        localStorage.setItem(`goals_${session.user.email}`, JSON.stringify(updated));
      }
      return updated;
    });
  };

  const updateGoal = (goalId: string, updates: Partial<Goal>) => {
    setGoals(prev => {
      const updated = prev.map(goal =>
        goal.id === goalId ? { ...goal, ...updates } : goal
      );
      if (session?.user?.email) {
        localStorage.setItem(`goals_${session.user.email}`, JSON.stringify(updated));
      }
      return updated;
    });
  };

  const deleteGoal = (goalId: string) => {
    setGoals(prev => {
      const updated = prev.filter(g => g.id !== goalId);
      if (session?.user?.email) {
        localStorage.setItem(`goals_${session.user.email}`, JSON.stringify(updated));
      }
      return updated;
    });
  };

  return {
    goals,
    addGoal,
    updateGoal,
    deleteGoal
  };
}; 