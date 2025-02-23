import dynamic from 'next/dynamic';
import { Task } from '@/types/task';
import ClientOnly from './ClientOnly';

export interface KanbanBoardProps {
  tasks: Task[];
  onTaskMove: (taskId: string, newStatus: Task['status']) => void;
  onTaskClick: (taskId: string) => void;
  onDeleteClick: (task: Task) => void;
}

const KanbanBoard = dynamic(() => import('./KanbanBoard/KanbanBoard'), {
  ssr: false,
  loading: () => <div>Loading...</div>
});

const DragDropWrapper = (props: KanbanBoardProps) => {
  return (
    <ClientOnly>
      <KanbanBoard {...props} />
    </ClientOnly>
  );
};

export default DragDropWrapper; 