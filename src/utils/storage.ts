import { Task } from '@/types/task';
import { getSession } from 'next-auth/react';

export class TaskStorage {
  private key: string;

  constructor(userEmail: string) {
    this.key = `taskManager_${userEmail}`;
  }

  saveTasks(tasks: Task[]) {
    try {
      const tasksToSave = tasks.map(task => ({
        ...task,
        dueDate: task.dueDate.toISOString()
      }));
      const serialized = JSON.stringify(tasksToSave);
      localStorage.setItem(this.key, serialized);
      console.log(`[Storage] Saved ${tasks.length} tasks for ${this.key}:`, tasksToSave);
      return true;
    } catch (error) {
      console.error('[Storage] Error saving tasks:', error);
      return false;
    }
  }

  loadTasks(): Task[] {
    try {
      const data = localStorage.getItem(this.key);
      if (!data) {
        console.log(`[Storage] No tasks found for ${this.key}`);
        return [];
      }

      const parsedTasks = JSON.parse(data);
      const tasks = parsedTasks.map((task: any) => ({
        ...task,
        dueDate: new Date(task.dueDate)
      }));
      console.log(`[Storage] Loaded ${tasks.length} tasks for ${this.key}:`, tasks);
      return tasks;
    } catch (error) {
      console.error('[Storage] Error loading tasks:', error);
      return [];
    }
  }

  clearTasks() {
    try {
      localStorage.removeItem(this.key);
      console.log(`[Storage] Cleared tasks for ${this.key}`);
      return true;
    } catch (error) {
      console.error('[Storage] Error clearing tasks:', error);
      return false;
    }
  }
}

// Get storage key for current user
const getTasksStorageKey = async () => {
  const session = await getSession();
  const userId = session?.user?.email || 'anonymous';
  return `taskManager_tasks_${userId}`;
};

export const loadTasks = async (): Promise<Task[]> => {
  if (typeof window === 'undefined') return [];
  
  try {
    const storageKey = await getTasksStorageKey();
    const savedTasks = localStorage.getItem(storageKey);
    if (savedTasks) {
      const tasks = JSON.parse(savedTasks);
      // Convert string dates back to Date objects
      return tasks.map((task: Task) => ({
        ...task,
        dueDate: new Date(task.dueDate)
      }));
    }
  } catch (error) {
    console.error('Error loading tasks:', error);
  }
  return [];
};

export const saveTasks = async (tasks: Task[]) => {
  if (typeof window === 'undefined') return;
  
  try {
    const storageKey = await getTasksStorageKey();
    localStorage.setItem(storageKey, JSON.stringify(tasks));
  } catch (error) {
    console.error('Error saving tasks:', error);
  }
};

export const clearTasks = async () => {
  if (typeof window === 'undefined') return;
  
  try {
    const storageKey = await getTasksStorageKey();
    localStorage.removeItem(storageKey);
  } catch (error) {
    console.error('Error clearing tasks:', error);
  }
}; 