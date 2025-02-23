import React, { useState } from 'react';
import { Product } from '@/types/product';
import ProtectedLayout from '@/components/ProtectedLayout/ProtectedLayout';
import { Modal } from '@/components/Modal/Modal';
import ProductForm from '@/components/ProductForm/ProductForm';
import { useProductManager } from '@/hooks/useProductManager';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import styles from './Products.module.scss';
import Image from 'next/image';

export default function ProductsPage() {
  const { products, addProduct, updateProduct, deleteProduct } = useProductManager();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const handleAddProduct = (data: any) => {
    const newProduct: Product = {
      id: `product_${Date.now()}`,
      name: data.name,
      description: data.description || '',
      price: Number(data.price),
      stock: Number(data.stock),
      imageUrl: data.imageUrl,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    addProduct(newProduct);
    setIsCreateModalOpen(false);
  };

  const handleEditProduct = (data: any) => {
    if (!editingProduct) return;

    updateProduct(editingProduct.id, {
      name: data.name,
      description: data.description,
      price: Number(data.price),
      stock: Number(data.stock),
      imageUrl: data.imageUrl
    });
    setEditingProduct(null);
  };

  const handleDeleteProduct = (productId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      deleteProduct(productId);
    }
  };

  return (
    <ProtectedLayout>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Productos</h1>
          <button 
            className={styles.addButton}
            onClick={() => setIsCreateModalOpen(true)}
          >
            Agregar Producto
          </button>
        </div>

        <div className={styles.productGrid}>
          {products.map(product => (
            <div key={product.id} className={styles.productCard}>
              <div className={styles.productImage}>
                {product.imageUrl ? (
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    layout="fill"
                    objectFit="cover"
                  />
                ) : (
                  <div className={styles.noImage}>
                    <span>Sin imagen</span>
                  </div>
                )}
              </div>
              <div className={styles.productInfo}>
                <h3>{product.name}</h3>
                <p className={styles.description}>{product.description}</p>
                <div className={styles.details}>
                  <span className={styles.price}>${product.price.toFixed(2)}</span>
                  <span className={styles.stock}>Stock: {product.stock}</span>
                </div>
              </div>
              <div className={styles.actions}>
                <button
                  onClick={() => setEditingProduct(product)}
                  className={styles.editButton}
                  aria-label="Editar producto"
                >
                  <FontAwesomeIcon icon={faPencilAlt} />
                </button>
                <button
                  onClick={() => handleDeleteProduct(product.id)}
                  className={styles.deleteButton}
                  aria-label="Eliminar producto"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          title="Agregar Producto"
        >
          <ProductForm onSubmit={handleAddProduct} />
        </Modal>

        <Modal
          isOpen={!!editingProduct}
          onClose={() => setEditingProduct(null)}
          title="Editar Producto"
        >
          {editingProduct && (
            <ProductForm
              onSubmit={handleEditProduct}
              initialData={editingProduct}
            />
          )}
        </Modal>
      </div>
    </ProtectedLayout>
  );
} 