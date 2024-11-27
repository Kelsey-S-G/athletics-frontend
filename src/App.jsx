import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppLayout from "./layouts/app-layout";
import LandingPage from "./pages/landing";
import { Sports } from "./pages/Sports";
import Tickets from "./pages/Tickets";
import AthleteList from "./pages/AllAthletes";
import Events from "./pages/Events";
import Recruitment from "./pages/Recruitment";
import RecruitmentForm from "./pages/RecruitmentForm";
import Shop from "./pages/Shop";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Teams from "./pages/Team";

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <LandingPage />,
      },
      {
        path: "/all-sports",
        element: <Sports />,
      },
      {
        path: "/tickets",
        element: <Tickets />,
      },
      {
        path: "/athlete-list",
        element: <AthleteList />,
      },
      {
        path: "/events",
        element: <Events />,
      },
      {
        path: "/recruit",
        element: <Recruitment />,
      },
      {
        path: "/recruit-form",
        element: <RecruitmentForm />,
      },
      {
        path: "/shop",
        element: <Shop />,
      },
      {
        path: "/dashboard",
        element: <AdminDashboard />,
      },
      {
        path: "/teams",
        element: <Teams />,
      },

    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
