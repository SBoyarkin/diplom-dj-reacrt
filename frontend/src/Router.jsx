import {createBrowserRouter, redirect} from "react-router";
import {Login} from "./pages/login/Login.jsx";
import {Main} from "./pages/main/Main.jsx";
import {SignIn} from "./pages/signIn/SignIn.jsx";

export const router = createBrowserRouter(
    [
        {
            path: '/login',
            Component: Login,
            children: [],
        },
        {
            path: '/sign',
            Component: SignIn,
            children: [],
        },
        {
            path: '/main',
            Component: Main,
            children: [

            ],
        }
    ]
)

export async function loader({ request }) {
  if (!isLoggedIn(request))
    throw redirect("/login");
  }