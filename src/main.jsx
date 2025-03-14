import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import * as Pages from "./layout/index.js";
import * as Routes from "./routes/index.js";
import { createBrowserRouter, RouterProvider } from "react-router-dom";


const router = createBrowserRouter([
  {
    path: Routes.HOMEPAGE,
    element: <Pages.HomePage />
    // children: [
      // {
      //   path: Routes.CHATBOT,
      //   element: <Pages.ChatBot />,
      //   children: [
      //     {
      //       path: Routes.CHATPAGE,
      //       element: <Pages.ChattingPage />,
      //     },
      //   ],
      // },
    //   {
    //     path: Routes.DASHBOARD,
    //     element: <Pages.Dashboard />,
    //   },
    // ],
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
