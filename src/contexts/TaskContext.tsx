import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Task } from '@/types/task';
import { taskStore } from '@/utils/taskStore';

interface TaskContextType {
  tasks: Task[];
  addTask: (task: Task) => void;
  clearTasks: () => void;
}

const TaskContext = createContext<TaskContextType | null>(null);

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [tasks, setTasks] = useState<Task[]>([]);

  // Load tasks when session is available
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.email) {
      const savedTasks = taskStore.getTasks(session.user.email);
      setTasks(savedTasks);
    }
  }, [session?.user?.email, status]);

  const addTask = (task: Task) => {
    if (!session?.user?.email) return;

    const updatedTasks = taskStore.addTask(session.user.email, task);
    setTasks(updatedTasks);
  };

  const clearTasks = () => {
    if (!session?.user?.email) return;

    taskStore.clearTasks(session.user.email);
    setTasks([]);
  };

  return (
    <TaskContext.Provider value={{ tasks, addTask, clearTasks }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
} 