import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import styles from './TaskForm.module.scss';
import { TaskPriority } from '@/types/task';

interface FormInputs {
  title: string;
  description: string;
  priority: TaskPriority;
  dueDate: string;
}

interface TaskFormProps {
  onSubmit: (data: FormInputs) => void;
  initialData?: {
    title?: string;
    description?: string;
    priority?: TaskPriority;
    dueDate?: string;
  };
}

const TaskForm: React.FC<TaskFormProps> = ({ onSubmit, initialData = {} }) => {
  const { register, handleSubmit } = useForm<FormInputs>({
    defaultValues: initialData
  });

  const onSubmitForm: SubmitHandler<FormInputs> = (data) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className={styles.form}>
      <div className={styles.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          {...register('title', { required: true })}
          placeholder="Task title"
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          {...register('description')}
          placeholder="Task description"
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="priority">Priority</label>
        <select id="priority" {...register('priority')}>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
          <option value="URGENT">Urgent</option>
        </select>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="dueDate">Due Date</label>
        <input
          id="dueDate"
          type="datetime-local"
          {...register('dueDate', { required: true })}
        />
      </div>

      <button type="submit" className={styles.submitButton}>
        Save Task
      </button>
    </form>
  );
};

export default TaskForm; 