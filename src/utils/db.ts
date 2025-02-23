import { Task } from '@/types/task';

const DB_KEY = 'taskmanager_db';

interface Database {
  tasks: Task[];
}

const defaultDB: Database = {
  tasks: []
};

export const db = {
  load(): Database {
    try {
      const data = localStorage.getItem(DB_KEY);
      if (!data) {
        return defaultDB;
      }

      const parsed = JSON.parse(data);
      return {
        ...parsed,
        tasks: parsed.tasks.map((task: any) => ({
          ...task,
          dueDate: new Date(task.dueDate)
        }))
      };
    } catch (error) {
      console.error('Failed to load database:', error);
      return defaultDB;
    }
  },

  save(data: Database) {
    try {
      const serialized = JSON.stringify(data);
      localStorage.setItem(DB_KEY, serialized);
      return true;
    } catch (error) {
      console.error('Failed to save database:', error);
      return false;
    }
  },

  clear() {
    localStorage.removeItem(DB_KEY);
  }
}; 