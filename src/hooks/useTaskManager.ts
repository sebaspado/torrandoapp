import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Task } from '@/types/task';

export const useTaskManager = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const { data: session } = useSession();

  // Get storage key based on user email
  const getStorageKey = () => {
    if (!session?.user?.email) return null;
    return `tasks_${session.user.email}`;
  };

  // Load tasks from localStorage on mount
  useEffect(() => {
    const storageKey = getStorageKey();
    if (storageKey) {
      try {
        const storedTasks = localStorage.getItem(storageKey);
        if (storedTasks) {
          setTasks(JSON.parse(storedTasks));
        }
      } catch (error) {
        console.error('Failed to load tasks:', error);
      }
    }
  }, [session]);

  const saveToStorage = (updatedTasks: Task[]) => {
    const storageKey = getStorageKey();
    if (storageKey) {
      try {
        localStorage.setItem(storageKey, JSON.stringify(updatedTasks));
      } catch (error) {
        console.error('Failed to save tasks:', error);
      }
    }
  };

  const addTask = (newTask: Task) => {
    setTasks(prevTasks => {
      const updatedTasks = [...prevTasks, newTask];
      saveToStorage(updatedTasks);
      return updatedTasks;
    });
  };

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    setTasks(prevTasks => {
      const updatedTasks = prevTasks.map(task =>
        task.id === taskId ? { ...task, ...updates } : task
      );
      saveToStorage(updatedTasks);
      return updatedTasks;
    });
  };

  const deleteTask = (taskId: string) => {
    setTasks(prevTasks => {
      const updatedTasks = prevTasks.filter(task => task.id !== taskId);
      saveToStorage(updatedTasks);
      return updatedTasks;
    });
  };

  const clearTasks = () => {
    if (!session?.user?.email) return;
    localStorage.removeItem(session.user.email);
    setTasks([]);
  };

  return {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    clearTasks
  };
}; 