import React from 'react';
import { Task } from '@/types/task';
import styles from './TaskCard.module.scss';

interface TaskCardProps {
  task: Task;
  onClick?: () => void;  // Made onClick optional
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onClick }) => {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className={styles.card} onClick={onClick}>
      <h3 className={styles.title}>{task.title}</h3>
      {task.description && (
        <p className={styles.description}>{task.description}</p>
      )}
      <div className={styles.footer}>
        <span className={styles[`priority${task.priority}`]}>
          {task.priority}
        </span>
        <span className={styles.date}>
          {formatDate(task.dueDate)}
        </span>
      </div>
    </div>
  );
};

export default TaskCard; 