import React from 'react';
import { useForm } from 'react-hook-form';
import { Product } from '@/types/product';
import styles from './StockForm.module.scss';

interface StockFormData {
  productId: string;
  quantity: number;
  reason: string;
  reference?: string;
}

interface StockFormProps {
  type: 'IN' | 'OUT';
  products: Product[];
  onSubmit: (data: StockFormData) => void;
}

const StockForm: React.FC<StockFormProps> = ({ type, products, onSubmit }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<StockFormData>();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <div className={styles.formGroup}>
        <label htmlFor="productId">Producto</label>
        <select
          id="productId"
          {...register('productId', { required: 'Seleccione un producto' })}
        >
          <option value="">Seleccionar producto</option>
          {products.map(product => (
            <option key={product.id} value={product.id}>
              {product.name} (Stock actual: {product.stock || 0})
            </option>
          ))}
        </select>
        {errors.productId && <span className={styles.error}>{errors.productId.message}</span>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="quantity">Cantidad</label>
        <input
          id="quantity"
          type="number"
          min="1"
          {...register('quantity', { 
            required: 'La cantidad es requerida',
            min: { value: 1, message: 'La cantidad debe ser al menos 1' }
          })}
        />
        {errors.quantity && <span className={styles.error}>{errors.quantity.message}</span>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="reason">Motivo</label>
        <input
          id="reason"
          type="text"
          {...register('reason', { required: 'El motivo es requerido' })}
          placeholder={type === 'IN' ? 'Ej: Compra de mercadería' : 'Ej: Venta'}
        />
        {errors.reason && <span className={styles.error}>{errors.reason.message}</span>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="reference">Referencia (opcional)</label>
        <input
          id="reference"
          type="text"
          {...register('reference')}
          placeholder="Ej: Factura #123"
        />
      </div>

      <button type="submit" className={styles.submitButton}>
        {type === 'IN' ? 'Registrar Entrada' : 'Registrar Salida'}
      </button>
    </form>
  );
};

export default StockForm; 