export type TaskDto = {
  UserId: ObjectId;
  Date: Date;
  StartTime: Date;
  EndTime: Date;
  Subject: string;
  Description: string;
  Status: string;
};

export type Task = {
  taskId: ObjectId;
  userId: ObjectId;
  date: Date;
  startTime: Date;
  endTime: Date;
  subject: string;
  description: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
};

export type EventList = {
  id: string;
  userId: ObjectId;
  title: string;
  start: Date;
  end: Date;
  className: string;
  description: string;
};
