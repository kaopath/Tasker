import { useState } from "react";
import { Formik, Form, Field, ErrorMessage, FormikValues } from "formik";
import * as Yup from "yup";
import { Container, Row, Col, Card, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { createAxiosInstancewithoutToken } from "../../utils/axios";
import { AxiosResponse } from "axios";
import { useAuth } from "../../components/Auth/AuthProvider";
import { AuthenticatedUserDto } from "../../models/user";

//const baseTaskUrl = import.meta.env.VITE_TASK_BASE_URL;
const baseAuthUrl = import.meta.env.VITE_AUTH_BASE_URL;
const Register = () => {
  const navigate = useNavigate();
  const { setUserToken } = useAuth();
  const axiosAuthIntance = createAxiosInstancewithoutToken(baseAuthUrl);
  //const axiosTaskIntance = createAxiosInstancewithoutToken(baseTaskUrl);
  const [alertMessage, setAlertMessage] = useState("");
  const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    firstName: Yup.string().required("Required"),
    lastName: Yup.string().required("Required"),
    email: Yup.string().email("Invalid email address").required("Required"),
    password: Yup.string().required("Required"),
  });

  const onSubmit = (values: FormikValues) => {
    axiosAuthIntance
      .post(`${baseAuthUrl}/auth/register`, values) // Send all registration fields
      .then((response: AxiosResponse<AuthenticatedUserDto>) => {
        setUserToken(response.data);
        localStorage.setItem("user", JSON.stringify(response.data));
        navigate("/login", { replace: true }); // Redirect to login page after successful registration
      })
      .catch((error) => {
        setAlertMessage(error.response?.data?.message);
      });
  };

  return (
    <section className="vh-100 gradient-custom">
      <Container className="py-5 h-100">
        <Row className="d-flex justify-content-center align-items-center h-100">
          <Col md={8} lg={6} xl={5}>
            <Card bg="light" text="black" style={{ borderRadius: "1rem" }}>
              <Card.Body className="p-5 text-center">
                {alertMessage && (
                  <Alert
                    variant="danger"
                    onClose={() => setAlertMessage("")}
                    dismissible
                  >
                    {alertMessage}
                  </Alert>
                )}
                <div className="mb-md-3 mt-md-4 pb-5">
                  <h2 className="fw-bold mb-2 text-uppercase">Register</h2>
                  <p className="text-black-50 mb-5">
                    Please fill in the registration details.
                  </p>
                  <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={onSubmit}
                  >
                    <Form>
                      <div className="form-outline form-black mb-4">
                        <Field
                          type="text"
                          name="firstName"
                          className="form-control form-control-lg"
                          placeholder="First Name"
                        />
                        <ErrorMessage
                          name="firstName"
                          component="div"
                          className="text-black"
                        />
                      </div>
                      <div className="form-outline form-black mb-4">
                        <Field
                          type="text"
                          name="lastName"
                          className="form-control form-control-lg"
                          placeholder="Last Name"
                        />
                        <ErrorMessage
                          name="lastName"
                          component="div"
                          className="text-black"
                        />
                      </div>
                      <div className="form-outline form-black mb-4">
                        <Field
                          type="email"
                          name="email"
                          className="form-control form-control-lg"
                          placeholder="Email"
                        />
                        <ErrorMessage
                          name="email"
                          component="div"
                          className="text-black"
                        />
                      </div>
                      <div className="form-outline form-black mb-4">
                        <Field
                          type="password"
                          name="password"
                          className="form-control form-control-lg"
                          placeholder="Password"
                        />
                        <ErrorMessage
                          name="password"
                          component="div"
                          className="text-black"
                        />
                      </div>
                      <Button
                        type="submit"
                        variant="outline-dark"
                        className="btn-lg px-5"
                      >
                        Register
                      </Button>
                    </Form>
                  </Formik>
                </div>
                <div>
                  <p className="mb-0">
                    Already have an account?{" "}
                    <a href="/login" className="text-black-50 fw-bold">
                      Login
                    </a>
                  </p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Register;
