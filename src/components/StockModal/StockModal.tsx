import React from 'react';
import { Modal } from '../Modal/Modal';
import StockForm from '../StockForm/StockForm';
import { Stock } from '@/types/stock';

interface StockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (stock: Stock) => void;
  stock?: Stock;
}

const StockModal: React.FC<StockModalProps> = ({
  isOpen,
  onClose,
  onSave,
  stock
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={stock ? 'Edit Stock' : 'Add Stock'}
    >
      <StockForm
        onSubmit={onSave}
        initialData={stock}
      />
    </Modal>
  );
};

export default StockModal; 