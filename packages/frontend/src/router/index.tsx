import { lazy, useEffect } from "react";
import { useRoutes, useLocation, useNavigate } from "react-router-dom";
import useUserStore from "../store/useUserStore";

const HomePage = lazy(() => import("../pages/Home/index.tsx"));
const LoginPage = lazy(() => import("../pages/Login/index.tsx"));
const RegisterPage = lazy(() => import("../pages/Register/index.tsx"));
const OverviewPage = lazy(() => import("../pages/Overview/index.tsx"));
const UserManagerPage = lazy(() => import("../pages/UserManager/index.tsx"));
const ApplicationManagerPage = lazy(
  () => import("../pages/ApplicationManager/index.tsx"),
);

const LOGIN_PATH = "/login";
const REGISTER_PATH = "/register";

const routeList = [
  {
    path: "/",
    element: <HomePage />,
    children: [
      { index: true, element: <OverviewPage /> },
      { path: "/overview", element: <OverviewPage /> },
      { path: "/user-manager", element: <UserManagerPage /> },
      { path: "/application-manager", element: <ApplicationManagerPage /> },
    ],
  },
  { path: LOGIN_PATH, element: <LoginPage /> },
  { path: REGISTER_PATH, element: <RegisterPage /> },
];

const RenderRouter = () => {
  const { userInfo } = useUserStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const authPages = [LOGIN_PATH, REGISTER_PATH];
    if (!userInfo?.token && !authPages.includes(location.pathname)) {
      navigate(LOGIN_PATH);
    }
  }, [userInfo, location.pathname, navigate]);

  return useRoutes(routeList);
};

export default RenderRouter;
