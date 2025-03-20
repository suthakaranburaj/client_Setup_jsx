import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import * as Pages from "./layout/index.js";
import * as Routes from "./routes/index.js";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom"; // Import Navigate

const router = createBrowserRouter([
  {
    path: Routes.HOMEPAGE,
    element: <Pages.HomePage />,
    children: [
      {
        path: "/",
        element: <Navigate to={Routes.DASHBOARD} replace /> // Redirect to /dashboard
      },
      {
        path: Routes.DASHBOARD,
        element: <Pages.Dashboard />
      },
      {
        path: Routes.PROFILE,
        element: <Pages.ProfilePage />
      }
    ]
  },
  {
    path: Routes.LOGIN, // Add this route
    element: <Pages.Login />
  },
  {
    path: Routes.REGISTER, // Add this route
    element: <Pages.Register />
  }
  // {
  //   path:'/chatbot',
  //   element:<ChatBot/>
  // }
]);

createRoot(document.getElementById("root")).render(<RouterProvider router={router} />);
