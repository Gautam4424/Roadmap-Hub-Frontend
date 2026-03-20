import { createBrowserRouter } from 'react-router';
import { Home } from './pages/Home';
import { RoadmapDetail } from './pages/RoadmapDetail';
import { Profile } from './pages/Profile';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
export const router = createBrowserRouter([
  {
    path: '/',
    Component: Home,
  },
  {
    path: '/roadmap/:id',
    Component: RoadmapDetail,
  },
  {
    path: '/profile',
    Component: Profile,
  },
  {
    path: '/login',
    Component: Login,
  },
  {
    path: '/register',
    Component: Register,
  },
  {
    path: '*',
    element: (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
          <p className="text-gray-600 mb-6">Page not found</p>
          <a href="/" className="text-blue-600 hover:text-blue-700 font-medium">
            Go back home
          </a>
        </div>
      </div>
    ),
  },
]);
