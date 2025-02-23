import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Task } from '@/types/task';
import styles from './Calendar.module.scss';

interface CalendarProps {
  tasks: Task[];
  onTaskClick: (taskId: string) => void;
  onDateSelect: (start: Date, end: Date) => void;
}

const Calendar: React.FC<CalendarProps> = ({ tasks, onTaskClick, onDateSelect }) => {
  // Convert tasks to calendar events
  const events = tasks.map(task => ({
    id: task.id,
    title: task.title,
    start: task.dueDate,
    end: task.dueDate,
    allDay: true,
    className: [
      styles.task,
      styles[`priority${task.priority}`],
      styles[`status${task.status}`],
    ],
  }));

  return (
    <div className={styles.calendarWrapper}>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay',
        }}
        events={events}
        eventClick={(info) => onTaskClick(info.event.id)}
        selectable={true}
        select={(info) => {
          onDateSelect(info.start, info.end);
        }}
        height="auto"
        dayMaxEvents={true}
      />
    </div>
  );
};

export default Calendar; 