import React, { createContext, useContext, useEffect, useState } from "react";
import { EventList, Task } from "../../models/task";
import { createAxiosInstance } from "../../utils/axios";
import { AxiosResponse } from "axios";
import { UserList } from "../../models/user";
import { convertTaskListToEventList } from "../../utils/ConvertData";

const baseTaskUrl = import.meta.env.VITE_TASK_BASE_URL;
const baseAuthUrl = import.meta.env.VITE_AUTH_BASE_URL;
interface CalendarContextType {
  eventList: EventList[];
  userList: UserList[];
  addCalendarData: (newData: EventList) => void;
  updateCalendarData: (updateData: EventList) => void;
  deleteCalendarData: (taskId: string) => void;
}

const CalendarContext = createContext<CalendarContextType | undefined>(
  undefined
);

export const useCalendar = () => {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error("useCalendar must be used within a CalendarProvider");
  }
  return context;
};

interface CalendarProviderProps {
  children: React.ReactNode;
}

export const CalendarProvider: React.FC<CalendarProviderProps> = ({
  children,
}) => {
  const axiosAuthIntance = createAxiosInstance(baseAuthUrl);
  const axiosTaskIntance = createAxiosInstance(baseTaskUrl);
  const [eventList, setEventList] = useState<EventList[]>([]);
  const [userList, setUserList] = useState<UserList[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      await axiosTaskIntance
        .get(`${baseTaskUrl}/tasks`)
        .then((response: AxiosResponse<Task[]>) => {
          setEventList(convertTaskListToEventList(response.data));
        })
        .catch((error) => {
          console.log(error);
        });
    };

    const fetchUsers = async () => {
      await axiosAuthIntance
        .get(`${baseAuthUrl}/auth`)
        .then((response: AxiosResponse<UserList[]>) => {
          setUserList(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    fetchData();
    fetchUsers();
  }, []);

  const addCalendarData = (newData: EventList) => {
    setEventList([...eventList, newData]);
  };

  const updateCalendarData = (updateData: EventList) => {
    const eventIndex = eventList.findIndex(
      (event) => event.id === updateData.id
    );
    if (eventIndex !== -1) {
      const updatedEventList = [...eventList];

      updatedEventList[eventIndex] = {
        id: updateData.id,
        userId: updateData.userId,
        title: updateData.title,
        start: updateData.start,
        end: updateData.end,
        description: updateData.description,
        className: "event-success",
      };

      setEventList(updatedEventList);
    }
  };

  const deleteCalendarData = (taskId: string) => {
    const updatedEventList = eventList.filter((event) => event.id !== taskId);
    setEventList(updatedEventList);
  };

  return (
    <CalendarContext.Provider
      value={{
        eventList,
        userList,
        addCalendarData,
        updateCalendarData,
        deleteCalendarData,
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
};
