import { useState } from "react";
import Calendar from "../../components/Calender/Calender";
import { EventList } from "../../models/task";
import { Button, Container, Row } from "react-bootstrap";
import { useAuth } from "../../components/Auth/AuthProvider";
import { CalendarProvider } from "../../components/Calender/CalenderContext";
import TaskCrud from "../../components/Task/TaskCrud";

const Home = () => {
  const { setUserToken } = useAuth();
  const [modalShow, setModalShow] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventList>(
    {} as EventList
  );

  const handleCloseModal = () => {
    setModalShow(false);
  };


  const handleSignOut = () => {
    localStorage.removeItem("user");
    setUserToken(null);
  };
  return (
    <>
      <main>
        <Container className="mt-5">
          <Row>
            <CalendarProvider>
              <Container className="col-lg-8">
                <Button variant="outline-dark" onClick={handleSignOut}>
                  Sign Out
                </Button>
                <Button onClick={() => setModalShow(true)}> Add Task</Button>
              </Container>

              <TaskCrud
                show={modalShow}
                onHide={handleCloseModal}
                data={selectedEvent}
                isAdd={true} />

            </CalendarProvider>
          </Row>
          <br></br>
          <Row>
            <CalendarProvider>
              <Container className="col-lg-8">
                <Calendar />
                {/* </Container>
              <Container className="col-lg-4">
  <AddTask />*/}
              </Container>
            </CalendarProvider>
          </Row>
        </Container>
      </main>
    </>
  );
};

export default Home;
