import React from 'react';
import { useForm } from 'react-hook-form';
import styles from './GoalForm.module.scss';

interface GoalFormData {
  amount: number;
  month: string;
  description?: string;
}

interface GoalFormProps {
  onSubmit: (data: GoalFormData) => void;
  initialData?: GoalFormData;
}

const GoalForm: React.FC<GoalFormProps> = ({ onSubmit, initialData }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<GoalFormData>({
    defaultValues: initialData
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <div className={styles.formGroup}>
        <label htmlFor="amount">Meta de Ingresos</label>
        <input
          id="amount"
          type="number"
          step="0.01"
          {...register('amount', { 
            required: 'El monto es requerido',
            min: { value: 0, message: 'El monto debe ser positivo' }
          })}
          placeholder="0.00"
        />
        {errors.amount && <span className={styles.error}>{errors.amount.message}</span>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="month">Mes</label>
        <input
          id="month"
          type="month"
          {...register('month', { required: 'El mes es requerido' })}
        />
        {errors.month && <span className={styles.error}>{errors.month.message}</span>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="description">Descripción (opcional)</label>
        <textarea
          id="description"
          {...register('description')}
          placeholder="Detalles de la meta..."
        />
      </div>

      <button type="submit" className={styles.submitButton}>
        {initialData ? 'Actualizar Meta' : 'Establecer Meta'}
      </button>
    </form>
  );
};

export default GoalForm; 