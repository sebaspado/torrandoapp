import React, { useState } from 'react';
import ProtectedLayout from '@/components/ProtectedLayout/ProtectedLayout';
import { Modal } from '@/components/Modal/Modal';
import ClientForm from '@/components/ClientForm/ClientForm';
import ConfirmDialog from '@/components/ConfirmDialog/ConfirmDialog';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash, faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import styles from './Clients.module.scss';
import { useClientManager } from '@/hooks/useClientManager';
import { Client } from '@/types/client';

export default function ClientsPage() {
  const { clients, addClient, updateClient, deleteClient } = useClientManager();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [deletingClient, setDeletingClient] = useState<Client | null>(null);

  const handleAddClient = (data: any) => {
    const newClient: Client = {
      id: `client_${Date.now()}`,
      ...data,
      createdAt: new Date()
    };
    addClient(newClient);
    setIsModalOpen(false);
  };

  const handleEditClient = (data: any) => {
    if (!editingClient) return;
    updateClient(editingClient.id, data);
    setEditingClient(null);
  };

  const handleDelete = (client: Client) => {
    setDeletingClient(client);
  };

  const confirmDelete = () => {
    if (deletingClient) {
      deleteClient(deletingClient.id);
      setDeletingClient(null);
    }
  };

  return (
    <ProtectedLayout>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Clientes</h1>
          <button 
            className={styles.addButton}
            onClick={() => setIsModalOpen(true)}
          >
            <FontAwesomeIcon icon={faPlus} /> Agregar Cliente
          </button>
        </div>

        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Ubicación</th>
                <th>Teléfono</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {clients.map(client => (
                <tr key={client.id}>
                  <td>{client.name}</td>
                  <td>{client.email}</td>
                  <td>{client.location}</td>
                  <td>{client.phone}</td>
                  <td>
                    <div className={styles.actions}>
                      <button
                        onClick={() => setEditingClient(client)}
                        className={styles.editButton}
                        aria-label="Editar cliente"
                      >
                        <FontAwesomeIcon icon={faPencilAlt} />
                      </button>
                      <button
                        onClick={() => handleDelete(client)}
                        className={styles.deleteButton}
                        aria-label="Eliminar cliente"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Agregar Cliente"
        >
          <ClientForm onSubmit={handleAddClient} />
        </Modal>

        <Modal
          isOpen={!!editingClient}
          onClose={() => setEditingClient(null)}
          title="Editar Cliente"
        >
          {editingClient && (
            <ClientForm
              onSubmit={handleEditClient}
              initialData={editingClient}
            />
          )}
        </Modal>

        <ConfirmDialog
          isOpen={!!deletingClient}
          onClose={() => setDeletingClient(null)}
          onConfirm={confirmDelete}
          title="Eliminar Cliente"
          message="¿Estás seguro que deseas eliminar este cliente? Esta acción no se puede deshacer."
        />
      </div>
    </ProtectedLayout>
  );
} 