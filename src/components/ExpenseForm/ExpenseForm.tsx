import React from 'react';
import { useForm } from 'react-hook-form';
import styles from './ExpenseForm.module.scss';

interface ExpenseFormData {
  name: string;
  amount: number;
}

interface ExpenseFormProps {
  onSubmit: (data: ExpenseFormData) => void;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ onSubmit }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<ExpenseFormData>();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <div className={styles.formGroup}>
        <label htmlFor="name">Nombre del Gasto</label>
        <input
          id="name"
          type="text"
          {...register('name', { required: 'El nombre es requerido' })}
          placeholder="Ej: Compra de insumos"
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

      <button type="submit" className={styles.submitButton}>
        Registrar Gasto
      </button>
    </form>
  );
};

export default ExpenseForm; 