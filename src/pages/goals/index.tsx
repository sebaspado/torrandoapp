import React, { useState } from 'react';
import ProtectedLayout from '@/components/ProtectedLayout/ProtectedLayout';
import { Modal } from '@/components/Modal/Modal';
import GoalForm from '@/components/GoalForm/GoalForm';
import ProgressBar from '@/components/ProgressBar/ProgressBar';
import ConfirmDialog from '@/components/ConfirmDialog/ConfirmDialog';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import styles from './Goals.module.scss';
import { useGoalManager } from '@/hooks/useGoalManager';
import { useFinanceManager } from '@/hooks/useFinanceManager';
import { Goal } from '@/types/goal';

export default function GoalsPage() {
  const { goals, addGoal, updateGoal, deleteGoal } = useGoalManager();
  const { getIncomeForMonth } = useFinanceManager();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [deletingGoal, setDeletingGoal] = useState<Goal | null>(null);

  const handleAddGoal = (data: any) => {
    const newGoal = {
      id: `goal_${Date.now()}`,
      ...data,
      createdAt: new Date()
    };
    addGoal(newGoal);
    setIsModalOpen(false);
  };

  const handleEditGoal = (data: any) => {
    if (!editingGoal) return;
    updateGoal(editingGoal.id, data);
    setEditingGoal(null);
  };

  const calculateProgress = (goal: Goal) => {
    const currentIncome = getIncomeForMonth(goal.month);
    return (currentIncome / goal.amount) * 100;
  };

  const handleDelete = (goal: Goal) => {
    setDeletingGoal(goal);
  };

  const confirmDelete = () => {
    if (deletingGoal) {
      deleteGoal(deletingGoal.id);
      setDeletingGoal(null);
    }
  };

  return (
    <ProtectedLayout>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Metas de Ingresos</h1>
          <button 
            className={styles.addButton}
            onClick={() => setIsModalOpen(true)}
          >
            <FontAwesomeIcon icon={faPlus} /> Nueva Meta
          </button>
        </div>

        <div className={styles.goalsList}>
          {goals.map(goal => {
            const progress = calculateProgress(goal);
            const currentIncome = getIncomeForMonth(goal.month);
            
            return (
              <div key={goal.id} className={styles.goalCard}>
                <div className={styles.goalHeader}>
                  <h3>{new Date(goal.month).toLocaleString('es-AR', { month: 'long', year: 'numeric' })}</h3>
                  <div className={styles.actions}>
                    <button
                      onClick={() => setEditingGoal(goal)}
                      className={styles.editButton}
                      aria-label="Editar meta"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button
                      onClick={() => handleDelete(goal)}
                      className={styles.deleteButton}
                      aria-label="Eliminar meta"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </div>
                
                <div className={styles.goalDetails}>
                  <div className={styles.amounts}>
                    <span className={styles.currentAmount}>
                      {new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(currentIncome)}
                    </span>
                    <span className={styles.targetAmount}>
                      de {new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(goal.amount)}
                    </span>
                  </div>
                  
                  <ProgressBar 
                    progress={progress}
                    color={progress >= 100 ? 'var(--success)' : 'var(--accent-primary)'}
                  />
                  
                  {goal.description && (
                    <p className={styles.description}>{goal.description}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Nueva Meta"
        >
          <GoalForm onSubmit={handleAddGoal} />
        </Modal>

        <Modal
          isOpen={!!editingGoal}
          onClose={() => setEditingGoal(null)}
          title="Editar Meta"
        >
          {editingGoal && (
            <GoalForm
              onSubmit={handleEditGoal}
              initialData={editingGoal}
            />
          )}
        </Modal>

        <ConfirmDialog
          isOpen={!!deletingGoal}
          onClose={() => setDeletingGoal(null)}
          onConfirm={confirmDelete}
          title="Eliminar Meta"
          message="¿Estás seguro que deseas eliminar esta meta? Esta acción no se puede deshacer."
        />
      </div>
    </ProtectedLayout>
  );
} 