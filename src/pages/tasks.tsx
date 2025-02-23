import React, { useState } from 'react';
import KanbanBoard from '@/components/KanbanBoard/KanbanBoard';
import { Task } from '@/types/task';
import { useTaskManager } from '@/hooks/useTaskManager';
import ProtectedLayout from '@/components/ProtectedLayout/ProtectedLayout';
import TaskDetailModal from '@/components/TaskDetailModal/TaskDetailModal';
import TaskForm from '@/components/TaskForm/TaskForm';
import styles from './tasks.module.scss';

const TasksPage = () => {
  const { tasks, addTask, updateTask, deleteTask } = useTaskManager();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleTaskMove = (taskId: string, newStatus: Task['status']) => {
    console.log('Updating task status:', taskId, newStatus);
    updateTask(taskId, { status: newStatus });
  };

  const handleTaskClick = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      setSelectedTask(task);
    }
  };

  const handleDeleteClick = (task: Task) => {
    console.log('Deleting task:', task.id);
    deleteTask(task.id);
  };

  return (
    <ProtectedLayout>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Tasks</h1>
          {/*<button 
            className={styles.createButton}
            onClick={() => setIsCreateModalOpen(true)}
          >
            Create Task
          </button>*/}
        </div>

        <KanbanBoard 
          tasks={tasks} 
          onTaskMove={handleTaskMove}
          onTaskClick={handleTaskClick}
          onDeleteClick={handleDeleteClick}
        />

        {selectedTask && (
          <TaskDetailModal
            task={selectedTask}
            isOpen={!!selectedTask}
            onClose={() => setSelectedTask(null)}
            onSave={(updatedTask) => {
              updateTask(updatedTask.id, updatedTask);
              setSelectedTask(null);
            }}
          />
        )}

        {isCreateModalOpen && (
          <div className={styles.modal}>
            <div className={styles.modalContent}>
              <button
                className={styles.closeButton}
                onClick={() => setIsCreateModalOpen(false)}
              >
                ×
              </button>
              <h2>Create Task</h2>
              <TaskForm
                onSubmit={(data) => {
                  const newTask: Task = {
                    id: `task_${Date.now()}`,
                    title: data.title,
                    description: data.description || '',
                    status: 'TODO',
                    priority: data.priority || 'MEDIUM',
                    dueDate: new Date(data.dueDate),
                    createdAt: new Date(),
                    assignee: {
                      name: 'Me'
                    }
                  };
                  addTask(newTask);
                  setIsCreateModalOpen(false);
                }}
              />
            </div>
          </div>
        )}
      </div>
    </ProtectedLayout>
  );
};

export default TasksPage; 