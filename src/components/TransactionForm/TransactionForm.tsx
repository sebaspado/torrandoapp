import React from 'react';
import { useForm } from 'react-hook-form';
import styles from './TransactionForm.module.scss';
import { TransactionType, Transaction } from '@/types/finance';

interface TransactionFormData {
  name: string;
  amount: number;
  date: string;
  description?: string;
}

interface TransactionFormProps {
  type: TransactionType;
  onSubmit: (data: TransactionFormData) => void;
  initialData?: Transaction;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ type, onSubmit, initialData }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<TransactionFormData>({
    defaultValues: initialData ? {
      name: initialData.name,
      amount: initialData.amount,
      date: initialData.date.toISOString().split('T')[0],
      description: initialData.description
    } : undefined
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <div className={styles.formGroup}>
        <label htmlFor="name">Nombre</label>
        <input
          id="name"
          type="text"
          {...register('name', { required: 'El nombre es requerido' })}
          placeholder={type === 'INCOME' ? 'Nombre del ingreso' : 'Nombre del gasto'}
        />
        {errors.name && <span className={styles.error}>{errors.name.message}</span>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="amount">Monto</label>
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
        <label htmlFor="date">Fecha</label>
        <input
          id="date"
          type="date"
          {...register('date', { required: 'La fecha es requerida' })}
        />
        {errors.date && <span className={styles.error}>{errors.date.message}</span>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="description">Descripción (opcional)</label>
        <textarea
          id="description"
          {...register('description')}
          placeholder="Agregar descripción..."
        />
      </div>

      <button type="submit" className={styles.submitButton}>
        {initialData ? 'Guardar Cambios' : type === 'INCOME' ? 'Agregar Ingreso' : 'Agregar Gasto'}
      </button>
    </form>
  );
};

export default TransactionForm; 