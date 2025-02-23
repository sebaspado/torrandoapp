import React from 'react';
import { useForm } from 'react-hook-form';
import styles from './ClientForm.module.scss';

interface ClientFormData {
  name: string;
  email: string;
  location: string;
  phone: string;
}

interface ClientFormProps {
  onSubmit: (data: ClientFormData) => void;
  initialData?: ClientFormData;
}

const ClientForm: React.FC<ClientFormProps> = ({ onSubmit, initialData }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<ClientFormData>({
    defaultValues: initialData
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <div className={styles.formGroup}>
        <label htmlFor="name">Nombre</label>
        <input
          id="name"
          type="text"
          {...register('name', { required: 'El nombre es requerido' })}
          placeholder="Nombre del cliente"
        />
        {errors.name && <span className={styles.error}>{errors.name.message}</span>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          {...register('email', { 
            required: 'El email es requerido',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Email inválido'
            }
          })}
          placeholder="email@ejemplo.com"
        />
        {errors.email && <span className={styles.error}>{errors.email.message}</span>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="location">Ubicación</label>
        <input
          id="location"
          type="text"
          {...register('location', { required: 'La ubicación es requerida' })}
          placeholder="Dirección"
        />
        {errors.location && <span className={styles.error}>{errors.location.message}</span>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="phone">Teléfono</label>
        <input
          id="phone"
          type="tel"
          {...register('phone', { required: 'El teléfono es requerido' })}
          placeholder="+54 11 1234-5678"
        />
        {errors.phone && <span className={styles.error}>{errors.phone.message}</span>}
      </div>

      <button type="submit" className={styles.submitButton}>
        {initialData ? 'Actualizar Cliente' : 'Agregar Cliente'}
      </button>
    </form>
  );
};

export default ClientForm; 