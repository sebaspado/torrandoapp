'use client';
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Task } from '@/types/task';
import ConfirmDialog from '../ConfirmDialog/ConfirmDialog';

export interface KanbanBoardProps {
  tasks: Task[];
  onTaskMove: (taskId: string, newStatus: Task['status']) => void;
  onTaskClick: (taskId: string) => void;
  onDeleteClick: (task: Task) => void;
}

const KanbanBoard = dynamic(() => import('../KanbanBoard/KanbanBoard'), {
  ssr: false,
  loading: () => <div>Loading...</div>
});

const DragDropWrapper = (props: KanbanBoardProps) => {
  const { tasks, onTaskMove, onTaskClick, onDeleteClick } = props;
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleDeleteClick = React.useCallback((task: Task) => {
    console.log('Delete clicked, opening modal for task:', task);
    setTaskToDelete(task);
    setIsDeleteModalOpen(true);
  }, []);

  const handleConfirmDelete = React.useCallback(() => {
    console.log('Confirm delete clicked, task:', taskToDelete);
    if (taskToDelete) {
      onDeleteClick(taskToDelete);
      setTaskToDelete(null);
      setIsDeleteModalOpen(false);
    }
  }, [taskToDelete, onDeleteClick]);

  const handleClose = () => {
    console.log('Closing delete modal');
    setIsDeleteModalOpen(false);
    setTaskToDelete(null);
  };

  const kanbanProps = {
    tasks,
    onTaskMove,
    onTaskClick,
    onDeleteClick: handleDeleteClick
  };

  return (
    <>
      <KanbanBoard {...kanbanProps} />
      <ConfirmDialog
        isOpen={isDeleteModalOpen}
        onClose={handleClose}
        onConfirm={handleConfirmDelete}
        title="Delete Task"
        message={`Are you sure you want to delete "${taskToDelete?.title}"?`}
      />
    </>
  );
};

export default DragDropWrapper; 