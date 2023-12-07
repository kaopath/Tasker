import { FC } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Modal, Button } from "react-bootstrap";
import { Task, EventList } from "../../models/task";
import { UserList } from "../../models/user";
import { createAxiosInstance } from "../../utils/axios";
import { AxiosResponse } from "axios";
import {
  convertToDateString,
  convertToDateTime,
  convertToTimeString,
} from "../../utils/DateTimeConvertion";
import { ObjectsEqual } from "../../utils/ObjectEqual";
import { useCalendar } from "../Calender/CalenderContext";
import { convertTaskToEvent } from "../../utils/ConvertData";

interface TaskCrudProps {
  show: boolean;
  onHide: () => void;
  data: EventList;
  isAdd?: boolean | "false";
}

const baseTaskUrl = import.meta.env.VITE_TASK_BASE_URL;
//const baseAuthUrl = import.meta.env.VITE_AUTH_BASE_URL;
const TaskCrud: FC<TaskCrudProps> = ({ show, onHide, data, isAdd }) => {
  const { userList, addCalendarData, updateCalendarData, deleteCalendarData } = useCalendar();
  //const axiosAuthIntance = createAxiosInstance(baseAuthUrl);
  const axiosTaskIntance = createAxiosInstance(baseTaskUrl);

  if (!show) {
    return null;
  }

  const initialValues =
    isAdd == true ?
      {
        user: data.userId,
        subject: data.title,
        description: data.description,
      }
      :
      {
        user: data.userId,
        date: convertToDateString(data.start.toString()),
        startTime: convertToTimeString(data.start.toString()),
        endTime: convertToTimeString(data.end.toString()),
        subject: data.title,
        description: data.description,
      };

  const validationSchema = Yup.object({
    user: Yup.string().required("Required"),
    date: Yup.date().required("Required").nullable(),
    startTime: Yup.string()
      .required("Required")
      .test(
        "is-valid-start-time",
        "Start time cannot be greater than end time",
        function (startTime) {
          const endTime = this.parent.endTime;
          return !startTime || !endTime || startTime <= endTime;
        }
      ),
    endTime: Yup.string()
      .required("Required")
      .test(
        "is-valid-end-time",
        "End time cannot be less than start time",
        function (endTime) {
          const startTime = this.parent.startTime;
          return !startTime || !endTime || endTime >= startTime;
        }
      ),
    subject: Yup.string().required("Required"),
    description: Yup.string(),
  });

  const deleteHandler = async () => {
    if (confirm(`Are you sure you want to delete the task '${data.title}'`)) {
      await axiosTaskIntance
        .delete(`${baseTaskUrl}/Tasks/${data.id}`)
        .then(() => {
          deleteCalendarData(data.id);
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          onHide();
        });
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title> Task CRUD</Modal.Title>
      </Modal.Header>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        enableReinitialize={true}
        onSubmit={async (values, { resetForm }) => {
          const touched = !ObjectsEqual(data, values);
          if (touched) {
            const updateData = {
              userId: values.user,
              date: new Date(values.date),
              startTime: convertToDateTime(
                values.date.toString(),
                values.startTime
              ),
              endTime: convertToDateTime(
                values.date.toString(),
                values.endTime
              ),
              subject: values.subject,
              description: values.description,
              status: "event-info",
            };
            if (isAdd == true) {
              axiosTaskIntance
                .post(`${baseTaskUrl}/tasks`, updateData)
                .then((response: AxiosResponse<Task>) => {
                  console.log(response.data);
                  addCalendarData(convertTaskToEvent(response.data))
                  resetForm();
                })
                .catch((error) => {
                  console.log(error);
                }).finally(() => {
                  onHide();
                });
            } else {
              await axiosTaskIntance
                .put(`${baseTaskUrl}/Tasks/${data.id}`, updateData)
                .then(() => {
                  updateCalendarData({
                    id: data.id,
                    userId: updateData.userId,
                    title: updateData.subject,
                    start: updateData.startTime,
                    end: updateData.endTime,
                    className: "event-success",
                    description: updateData.description,
                  });
                })
                .catch((error) => {
                  console.log(error);
                })
                .finally(() => {
                  onHide();
                });

            }
          } else {
            onHide();
          }
        }
        }
      >
        <Form>
          <Modal.Body>
            <div className="form-outline form-black mb-4">
              <Field
                as="select"
                name="user"
                className="form-control form-control-lg"
              >
                <option value="" >
                  Select User
                </option>
                {userList.map((user: UserList) => (
                  <option key={user.userId} value={user.userId}>
                    {user.firstName} {user.lastName}
                  </option>
                ))}
              </Field>
              <ErrorMessage
                name="user"
                component="div"
                className="text-black"
              />
            </div>
            <div className="form-outline form-black mb-4">
              <Field
                type="date"
                name="date"
                className="form-control form-control-lg"
              />
              <ErrorMessage
                name="date"
                component="div"
                className="text-black"
              />
            </div>
            <div className="form-outline form-black mb-4">
              <Field
                type="time"
                name="startTime"
                className="form-control form-control-lg"
              />
              <ErrorMessage
                name="startTime"
                component="div"
                className="text-black"
              />
            </div>
            <div className="form-outline form-black mb-4">
              <Field
                type="time"
                name="endTime"
                className="form-control form-control-lg"
              />
              <ErrorMessage
                name="endTime"
                component="div"
                className="text-black"
              />
            </div>
            <div className="form-outline form-black mb-4">
              <Field
                type="text"
                name="subject"
                className="form-control form-control-lg"
                placeholder="Subject"
              />
              <ErrorMessage
                name="subject"
                component="div"
                className="text-black"
              />
            </div>
            <div className="form-outline form-black mb-4">
              <Field
                as="textarea"
                rows={3}
                name="description"
                className="form-control form-control-lg"
                placeholder="Description"
              />
              <ErrorMessage
                name="description"
                component="div"
                className="text-black"
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={onHide}>
              Close
            </Button>
            {isAdd == true ?
              <Button variant="primary" type="submit">
                Add
              </Button>
              :
              <><Button variant="danger" onClick={deleteHandler}>
                Delete
              </Button>
                <Button variant="primary" type="submit">
                  Update
                </Button></>
            }
          </Modal.Footer>
        </Form>
      </Formik>
    </Modal >
  );
};

export default TaskCrud;
