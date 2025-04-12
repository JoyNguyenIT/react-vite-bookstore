import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Layout from '@/layout';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import BookPage from 'pages/client/book.tsx';
import AboutPage from 'pages/client/about.tsx';
import LoginPage from 'pages/client/auth/login.tsx';
import RegisterPage from 'pages/client/auth/register.tsx';
import 'styles/global.scss'
import HomePage from 'pages/client/home';
import { App, ConfigProvider } from 'antd';
import { AppProvider } from 'components/context/app.context';
import ProtectedRoute from 'components/auth';
import LayoutAdmin from 'components/layout/layout.admin';
import DashBoardAdmin from '@/components/admin/funt/dashboard';
import ManageBook from 'components/admin/funt/manage.book';
import ManageUser from '@/components/admin/funt/manage.user';
import ManageOrder from '@/components/admin/funt/manage.order';
import History from '@/pages/client/history';
import enUS from 'antd/locale/en_US';
import OrderPage from './pages/client/order';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />
      },
      {
        path: "/book/:id",
        element: <BookPage />,
      },
      {
        path: "/about",
        element: <AboutPage />,
      },
      {
        path: "/order",
        element: <OrderPage />,
      },
      {
        path: "/checkout",
        element: <ProtectedRoute>
          <div>Checkout page</div>
        </ProtectedRoute>
      },
      {
        path: "/history",
        element: <ProtectedRoute>
          <History />
        </ProtectedRoute>
      },

    ]
  },
  {
    path: "admin",
    element: (
      <ProtectedRoute>
        <LayoutAdmin />
      </ProtectedRoute>
    )
    ,
    children: [
      {
        index: true,
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <DashBoardAdmin />
          </ProtectedRoute>
        )
      },
      {
        path: "managebook",
        element: <ProtectedRoute>
          <ManageBook />
        </ProtectedRoute>
      },
      {
        path: "manageuser",
        element: <ProtectedRoute>
          <ManageUser />
        </ProtectedRoute>
      },
      {
        path: "manageorder",
        element: <ProtectedRoute>
          <ManageOrder />
        </ProtectedRoute>
      }
    ]
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />
  },

]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App>
      <AppProvider>
        <ConfigProvider locale={enUS}>
          <RouterProvider router={router} />
        </ConfigProvider>
      </AppProvider>

    </App>
  </StrictMode>,
)
