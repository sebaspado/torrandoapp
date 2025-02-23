import { Task } from '@/types/task';

export const taskStore = {
  getKey(email: string) {
    return `tasks_${email}`;
  },

  getTasks(email: string): Task[] {
    try {
      const stored = localStorage.getItem(this.getKey(email));
      if (!stored) return [];
      
      const tasks = JSON.parse(stored);
      return tasks.map((task: any) => ({
        ...task,
        dueDate: new Date(task.dueDate)
      }));
    } catch {
      return [];
    }
  },

  setTasks(email: string, tasks: Task[]) {
    try {
      const tasksToStore = tasks.map(task => ({
        ...task,
        dueDate: task.dueDate.toISOString()
      }));
      localStorage.setItem(this.getKey(email), JSON.stringify(tasksToStore));
    } catch (error) {
      console.error('Failed to save tasks:', error);
    }
  },

  addTask(email: string, task: Task) {
    const tasks = this.getTasks(email);
    tasks.push(task);
    this.setTasks(email, tasks);
    return tasks;
  },

  clearTasks(email: string) {
    localStorage.removeItem(this.getKey(email));
  }
}; 