import { EventList, Task } from "../models/task";

export const convertTaskListToEventList = (data: Task[]) => {
  const event: EventList[] = [];
  data.forEach((item: Task) => {
    event.push({
      id: item.taskId,
      userId: item.userId,
      title: item.subject,
      start: item.startTime,
      end: item.endTime,
      className: "event-success",
      description: item.description,
    });
  });
  return event;
};

export const convertTaskToEvent = (data: Task) => {
  return {
    id: data.taskId,
    userId: data.userId,
    title: data.subject,
    start: data.startTime,
    end: data.endTime,
    className: "event-success",
    description: data.description,
  };
};

export const convertEventToTask = (data: EventList) => {
  return {
    taskId: data.id,
    userId: data.userId,
    date: data.start,
    startTime: data.start,
    endTime: data.end,
    subject: data.title,
    description: data.description,
    status: "event-success",
  };
};
