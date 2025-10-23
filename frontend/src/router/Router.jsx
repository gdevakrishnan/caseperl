import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "../pages/common/RootLayout";
import Home from "../pages/common/Home";
import Register from "../pages/auth/Register";
import Login from "../pages/auth/Login";
import PublicRoute from "./PublicRoute";
import PrivateRoute from "./PrivateRoute";
import CreateCase from "../pages/case/CreateCase";
import Cases from "../pages/case/Cases";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },

      // ✅ Private route (only logged-in users)
      {
        element: <PrivateRoute />,
        children: [
          { path: "cases", element: <Cases /> },
          { path: "new-case", element: <CreateCase /> }
        ],
      },

      // ✅ Public routes (only for guests)
      {
        element: <PublicRoute />,
        children: [
          { path: "register", element: <Register /> },
          { path: "login", element: <Login /> },
        ],
      },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
