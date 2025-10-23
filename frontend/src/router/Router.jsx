import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "../pages/common/RootLayout";
import Home from "../pages/common/Home";
import Register from "../pages/auth/Register";
import Login from "../pages/auth/Login";
import PublicRoute from "./PublicRoute"; // ✅ import the wrapper

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },

      // ✅ Wrap public routes under PublicRoute
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
