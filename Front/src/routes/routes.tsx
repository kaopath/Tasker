
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { ProtectedRoute } from "../components/Auth/ProtectedRoute";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import Notfound from "../pages/Notfound/Notfound";
import { Suspense } from "react";
import Spinner from "../components/Spinner/Spinner";
import Home from "../pages/Home/Home";


const Routes = () => {

  const routes = [
    {
      path: "/login",
      element: <Login />
    },
    {
      path: "/register",
      element: <Register />
    },
    {
      path: "/",
      element: <ProtectedRoute />, 
      children: [
        {
          path: "/",
          element: <Suspense fallback={<Spinner />}><Home /></Suspense>
        },
      ],
    },
    {
      path: "*",
      element: <Notfound />
    },
  ];

  const router = createBrowserRouter([...routes]);

  return <RouterProvider router={router} />;
};

export default Routes;
