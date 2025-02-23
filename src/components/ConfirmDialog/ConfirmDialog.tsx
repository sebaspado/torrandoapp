import React from 'react';
import { Modal } from '../Modal/Modal';
import styles from './ConfirmDialog.module.scss';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className={styles.content}>
        <p>{message}</p>
        <div className={styles.buttons}>
          <button 
            className={styles.cancelButton} 
            onClick={onClose}
          >
            Cancel
          </button>
          <button 
            className={styles.confirmButton} 
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog; 