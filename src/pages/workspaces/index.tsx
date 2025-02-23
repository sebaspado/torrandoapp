import React from 'react';
import Layout from '@/components/Layout/Layout';
import WorkspaceList from '@/components/WorkspaceList/WorkspaceList';
import WorkspaceForm from '@/components/WorkspaceForm/WorkspaceForm';
import styles from './workspaces.module.scss';

// Mock data
const mockWorkspaces = [
  {
    id: '1',
    name: 'Sample Workspace',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  // Add more mock workspaces as needed
];

const WorkspacesPage = () => {
  const [workspaces, setWorkspaces] = React.useState(mockWorkspaces);
  const [isFormOpen, setIsFormOpen] = React.useState(false);

  const handleCreateWorkspace = (data: any) => {
    const newWorkspace = {
      id: String(workspaces.length + 1),
      name: data.name,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setWorkspaces([...workspaces, newWorkspace]);
    setIsFormOpen(false);
  };

  return (
    <Layout>
      <div className={styles.container}>
        <WorkspaceList
          workspaces={workspaces}
          onCreateClick={() => setIsFormOpen(true)}
        />

        {isFormOpen && (
          <div className={styles.modal}>
            <div className={styles.modalContent}>
              <button
                className={styles.closeButton}
                onClick={() => setIsFormOpen(false)}
              >
                ×
              </button>
              <h2>Create Workspace</h2>
              <WorkspaceForm onSubmit={handleCreateWorkspace} />
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default WorkspacesPage; 