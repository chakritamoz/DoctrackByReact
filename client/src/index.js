import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';
import './index.css';
import Root from './routes/root';
import ErrorPage from './routes/error-page';
import SignIn from './routes/signin';
import Register from './routes/register';
import OTP from './routes/otp';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        errorElement: <ErrorPage />,
      },
    ],
  },
  {
    path: "signin",
    element: <SignIn />
  },
  {
    path: "register",
    element: <Register />
  },
  {
    path: "otp",
    element: <OTP />
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={ router } />
  </React.StrictMode>
);
