import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import ProtectedLayout from '@/components/ProtectedLayout/ProtectedLayout';
import styles from './calendar.module.scss';
import TaskDetailModal from '@/components/TaskDetailModal/TaskDetailModal';
import TaskForm from '@/components/TaskForm/TaskForm';
import { Modal } from '@/components/Modal/Modal';
import { useTaskManager } from '@/hooks/useTaskManager';
import { Task } from '@/types/task';

const CalendarPage = () => {
  const { data: session } = useSession();
  const { tasks, addTask, updateTask } = useTaskManager();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleEventClick = (info: any) => {
    const task = tasks.find(t => t.id === info.event.id);
    if (task) {
      setSelectedTask(task);
    }
  };

  const handleDateClick = (info: any) => {
    setSelectedDate(info.date);
    setIsTaskModalOpen(true);
  };

  const handleTaskUpdate = (updatedTask: Task) => {
    updateTask(updatedTask.id, updatedTask);
    setSelectedTask(null);
  };

  const handleCreateTask = (data: any) => {
    const newTask: Task = {
      id: `task_${Date.now()}`,
      title: data.title,
      description: data.description || '',
      status: 'TODO',
      priority: data.priority || 'MEDIUM',
      dueDate: selectedDate || new Date(data.dueDate),
      createdAt: new Date(),
      assignee: {
        name: session?.user?.name || 'Me'
      }
    };
    addTask(newTask);
    setIsTaskModalOpen(false);
    setSelectedDate(null);
  };

  const events = tasks.map(task => ({
    id: task.id,
    title: task.title,
    start: task.dueDate,
    className: `priority${task.priority} status${task.status}`,
    extendedProps: {
      description: task.description
    }
  }));

  return (
    <ProtectedLayout>
      <div className={styles.calendarWrapper}>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={events}
          eventClick={handleEventClick}
          dateClick={handleDateClick}
          selectable={true}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          editable={true}
          eventDrop={(info) => {
            const task = tasks.find(t => t.id === info.event.id);
            if (task) {
              updateTask(task.id, {
                ...task,
                dueDate: info.event.start || new Date()
              });
            }
          }}
        />
      </div>

      {/* Modal for viewing/editing existing task */}
      <TaskDetailModal
        task={selectedTask}
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        onSave={handleTaskUpdate}
      />

      {/* Modal for creating new task */}
      <Modal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setSelectedDate(null);
        }}
        title="Nueva Tarea"
      >
        <TaskForm
          onSubmit={handleCreateTask}
          initialData={
            selectedDate
              ? {
                  dueDate: selectedDate.toISOString().slice(0, 16)
                }
              : undefined
          }
        />
      </Modal>
    </ProtectedLayout>
  );
};

export default CalendarPage; 