import {createBrowserRouter, redirect} from "react-router";
import {Login} from "./pages/login/Login.jsx";
import {Main} from "./pages/main/Main.jsx";
import {SignIn} from "./pages/signIn/SignIn.jsx";

const checkAuth = () => {
  return !!localStorage.getItem('Token');
};

const authLoader = () => {
  if (!checkAuth()) {
    return redirect('/login');
  }
  return null;
};

const guestLoader = () => {
  if (checkAuth()) {
    return redirect('/');
  }
  return null;
};

export const router = createBrowserRouter(
    [
        {
            path: '/login',
            Component: Login,
            loader: guestLoader,
            children: [],
        },
        {
            path: '/sign',
            Component: SignIn,
            loader: guestLoader,
            children: [],
        },
        {
            path: '/',
            Component: Main,
            loader: authLoader,
            children: [
            ],
        },
          {
            path: '*',
            loader: () => redirect(checkAuth() ? '/' : '/login'),
          },
    ]
)

