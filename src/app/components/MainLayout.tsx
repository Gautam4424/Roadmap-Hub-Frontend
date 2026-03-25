import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router';
import {
  Home as HomeIcon,
  Layers,
  BookOpen,
  Microscope,
  Users,
  Sparkles,
  Bell,
  Sun,
  Moon,
  LogOut,
  User as UserIcon
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

interface MainLayoutProps {
  children: ReactNode;
  headerExtra?: ReactNode;
  hideSidebar?: boolean;
}

export function MainLayout({ children, headerExtra, hideSidebar = false }: MainLayoutProps) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] flex flex-col font-['Outfit'] transition-colors duration-500 overflow-x-hidden">
      {/* Dynamic Mesh Background Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-amber-500/5 blur-[120px] rounded-full"></div>
      </div>

      {/* Top Navigation HUD */}
      <header className="h-20 border-b border-[var(--border-main)] bg-[var(--bg-main)]/60 backdrop-blur-xl sticky top-0 z-50 px-8 flex items-center justify-between transition-all">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-12"
        >
          <Link to="/" className="text-2xl font-black tracking-tighter flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:rotate-12 transition-transform">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[var(--text-main)] to-emerald-800">SkillForge</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-[10px] font-black tracking-[0.2em] text-gray-400 uppercase">
            <Link 
              to="/" 
              className={`pb-7 translate-y-[1px] transition-colors ${isActive('/') ? 'text-emerald-500 border-b-2 border-emerald-500' : 'hover:text-[var(--text-main)]'}`}
            >
              DASHBOARD
            </Link>
            <Link 
              to="/courses" 
              className={`pb-7 translate-y-[1px] transition-colors ${isActive('/courses') ? 'text-emerald-500 border-b-2 border-emerald-500' : 'hover:text-[var(--text-main)]'}`}
            >
              COURSES
            </Link>
            <Link 
              to="/library" 
              className={`pb-7 translate-y-[1px] transition-colors ${isActive('/library') ? 'text-emerald-500 border-b-2 border-emerald-500' : 'hover:text-[var(--text-main)]'}`}
            >
              LIBRARY
            </Link>
            <Link 
              to="/lab" 
              className={`pb-7 translate-y-[1px] transition-colors ${isActive('/lab') ? 'text-emerald-500 border-b-2 border-emerald-500' : 'hover:text-[var(--text-main)]'}`}
            >
              PRACTICE LAB
            </Link>
          </nav>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-4"
        >
          {headerExtra}
          <button
            onClick={toggleTheme}
            className="w-11 h-11 rounded-2xl bg-[var(--bg-card)]/50 border border-[var(--border-main)] flex items-center justify-center text-[var(--text-muted)] hover:text-emerald-500 transition-all hover:scale-105 active:scale-95 shadow-lg"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          {user ? (
            <>
              {user.is_admin && (
                <Link to="/admin" className="text-[10px] font-black text-emerald-600 border border-emerald-500/30 px-4 py-2 rounded-xl hover:bg-emerald-500/10 transition-all uppercase tracking-widest hidden sm:block">
                  Admin Panel
                </Link>
              )}
              <div className="w-11 h-11 rounded-2xl bg-[var(--bg-card)]/50 border border-[var(--border-main)] flex items-center justify-center text-[var(--text-muted)] relative">
                <Bell size={20} />
                <span className="absolute top-3 right-3 w-2 h-2 bg-emerald-500 rounded-full border-2 border-[var(--bg-main)]"></span>
              </div>
              <Link to="/profile" className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 border border-white/10 flex items-center justify-center font-bold shadow-lg shadow-emerald-500/20 hover:scale-105 transition-all text-white font-['Outfit']">
                {user.username?.[0].toUpperCase()}
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-[10px] font-black text-[var(--text-muted)] hover:text-[var(--text-main)] transition-all uppercase tracking-widest px-4">Login</Link>
              <Link to="/register" className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-white font-black text-[10px] tracking-widest uppercase rounded-xl transition-all shadow-lg shadow-emerald-500/30 active:scale-95">Register</Link>
            </div>
          )}
        </motion.div>
      </header>

      <div className="flex flex-1 overflow-hidden z-10">
        {/* Left Sidebar */}
        {!hideSidebar && (
          <aside className="w-72 border-r border-[var(--border-main)] bg-[var(--bg-sidebar)]/30 backdrop-blur-md hidden lg:flex flex-col p-8">
            <div className="space-y-3 mb-12">
              <span className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em]">Learning Hub</span>
              <SidebarLink to="/" icon={<HomeIcon className="w-5 h-5" />} label="Dashboard" active={isActive('/')} />
              <SidebarLink to="/courses" icon={<Layers className="w-5 h-5" />} label="Roadmaps" active={isActive('/courses')} />
              <SidebarLink to="/library" icon={<BookOpen className="w-5 h-5" />} label="My Library" active={isActive('/library')} />
              <SidebarLink to="/lab" icon={<Microscope className="w-5 h-5" />} label="Practice Lab" active={isActive('/lab')} />
              <SidebarLink to="/mentors" icon={<Users className="w-5 h-5" />} label="Find Mentors" active={isActive('/mentors')} />
              <SidebarLink to="/profile" icon={<UserIcon className="w-5 h-5" />} label="My Profile" active={isActive('/profile')} />
            </div>

            <div className="mt-auto">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="glass-emerald p-6 rounded-[2rem] relative overflow-hidden group cursor-pointer"
              >
                <div className="absolute -top-12 -right-12 w-24 h-24 bg-emerald-500/10 blur-3xl rounded-full group-hover:scale-150 transition-transform duration-700"></div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                    <Sparkles size={14} className="text-emerald-500" />
                  </div>
                  <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">SkillForge Plus</p>
                </div>
                <p className="text-xs text-[var(--text-muted)] mb-5 leading-relaxed font-medium">Unlock faster learning paths and advanced progress tracking.</p>
                <button className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-white font-black text-[10px] rounded-xl transition-all shadow-lg shadow-emerald-500/30 active:scale-95 uppercase tracking-widest">
                  UPGRADE NOW
                </button>
              </motion.div>
              {user && (
                <button onClick={logout} className="w-full mt-8 flex items-center justify-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 text-gray-400 hover:text-red-500 transition-all font-black text-[10px] uppercase tracking-[0.2em] border border-transparent hover:border-red-500/20">
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              )}
            </div>
          </aside>
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-transparent scroll-smooth custom-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
}

function SidebarLink({ icon, label, active, to }: { icon: any, label: string, active: boolean, to: string }) {
  return (
    <Link 
      to={to} 
      className={`flex items-center gap-3 px-4 py-3 rounded-2xl cursor-pointer transition-all ${active ? 'bg-emerald-500/10 text-emerald-500 border-r-2 border-emerald-500 rounded-r-none' : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--border-main)]'}`}
    >
      {icon}
      <span className="font-bold text-sm tracking-tight">{label}</span>
    </Link>
  );
}
