import React from 'react';
import Link from 'next/link';
import { Workspace } from '@prisma/client';
import styles from './WorkspaceList.module.scss';

interface WorkspaceListProps {
  workspaces: Workspace[];
  onCreateClick: () => void;
}

const WorkspaceList: React.FC<WorkspaceListProps> = ({ workspaces, onCreateClick }) => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Workspaces</h2>
        <button onClick={onCreateClick} className={styles.createButton}>
          Create Workspace
        </button>
      </div>

      <div className={styles.list}>
        {workspaces.map((workspace) => (
          <Link
            key={workspace.id}
            href={`/workspaces/${workspace.id}`}
            className={styles.workspaceCard}
          >
            <h3>{workspace.name}</h3>
            <div className={styles.meta}>
              <span>Created {new Date(workspace.createdAt).toLocaleDateString()}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default WorkspaceList; 