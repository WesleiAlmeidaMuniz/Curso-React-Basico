import { createBrowserRouter } from "react-router-dom";
import { Home } from "./layouts/home";
import { Details } from "./layouts/Details";

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Home />,
    },
    {
        path: '/details/:id',
        element: <Details />,
    },
])