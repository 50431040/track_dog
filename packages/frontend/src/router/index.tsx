import { lazy } from "react";
import { useRoutes } from "react-router-dom";

const HomePage = lazy(() => import("../pages/Home/index.tsx"));

const routeList = [
  // 首页
  {
    path: "/",
    element: <HomePage />,
    children: [],
  },
];

const RenderRouter = () => {
  return useRoutes(routeList);
};

export default RenderRouter;
