import React, { createContext, useContext, useState, useCallback } from 'react';
import { Modal } from '../Modal/Modal';

interface ModalContextType {
  showModal: (content: React.ReactNode, title: string) => void;
  hideModal: () => void;
}

const ModalContext = createContext<ModalContextType | null>(null);

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [modalContent, setModalContent] = useState<React.ReactNode | null>(null);
  const [modalTitle, setModalTitle] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  const showModal = useCallback((content: React.ReactNode, title: string) => {
    setModalContent(content);
    setModalTitle(title);
    setIsVisible(true);
  }, []);

  const hideModal = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => setModalContent(null), 300); // Wait for animation
  }, []);

  return (
    <ModalContext.Provider value={{ showModal, hideModal }}>
      {children}
      {modalContent && (
        <Modal
          isOpen={isVisible}
          onClose={hideModal}
          title={modalTitle}
        >
          {modalContent}
        </Modal>
      )}
    </ModalContext.Provider>
  );
}; 