import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Product } from '@/types/product';
import styles from './SalesForm.module.scss';

interface SalesFormData {
  productId: string;
  quantity: number;
  total: number;
}

interface SalesFormProps {
  products: Product[];
  onSubmit: (data: SalesFormData) => void;
}

const SalesForm: React.FC<SalesFormProps> = ({ products, onSubmit }) => {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<SalesFormData>();
  const selectedProductId = watch('productId');
  const quantity = watch('quantity') || 0;

  const selectedProduct = products.find(p => p.id === selectedProductId);

  // Update total when product or quantity changes
  React.useEffect(() => {
    if (selectedProduct && quantity) {
      setValue('total', selectedProduct.price * quantity);
    }
  }, [selectedProduct, quantity, setValue]);

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
              {product.name} - ${product.price} (Stock: {product.stock})
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
          max={selectedProduct?.stock || 1}
          {...register('quantity', {
            required: 'La cantidad es requerida',
            min: { value: 1, message: 'La cantidad debe ser al menos 1' },
            max: { 
              value: selectedProduct?.stock || 1,
              message: 'La cantidad no puede exceder el stock disponible'
            }
          })}
        />
        {errors.quantity && <span className={styles.error}>{errors.quantity.message}</span>}
      </div>

      <div className={styles.formGroup}>
        <label>Total</label>
        <div className={styles.total}>
          ${selectedProduct && quantity ? (selectedProduct.price * quantity).toFixed(2) : '0.00'}
        </div>
      </div>

      <button type="submit" className={styles.submitButton}>
        Registrar Venta
      </button>
    </form>
  );
};

export default SalesForm; 