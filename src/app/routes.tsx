import { createBrowserRouter, Link } from 'react-router';
import { Home as HomeIcon } from 'lucide-react';
import { Home } from './pages/Home';
import { RoadmapDetail } from './pages/RoadmapDetail';
import { Profile } from './pages/Profile';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { AdminDashboard } from './pages/AdminDashboard';
import { Courses } from './pages/Courses';
import { Library } from './pages/Library';
import { MainLayout } from './components/MainLayout';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Home,
  },
  {
    path: '/admin',
    Component: AdminDashboard,
  },
  {
    path: '/roadmaps/:id',
    Component: RoadmapDetail,
  },
  {
    path: '/courses',
    Component: Courses,
  },
  {
    path: '/library',
    Component: Library,
  },
  {
    path: '/resources',
    Component: () => <PlaceholderPage title="Resources Library" description="Access a curated collection of learning guides and materials." />,
  },
  {
    path: '/lab',
    Component: () => <PlaceholderPage title="Practice Lab" description="Test your skills in our interactive practice environment." />,
  },
  {
    path: '/mentors',
    Component: () => <PlaceholderPage title="Expert Mentorship" description="Connect with industry experts for career guidance and reviews." />,
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
    element: <PlaceholderPage title="Error 404" description="The requested topic could not be found." isError />,
  },
]);

function PlaceholderPage({ title, description, isError }: { title: string, description: string, isError?: boolean }) {
  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center p-8 md:p-20 text-center transition-colors duration-500">
        <div className={`w-24 h-24 rounded-[2rem] bg-[var(--bg-card)] border border-[var(--border-main)] flex items-center justify-center mb-8 shadow-2xl ${isError ? 'text-red-500 border-red-500/20 bg-red-500/5' : 'text-emerald-500'}`}>
          <HomeIcon size={48} />
        </div>
        <h1 className="text-5xl font-black text-[var(--text-main)] mb-4 tracking-tighter uppercase">{title}</h1>
        <p className="text-xl text-[var(--text-muted)] max-w-lg leading-relaxed font-medium mb-12">{description}</p>
        <Link to="/" className="px-12 py-5 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl transition-all shadow-xl shadow-emerald-500/20 uppercase tracking-[0.3em] text-[10px] text-center active:scale-95">
          Back to Dashboard
        </Link>
        <div className="mt-16 text-[10px] font-black text-gray-400 uppercase tracking-[0.5em]">Status: <span className={isError ? 'text-red-500' : 'text-emerald-500'}>{isError ? 'ERROR' : 'ACTIVE'}</span></div>
      </div>
    </MainLayout>
  );
}
