import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Image from 'next/image';
import styles from './ProductForm.module.scss';

interface ProductFormData {
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl?: string;
}

interface ProductFormProps {
  onSubmit: (data: ProductFormData) => void;
  initialData?: Partial<ProductFormData>;
}

const ProductForm: React.FC<ProductFormProps> = ({ onSubmit, initialData = {} }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<ProductFormData>({
    defaultValues: initialData
  });
  const [imagePreview, setImagePreview] = useState<string>(initialData.imageUrl || '');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImagePreview(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = (data: ProductFormData) => {
    onSubmit({
      ...data,
      imageUrl: imagePreview
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className={styles.form}>
      <div className={styles.imageUpload}>
        {imagePreview ? (
          <div className={styles.previewContainer}>
            <Image
              src={imagePreview}
              alt="Vista previa del producto"
              width={200}
              height={200}
              objectFit="cover"
            />
            <button
              type="button"
              className={styles.removeImage}
              onClick={() => setImagePreview('')}
            >
              Eliminar Imagen
            </button>
          </div>
        ) : (
          <label className={styles.uploadLabel}>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className={styles.fileInput}
            />
            <div className={styles.uploadPlaceholder}>
              <span>Haz clic para subir imagen</span>
              <small>Tamaño recomendado: 500x500px</small>
            </div>
          </label>
        )}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="name">Nombre</label>
        <input
          id="name"
          type="text"
          {...register('name', { required: 'El nombre es requerido' })}
          placeholder="Nombre del producto"
        />
        {errors.name && <span className={styles.error}>{errors.name.message}</span>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="description">Descripción</label>
        <textarea
          id="description"
          {...register('description')}
          placeholder="Descripción del producto"
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="price">Precio</label>
        <input
          id="price"
          type="number"
          step="0.01"
          {...register('price', { 
            required: 'El precio es requerido',
            min: { value: 0, message: 'El precio debe ser positivo' }
          })}
          placeholder="0.00"
        />
        {errors.price && <span className={styles.error}>{errors.price.message}</span>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="stock">Stock</label>
        <input
          id="stock"
          type="number"
          {...register('stock', { 
            required: 'El stock es requerido',
            min: { value: 0, message: 'El stock debe ser positivo' }
          })}
          placeholder="0"
        />
        {errors.stock && <span className={styles.error}>{errors.stock.message}</span>}
      </div>

      <button type="submit" className={styles.submitButton}>
        Guardar Producto
      </button>
    </form>
  );
};

export default ProductForm; 