import { createBrowserRouter } from "react-router-dom";
import Login from "../Pages/Login";
import Register from "../Pages/Register";
import HomeLayout from "../layouts/HomeLayout";
import ProfileLayout from "../layouts/ProfileLayout";
import ConnectionLayout from "../layouts/ConnectionLayout";
import AdminApp from "../admin/AdminApp";
import CompanyApp from "../company/CompanyApp";
import CompanyProfilePage from "../pages/CompanyProfilePage";
import ConnectionsPage from "../pages/ConnectionsPage";
import FriendsPage from "../pages/FriendsPage";
import NotificationsPage from "../pages/NotificationsPage";
import JobsPage from "../pages/JobsPage";
import JobDetailsPage from "../pages/JobDetailsPage";
import AllCompaniesPage from "../pages/AllCompaniesPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/home",
    element: <HomeLayout />,
  },
  {
    path: "/profile",
    element: <ProfileLayout />,
  },
  {
    path: "/connections",
    element: <ConnectionsPage />,
  },
  {
    path: "/friends",
    element: <FriendsPage />,
  },
  {
    path: "/notifications",
    element: <NotificationsPage />,
  },
  {
    path: "/jobs",
    element: <JobsPage />,
  },
  {
    path: "/job/:id",
    element: <JobDetailsPage />,
  },
  {
    path: "/companies",
    element: <AllCompaniesPage />,
  },
  {
    path: "/company-profile/:id",
    element: <CompanyProfilePage />,
  },
  {
    path: "/admin/*",
    element: <AdminApp />,
  },
  {
    path: "/company/*",
    element: <CompanyApp />,
  },
]);
