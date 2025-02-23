import React from 'react';
import styles from './WorkspaceForm.module.scss';

interface WorkspaceFormProps {
  onSubmit: (data: any) => void;
  initialData?: {
    name: string;
  };
}

const WorkspaceForm: React.FC<WorkspaceFormProps> = ({ onSubmit, initialData }) => {
  const [formData, setFormData] = React.useState({
    name: initialData?.name || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.field}>
        <label htmlFor="name">Workspace Name</label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>

      <button type="submit" className={styles.submitButton}>
        {initialData ? 'Update Workspace' : 'Create Workspace'}
      </button>
    </form>
  );
};

export default WorkspaceForm; 