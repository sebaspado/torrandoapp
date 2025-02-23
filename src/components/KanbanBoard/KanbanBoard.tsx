'use client';
import React from 'react';
import { Task, TaskStatus } from '@/types/task';
import TaskCard from '@/components/TaskCard/TaskCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import styles from './KanbanBoard.module.scss';
import type { KanbanBoardProps } from '../DragDropWrapper';

const columns = [
  { status: 'TODO' as TaskStatus, title: 'Por Hacer' },
  { status: 'IN_PROGRESS' as TaskStatus, title: 'En Progreso' },
  { status: 'REVIEW' as TaskStatus, title: 'En Revisión' },
  { status: 'DONE' as TaskStatus, title: 'Completado' }
];

function KanbanBoard({ tasks, onTaskMove, onTaskClick, onDeleteClick }: KanbanBoardProps) {
  // Add debug logs
  React.useEffect(() => {
    console.log('onDeleteClick is:', typeof onDeleteClick);
  }, [onDeleteClick]);

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, newStatus: TaskStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId) {
      onTaskMove(taskId, newStatus);
    }
  };

  const handleDeleteClick = React.useCallback((task: Task) => {
    console.log('Delete clicked for task:', task);
    if (typeof onDeleteClick === 'function') {
      try {
        onDeleteClick(task);
      } catch (error) {
        console.error('Error in delete handler:', error);
      }
    } else {
      console.error('onDeleteClick is not a function:', onDeleteClick);
    }
  }, [onDeleteClick]);

  return (
    <div className={styles.board}>
      {columns.map(column => (
        <div 
          key={column.status} 
          className={styles.column}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, column.status)}
        >
          <h2>{column.title}</h2>
          <div className={styles.taskList}>
            {tasks
              .filter(task => task.status === column.status)
              .map(task => (
                <div 
                  key={task.id} 
                  className={styles.taskWrapper}
                  draggable
                  onDragStart={(e) => handleDragStart(e, task.id)}
                >
                  <div className={styles.taskContent}>
                    <TaskCard
                      task={task}
                      onClick={() => onTaskClick(task.id)}
                    />
                    <button
                      type="button"
                      className={styles.deleteButton}
                      onClick={() => handleDeleteClick(task)}
                      aria-label="Eliminar tarea"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default KanbanBoard; 