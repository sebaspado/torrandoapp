import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/Modal/Modal';
import { Task, TaskPriority, TaskStatus } from '@/types/task';
import styles from './TaskDetailModal.module.scss';

interface TaskDetailModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Task) => void;
}

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  task,
  isOpen,
  onClose,
  onSave
}) => {
  const [editedTask, setEditedTask] = useState<Task>({
    id: '',
    title: '',
    description: '',
    status: 'TODO' as TaskStatus,
    priority: 'LOW' as TaskPriority,
    dueDate: new Date(),
    createdAt: new Date(),
    assignee: {
      name: ''
    }
  });

  useEffect(() => {
    if (task) {
      setEditedTask({
        ...task,
        dueDate: task.dueDate instanceof Date ? task.dueDate : new Date(task.dueDate)
      });
    }
  }, [task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(editedTask);
  };

  if (!task) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Detalles de la Tarea">
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="title">Título</label>
          <input
            type="text"
            id="title"
            value={editedTask.title}
            onChange={e => setEditedTask(prev => ({ ...prev, title: e.target.value }))}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="description">Descripción</label>
          <textarea
            id="description"
            value={editedTask.description}
            onChange={e => setEditedTask(prev => ({ ...prev, description: e.target.value }))}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="status">Estado</label>
          <select
            id="status"
            value={editedTask.status}
            onChange={e => setEditedTask(prev => ({ ...prev, status: e.target.value as TaskStatus }))}
          >
            <option value="TODO">Por Hacer</option>
            <option value="IN_PROGRESS">En Progreso</option>
            <option value="REVIEW">En Revisión</option>
            <option value="DONE">Completada</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="priority">Prioridad</label>
          <select
            id="priority"
            value={editedTask.priority}
            onChange={e => setEditedTask(prev => ({ ...prev, priority: e.target.value as TaskPriority }))}
          >
            <option value="LOW">Baja</option>
            <option value="MEDIUM">Media</option>
            <option value="HIGH">Alta</option>
            <option value="URGENT">Urgente</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="dueDate">Fecha de Vencimiento</label>
          <input
            type="datetime-local"
            id="dueDate"
            value={editedTask.dueDate instanceof Date ? 
              editedTask.dueDate.toISOString().slice(0, 16) : 
              new Date(editedTask.dueDate).toISOString().slice(0, 16)}
            onChange={e => setEditedTask(prev => ({ 
              ...prev, 
              dueDate: new Date(e.target.value)
            }))}
            required
          />
        </div>

        <div className={styles.actions}>
          <button type="button" onClick={onClose} className={styles.cancelButton}>
            Cancelar
          </button>
          <button type="submit" className={styles.saveButton}>
            Guardar
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default TaskDetailModal; 