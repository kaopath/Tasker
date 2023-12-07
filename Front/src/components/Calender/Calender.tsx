import  { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import TaskCrud from "../Task/TaskCrud";
import { EventList } from "../../models/task";
import "./Calender.css";
import { EventClickArg } from "@fullcalendar/core/index.js";
import { useCalendar } from "./CalenderContext";

const Calender = () => {
  const { eventList } = useCalendar();
  const [modalShow, setModalShow] = useState(false);

  const [selectedEvent, setSelectedEvent] = useState<EventList>(
    {} as EventList
  );

  const handleCloseModal = () => {
    setModalShow(false);
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    const eventItem = eventList.find((s) => s.id === clickInfo.event.id);
    if (eventItem) {
      setSelectedEvent(eventItem);
    }

    setModalShow(true);
  };

  return (
    <>
      <div>
        <TaskCrud
          show={modalShow}
          onHide={handleCloseModal}
          data={selectedEvent}
        />
      </div>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        initialView="dayGridMonth"
        events={eventList}
        editable={true}
        selectable={true}
        selectMirror={true}
        dayMaxEvents={true}
        themeSystem="bootstrap"
        eventClick={handleEventClick}
      />
    </>
  );
};
export default Calender;
