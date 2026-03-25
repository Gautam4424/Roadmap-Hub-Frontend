import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { ArrowLeft, Shield, User, Mail, Lock, XCircle, ChevronRight, UserPlus, Activity, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { register } from '../utils/authStorage';
import { useAuth } from '../context/AuthContext';

export function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const auth = useAuth();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!username || !email || !password) {
      setError('Please fill in all fields to create your account.');
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      setLoading(false);
      return;
    }

    try {
      const newUser = await register(username, email, password);
      if (newUser) {
        auth.login(newUser);
        navigate('/');
      } else {
        setError('Registration failed. This email might already be in use.');
      }
    } catch (err) {
      setError('Could not connect to server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] flex flex-col font-['Outfit'] relative overflow-hidden transition-colors duration-500">
      {/* Dynamic Background Mesh - Lush theme */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-emerald-500/10 blur-[180px] rounded-full animate-float"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-amber-500/5 blur-[180px] rounded-full animate-float" style={{ animationDelay: '-4s' }}></div>
      </div>

      {/* Header HUD */}
      <header className="h-20 border-b border-[var(--border-main)] bg-[var(--bg-main)]/40 backdrop-blur-xl sticky top-0 z-50 px-12 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-4 text-gray-500 hover:text-emerald-500 transition-all group">
          <div className="w-10 h-10 rounded-xl bg-[var(--bg-card)] border border-[var(--border-main)] flex items-center justify-center group-hover:bg-emerald-500/10 transition-all">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.3em] font-mono">Back to Home</span>
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Sign Up Ready</span>
        </div>
      </header>

      {/* Enrollment Portal */}
      <main className="flex-1 flex items-center justify-center p-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", damping: 20 }}
          className="w-full max-w-[540px]"
        >
          <div className="glass p-12 rounded-[3.5rem] border border-[var(--border-main)] shadow-[0_0_50px_rgba(16,185,129,0.05)] space-y-10 relative overflow-hidden group">
            {/* Glossy inner shine */}
            <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent"></div>

            <div className="flex flex-col items-center text-center space-y-6">
              <div className="relative">
                <div className="absolute inset-0 bg-emerald-500/20 blur-2xl rounded-full"></div>
                <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-2xl relative z-10 border border-white/10 group-hover:scale-105 transition-transform duration-500">
                  <UserPlus className="w-12 h-12 text-white" />
                </div>
              </div>
              <div className="space-y-3">
                <h1 className="text-4xl font-black text-[var(--text-main)] tracking-tighter uppercase leading-none">Sign Up</h1>
                <p className="text-sm text-[var(--text-muted)] font-medium px-8">Join SkillForge to start your learning journey and track your progress.</p>
              </div>
            </div>

            <form onSubmit={handleRegister} className="grid grid-cols-1 gap-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] ml-2">Username</label>
                <div className="relative group/input">
                  <User className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within/input:text-emerald-500 transition-colors" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="your_username"
                    className="w-full pl-16 pr-8 py-5 bg-[var(--bg-main)] border border-[var(--border-main)] rounded-[1.5rem] outline-none focus:border-emerald-500/50 focus:bg-[var(--bg-card)] transition-all font-bold text-xl text-[var(--text-main)] placeholder:text-gray-300"
                    required
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] ml-2">Email Address</label>
                <div className="relative group/input">
                  <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within/input:text-emerald-500 transition-colors" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full pl-16 pr-8 py-5 bg-[var(--bg-main)] border border-[var(--border-main)] rounded-[1.5rem] outline-none focus:border-emerald-500/50 focus:bg-[var(--bg-card)] transition-all font-bold text-xl text-[var(--text-main)] placeholder:text-gray-300"
                    required
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] ml-2">Password</label>
                <div className="relative group/input">
                  <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within/input:text-emerald-500 transition-colors" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-16 pr-8 py-5 bg-[var(--bg-main)] border border-[var(--border-main)] rounded-[1.5rem] outline-none focus:border-emerald-500/50 focus:bg-[var(--bg-card)] transition-all font-bold text-xl text-[var(--text-main)] placeholder:text-gray-300"
                    required
                  />
                </div>
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="bg-red-500/10 border border-red-500/20 text-red-500 p-5 rounded-2xl flex items-center gap-4 text-xs font-black tracking-widest uppercase animate-pulse"
                  >
                    <XCircle className="w-5 h-5 flex-shrink-0" /> {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-6 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black text-[10px] tracking-[0.4em] rounded-[1.5rem] transition-all shadow-[0_20px_40px_rgba(16,185,129,0.25)] flex items-center justify-center gap-4 active:scale-95 uppercase ${loading ? 'opacity-70 cursor-not-allowed grayscale' : ''}`}
              >
                {loading ? (
                  <Activity className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <UserPlus className="w-5 h-5" />
                    <span>Create Account</span>
                  </>
                )}
              </button>
            </form>

            <div className="pt-8 border-t border-[var(--border-main)] flex flex-col items-center gap-4">
              <p className="text-gray-400 text-xs font-medium uppercase tracking-widest">
                Already have an account?
              </p>
              <Link to="/login" className="group flex items-center gap-3 px-8 py-3 rounded-2xl bg-[var(--bg-card)]/50 border border-[var(--border-main)] text-emerald-600 hover:bg-emerald-500/5 transition-all">
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Sign In Here</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          <div className="mt-12 text-center flex items-center justify-center gap-3">
            <Globe className="w-4 h-4 text-gray-400" />
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.5em]">Secure Registration System</p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
