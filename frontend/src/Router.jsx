import {createBrowserRouter} from "react-router";
import {Login} from "./pages/login/Login.jsx";

export const router = createBrowserRouter(
    [
        {
            path: '/login',
            Component: Login,
            children: [

            ]
        }
    ]
)