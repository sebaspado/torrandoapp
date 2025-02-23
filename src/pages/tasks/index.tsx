import React, { useState } from 'react';
import { Task, TaskStatus } from '@/types/task';
import { useTaskManager } from '@/hooks/useTaskManager';
import ProtectedLayout from '@/components/ProtectedLayout/ProtectedLayout';
import TaskDetailModal from '@/components/TaskDetailModal/TaskDetailModal';
import TaskForm from '@/components/TaskForm/TaskForm';
import { Modal } from '@/components/Modal/Modal';
import ConfirmDialog from '@/components/ConfirmDialog/ConfirmDialog';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import styles from '@/styles/Tasks.module.scss';
import DragDropWrapper from '@/components/DragDropWrapper/DragDropWrapper';

export default function TasksPage() {
  const { tasks, addTask, updateTask, deleteTask } = useTaskManager();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  const handleTaskMove = (taskId: string, newStatus: Task['status']) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      updateTask(taskId, { ...task, status: newStatus });
    }
  };

  const handleTaskClick = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      setSelectedTask(task);
    }
  };

  const handleDeleteClick = React.useCallback((task: Task) => {
    console.log('Delete clicked:', task);
    setTaskToDelete(task);
    setIsDeleteModalOpen(true);
  }, []);

  const handleConfirmDelete = React.useCallback(() => {
    console.log('Confirming delete for task:', taskToDelete);
    if (taskToDelete?.id) {
      deleteTask(taskToDelete.id);
      setTaskToDelete(null);
      setIsDeleteModalOpen(false);
    }
  }, [deleteTask, taskToDelete]);

  return (
    <ProtectedLayout>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Tasks</h1>
          <button 
            className={styles.addButton}
            onClick={() => setIsCreateModalOpen(true)}
          >
            Add Task
          </button>
        </div>

        <DragDropWrapper
          tasks={tasks}
          onTaskMove={handleTaskMove}
          onTaskClick={handleTaskClick}
          onDeleteClick={handleDeleteClick}
        />

        <TaskDetailModal
          task={selectedTask}
          isOpen={!!selectedTask}
          onClose={() => {
            setSelectedTask(null);
            setIsDeleteModalOpen(false);
          }}
          onSave={(updatedTask) => {
            updateTask(updatedTask.id, updatedTask);
            setSelectedTask(null);
            setIsDeleteModalOpen(false);
          }}
        />

        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          title="Create Task"
        >
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
        </Modal>

        <ConfirmDialog
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setTaskToDelete(null);
          }}
          onConfirm={handleConfirmDelete}
          title="Confirmar eliminación"
          message="¿Estás seguro que deseas eliminar esta tarea? Esta acción no se puede deshacer."
        />
      </div>
    </ProtectedLayout>
  );
} 