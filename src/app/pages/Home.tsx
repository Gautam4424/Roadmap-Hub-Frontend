import { useState, useEffect } from 'react';
import {
  Map as MapIcon, TrendingUp, Play,
  Clock, Award, ChevronRight, Search
} from 'lucide-react';
import { motion } from 'framer-motion';
import { api } from '../utils/api';
import { MainLayout } from '../components/MainLayout';
import { Link } from 'react-router';

export function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [roadmaps, setRoadmaps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const rms = await api.getRoadmaps();
        setRoadmaps(rms);
      } catch (err) {
        console.error("Failed to load roadmaps", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredRoadmaps = roadmaps.filter(roadmap => {
    const matchesSearch = roadmap.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      roadmap.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const trendingRoadmaps = roadmaps.slice(0, 3); // Just for demonstration, take first 3 as trending

  return (
    <MainLayout>
      <div className="p-8 md:p-16 scroll-smooth custom-scrollbar">
        {/* Hero Section */}
        <div className="max-w-6xl mx-auto space-y-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative py-12"
          >
            <div className="space-y-8 relative z-10">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-3 bg-[var(--bg-card)]/50 border border-[var(--border-main)] px-5 py-2 rounded-full backdrop-blur-sm"
              >
                <TrendingUp size={16} className="text-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em]">Learning Hub</span>
              </motion.div>

              <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] text-[var(--text-main)]">
                Smart <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600">
                  Learning
                </span>
              </h1>

              <p className="text-2xl text-[var(--text-muted)] max-w-2xl font-medium leading-relaxed">
                The easy way for everyone to learn. Grow your skills with clear, step-by-step guides.
              </p>

              <motion.div
                whileFocus-within={{ scale: 1.02 }}
                className="relative max-w-3xl mt-12 transition-all"
              >
                <div className="absolute inset-0 bg-emerald-500/20 blur-3xl opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-800/40 w-6 h-6" />
                <input
                  type="text"
                  placeholder="Search for courses..."
                  className="w-full pl-16 pr-8 py-7 bg-[var(--bg-card)]/80 backdrop-blur-xl border border-[var(--border-main)] rounded-[2.5rem] focus:border-emerald-500 outline-none shadow-2xl transition-all text-xl text-[var(--text-main)] font-bold placeholder:text-gray-500 focus:ring-8 focus:ring-emerald-500/5 shadows-premium"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </motion.div>
            </div>

            {/* Decorative Element */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-emerald-500/10 to-transparent blur-3xl rounded-full -translate-y-1/2 pointer-events-none"></div>
          </motion.div>

          {/* Trending Section */}
          <div className="space-y-12">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-[2px] bg-gradient-to-r from-emerald-500 to-transparent"></div>
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em]">
                  Popular Roadmaps
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {loading ? (
                [1, 2, 3].map(i => (
                  <div key={i} className="h-80 bg-[var(--bg-card)]/30 rounded-[3rem] border border-[var(--border-main)] animate-pulse"></div>
                ))
              ) : (
                trendingRoadmaps.map(rm => (
                  <ModernRoadmapCard key={rm.id} roadmap={rm} />
                ))
              )}
            </div>
          </div>

          {/* Catalog Grid */}
          <div className="space-y-12">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-[2px] bg-gradient-to-r from-emerald-500 to-transparent"></div>
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em]">
                  Join a Course
                </h3>
              </div>
              <Link to="/courses" className="flex items-center gap-2 text-[10px] font-black text-emerald-600 uppercase tracking-widest cursor-pointer hover:underline underline-offset-4">
                View All Roadmaps <ChevronRight size={14} />
              </Link>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-80 bg-[var(--bg-card)]/30 rounded-[3rem] border border-[var(--border-main)] animate-pulse"></div>
                ))}
              </div>
            ) : (
              <motion.div
                initial="hidden"
                animate="show"
                variants={{
                  hidden: { opacity: 0 },
                  show: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.1
                    }
                  }
                }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
              >
                {filteredRoadmaps.map(rm => (
                  <ModernRoadmapCard key={rm.id} roadmap={rm} />
                ))}
              </motion.div>
            )}
          </div>
        </div>

        <footer className="mt-32 pt-16 border-t border-[var(--border-main)] flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">
          <div>© 2026 SkillForge • YOUR PERSONAL LEARNING PATH</div>
          <div className="flex gap-12">
            <Link to="#" className="hover:text-emerald-500 transition-colors">Help Center</Link>
            <Link to="#" className="hover:text-emerald-500 transition-colors">Contact Us</Link>
          </div>
        </footer>
      </div>
    </MainLayout>
  );
}

function ModernRoadmapCard({ roadmap }: { roadmap: any }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, scale: 0.9 },
        show: { opacity: 1, scale: 1 }
      }}
      whileHover={{ y: -10, transition: { duration: 0.3 } }}
    >
      <Link to={`/roadmaps/${roadmap.slug}`} className="group relative block h-full">
        <div className="glass hover:bg-[var(--bg-card)] transition-all p-10 rounded-[3rem] border border-[var(--border-main)] hover:border-cyan-500/40 overflow-hidden h-full flex flex-col items-start gap-8 relative bg-[var(--bg-card)]/40">
          {/* Animated Glow Border */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>

          <div className="w-full flex justify-between items-start relative z-10">
            <div className="w-16 h-16 rounded-[1.5rem] bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-2xl shadow-cyan-500/40 transition-transform duration-700 group-hover:rotate-[360deg]">
              <MapIcon className="w-8 h-8 text-white" />
            </div>
            <div className="px-4 py-1.5 rounded-full bg-[var(--bg-main)]/50 border border-[var(--border-main)] text-[8px] font-black text-cyan-400 uppercase tracking-[0.3em] backdrop-blur-sm">
              Topic #{roadmap.id.substring(0, 2).toUpperCase()}
            </div>
          </div>

          <div className="space-y-4 relative z-10">
            <h3 className="text-3xl font-black text-[var(--text-main)] group-hover:text-cyan-400 transition-colors leading-[1.1] tracking-tighter">
              {roadmap.title}
            </h3>
            <p className="text-sm text-[var(--text-muted)] font-bold line-clamp-3 leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">
              {roadmap.description || "Clear steps to help you master this topic from scratch."}
            </p>
          </div>

          <div className="mt-auto w-full pt-8 border-t border-[var(--border-main)] flex items-center justify-between relative z-10">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                <Clock className="w-4 h-4 text-cyan-500/70" /> {roadmap.estimated_hours}H
              </div>
              <div className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                <Award className="w-4 h-4 text-emerald-500/70" /> VERIFIED
              </div>
            </div>
            <div className="w-12 h-12 rounded-full border border-[var(--border-main)] flex items-center justify-center group-hover:bg-cyan-500 group-hover:border-cyan-500 transition-all group-hover:shadow-[0_0_20px_rgba(6,182,212,0.5)]">
              <Play className="w-4 h-4 text-[var(--text-muted)] group-hover:text-white fill-current translate-x-0.5" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
