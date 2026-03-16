import { createBrowserRouter } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { RequireAuth } from '../auth/RequireAuth';
import { LoginPage } from '../pages/LoginPage';
import { ShopsPage } from '../pages/ShopsPage';
import { ShopActivityPage } from '../pages/ShopActivityPage';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: (
      <RequireAuth>
        <Layout />
      </RequireAuth>
    ),
    children: [
      { index: true, element: <ShopsPage /> },
      { path: 'shops/:shopId/activity', element: <ShopActivityPage /> },
    ],
  },
]);
