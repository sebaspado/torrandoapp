import { useState, useEffect, useCallback } from 'react';
import { Task } from '@/types/task';
import { useSession } from 'next-auth/react';

const STORAGE_KEY_PREFIX = 'taskManager_tasks_';
const DEBUG = process.env.NODE_ENV !== 'production';

export const useTasks = (initialTasks: Task[] = []) => {
  const { data: session, status } = useSession();
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [isLoaded, setIsLoaded] = useState(false);

  const getStorageKey = useCallback(() => {
    return `${STORAGE_KEY_PREFIX}${session?.user?.email || 'anonymous'}`;
  }, [session?.user?.email]);

  // Load tasks only when session is ready
  useEffect(() => {
    if (!session?.user?.email || status !== 'authenticated' || isLoaded) return;

    const storageKey = getStorageKey();
    try {
      const savedTasks = localStorage.getItem(storageKey);
      if (savedTasks) {
        const parsedTasks = JSON.parse(savedTasks);
        const tasksWithDates = parsedTasks.map((task: Task) => ({
          ...task,
          dueDate: new Date(task.dueDate)
        }));
        setTasks(tasksWithDates);
      }
      setIsLoaded(true);
    } catch (error) {
      if (DEBUG) {
        console.error('Error loading tasks:', error);
      }
    }
  }, [session?.user?.email, getStorageKey, status, isLoaded]);

  // Save tasks whenever they change
  const saveTasksToStorage = useCallback((tasksToSave: Task[]) => {
    if (!session?.user?.email) return;

    const storageKey = getStorageKey();
    try {
      localStorage.setItem(storageKey, JSON.stringify(tasksToSave));
      if (DEBUG) console.log('Tasks saved:', tasksToSave);
    } catch (error) {
      if (DEBUG) {
        console.error('Error saving tasks:', error);
      }
    }
  }, [session?.user?.email, getStorageKey]);

  const updateTasks = useCallback((newTasks: Task[] | ((prev: Task[]) => Task[])) => {
    setTasks(prevTasks => {
      const updatedTasks = typeof newTasks === 'function' ? newTasks(prevTasks) : newTasks;
      saveTasksToStorage(updatedTasks);
      return updatedTasks;
    });
  }, [saveTasksToStorage]);

  const clearTasks = useCallback(() => {
    if (!session?.user?.email) return;
    
    try {
      const storageKey = getStorageKey();
      localStorage.removeItem(storageKey);
      setTasks([]);
      setIsLoaded(false);
    } catch (error) {
      if (DEBUG) {
        console.error('Error clearing tasks:', error);
      }
    }
  }, [session?.user?.email, getStorageKey]);

  return {
    tasks,
    setTasks: updateTasks,
    clearTasks
  };
}; 