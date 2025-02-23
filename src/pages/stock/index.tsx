import React, { useState } from 'react';
import ProtectedLayout from '@/components/ProtectedLayout/ProtectedLayout';
import { Modal } from '@/components/Modal/Modal';
import StockForm from '@/components/StockForm/StockForm';
import ProductForm from '@/components/ProductForm/ProductForm';
import useStockManager from '@/hooks/useStockManager';
import { useProductManager } from '@/hooks/useProductManager';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus, faHistory, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import styles from './Stock.module.scss';
import ConfirmDialog from '@/components/ConfirmDialog/ConfirmDialog';
import Image from 'next/image';
import StockModal from '@/components/StockModal/StockModal';
import { Stock } from '@/types/stock';

export default function StockPage() {
  const { products, addProduct, updateProduct, deleteProduct } = useProductManager();
  const { stockItems, addMovement, getMovements } = useStockManager();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [deletingProduct, setDeletingProduct] = useState<any>(null);
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddProduct = (data: any) => {
    const newProduct = {
      id: `product_${Date.now()}`,
      ...data,
      stock: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    addProduct(newProduct);
    setIsProductModalOpen(false);
  };

  const handleEditProduct = (data: any) => {
    if (editingProduct) {
      updateProduct(editingProduct.id, {
        ...data,
        updatedAt: new Date()
      });
      setEditingProduct(null);
    }
  };

  const handleDeleteProduct = () => {
    if (deletingProduct) {
      deleteProduct(deletingProduct.id);
      setDeletingProduct(null);
    }
  };

  const handleAddStock = (data: any) => {
    // Find the product
    const product = products.find(p => p.id === data.productId);
    if (!product) return;

    // Update product stock
    const newStock = (product.stock || 0) + Number(data.quantity);
    updateProduct(product.id, {
      ...product,
      stock: newStock,
      updatedAt: new Date()
    });

    // Add stock movement
    addMovement({
      productId: data.productId,
      type: 'IN',
      quantity: data.quantity,
      reason: data.reason,
      reference: data.reference
    });

    setIsAddModalOpen(false);
  };

  const handleRemoveStock = (data: any) => {
    // Find the product
    const product = products.find(p => p.id === data.productId);
    if (!product) return;

    // Check if there's enough stock
    if ((product.stock || 0) < data.quantity) {
      alert('No hay suficiente stock disponible');
      return;
    }

    // Update product stock
    const newStock = (product.stock || 0) - Number(data.quantity);
    updateProduct(product.id, {
      ...product,
      stock: newStock,
      updatedAt: new Date()
    });

    // Add stock movement
    addMovement({
      productId: data.productId,
      type: 'OUT',
      quantity: data.quantity,
      reason: data.reason,
      reference: data.reference
    });

    setIsRemoveModalOpen(false);
  };

  const handleEditClick = (stock: Stock) => {
    setSelectedStock(stock);
    setIsModalOpen(true);
  };

  const handleSave = (updatedStock: Stock) => {
    if (selectedStock?.id) {
      // Update existing stock
      updateStock(selectedStock.id, {
        ...updatedStock,
        id: selectedStock.id
      });
    } else {
      // Add new stock
      addStock({
        ...updatedStock,
        id: `stock_${Date.now()}`
      });
    }
    setIsModalOpen(false);
    setSelectedStock(null);
  };

  return (
    <ProtectedLayout>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Inventario</h1>
          <div className={styles.actions}>
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className={`${styles.actionButton} ${styles.primaryButton}`}
            >
              <FontAwesomeIcon icon={faPlus} /> Agregar Stock
            </button>
          </div>
        </div>

        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Imagen</th>
                <th>Producto</th>
                <th>Descripción</th>
                <th>Stock</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id}>
                  <td className={styles.imageCell}>
                    {product.imageUrl ? (
                      <Image
                        src={product.imageUrl}
                        alt={product.name}
                        width={50}
                        height={50}
                        objectFit="cover"
                      />
                    ) : (
                      <div className={styles.noImage}>No imagen</div>
                    )}
                  </td>
                  <td>{product.name}</td>
                  <td>{product.description}</td>
                  <td className={styles.stockCell}>
                    {product.stock || 0} unidades
                  </td>
                  <td>
                    {product.stock <= (product.minStock || 0) && (
                      <span className={styles.alertBadge}>Stock bajo</span>
                    )}
                  </td>
                  <td className={styles.actionsCell}>
                    <button
                      onClick={() => {
                        setSelectedProduct(product.id);
                        setIsHistoryModalOpen(true);
                      }}
                      className={styles.actionButton}
                      title="Ver historial"
                    >
                      <FontAwesomeIcon icon={faHistory} />
                    </button>
                    <button
                      onClick={() => setEditingProduct(product)}
                      className={styles.actionButton}
                      title="Editar producto"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button
                      onClick={() => setDeletingProduct(product)}
                      className={styles.actionButton}
                      title="Eliminar producto"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Modal
          isOpen={isProductModalOpen}
          onClose={() => setIsProductModalOpen(false)}
          title="Nuevo Producto"
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

        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title="Registrar Entrada"
        >
          <StockForm
            type="IN"
            products={products}
            onSubmit={handleAddStock}
          />
        </Modal>

        <Modal
          isOpen={isRemoveModalOpen}
          onClose={() => setIsRemoveModalOpen(false)}
          title="Registrar Salida"
        >
          <StockForm
            type="OUT"
            products={products}
            onSubmit={handleRemoveStock}
          />
        </Modal>

        <Modal
          isOpen={isHistoryModalOpen}
          onClose={() => {
            setIsHistoryModalOpen(false);
            setSelectedProduct(null);
          }}
          title="Historial de Movimientos"
        >
          {selectedProduct && (
            <div className={styles.history}>
              {getMovements(selectedProduct).map(movement => (
                <div key={movement.id} className={styles.movementItem}>
                  <span className={`${styles.type} ${styles[movement.type]}`}>
                    {movement.type === 'IN' ? 'Entrada' : 'Salida'}
                  </span>
                  <span className={styles.quantity}>{movement.quantity} unidades</span>
                  <span className={styles.date}>
                    {new Date(movement.date).toLocaleDateString()}
                  </span>
                  <span className={styles.reason}>{movement.reason}</span>
                </div>
              ))}
            </div>
          )}
        </Modal>

        <ConfirmDialog
          isOpen={!!deletingProduct}
          onClose={() => setDeletingProduct(null)}
          onConfirm={handleDeleteProduct}
          title="Eliminar Producto"
          message="¿Estás seguro que deseas eliminar este producto? Esta acción no se puede deshacer."
        />

        <StockModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedStock(null);
          }}
          onSave={handleSave}
          stock={selectedStock || undefined}
        />
      </div>
    </ProtectedLayout>
  );
} 