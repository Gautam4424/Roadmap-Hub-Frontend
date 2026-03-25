import { useState, useEffect } from 'react';
import {
  Map as MapIcon, Play,
  Clock, Award, BookOpen, Layers
} from 'lucide-react';
import { motion } from 'framer-motion';
import { api } from '../utils/api';
import { MainLayout } from '../components/MainLayout';
import { Link } from 'react-router';
import { useAuth } from '../context/AuthContext';

export function Library() {
  const { user } = useAuth();
  const [roadmaps, setRoadmaps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!user) return;
      try {
        setLoading(true);
        const [enrolledIds, allRms] = await Promise.all([
          api.getEnrolled(),
          api.getRoadmaps()
        ]);
        const enrolledRms = allRms.filter((rm: any) => enrolledIds.includes(rm.id));
        setRoadmaps(enrolledRms);
      } catch (err) {
        console.error("Failed to load library roadmaps", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user]);

  if (!user) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center p-20 min-h-[50vh]">
          <h2 className="text-3xl font-black text-red-500 uppercase tracking-tighter mb-4">Login Required</h2>
          <p className="text-gray-500 mb-8 font-medium">Please sign in to access your saved courses.</p>
          <Link to="/login" className="px-10 py-4 bg-emerald-500 text-white font-black rounded-xl hover:bg-emerald-400 transition-all uppercase text-[10px] tracking-widest shadow-lg shadow-emerald-500/30">Sign In</Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="p-8 md:p-16">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-3 bg-[var(--bg-card)]/50 border border-[var(--border-main)] px-5 py-2 rounded-full backdrop-blur-sm">
              <BookOpen size={16} className="text-emerald-500" />
              <span className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em]">Your Saved Courses</span>
            </div>
            <h1 className="text-5xl font-black tracking-tighter text-[var(--text-main)]">My Library</h1>
            <p className="text-xl text-[var(--text-muted)] max-w-2xl font-medium">Continue where you left off with your joined courses.</p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-80 bg-[var(--bg-card)]/30 rounded-[3rem] border border-[var(--border-main)] animate-pulse"></div>
              ))}
            </div>
          ) : roadmaps.length === 0 ? (
            <div className="glass p-20 rounded-[4rem] text-center border border-[var(--border-main)] bg-[var(--bg-card)]/30 backdrop-blur-xl">
              <div className="w-24 h-24 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-8 text-emerald-500">
                <Layers size={48} />
              </div>
              <h3 className="text-3xl font-black text-[var(--text-main)] mb-4 tracking-tighter uppercase">No Courses Joined</h3>
              <p className="text-lg text-[var(--text-muted)] max-w-md mx-auto mb-12 font-medium">You haven't joined any courses yet. Explore the catalog to find your next topic.</p>
              <Link to="/courses" className="px-12 py-5 bg-emerald-500 hover:bg-emerald-400 text-white font-black rounded-2xl transition-all shadow-xl shadow-emerald-500/20 uppercase tracking-[0.3em] text-[10px] active:scale-95">
                Browse Courses
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {roadmaps.map(rm => (
                <LibraryRoadmapCard key={rm.id} roadmap={rm} />
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

function LibraryRoadmapCard({ roadmap }: { roadmap: any }) {
  return (
    <motion.div
      whileHover={{ y: -10, transition: { duration: 0.3 } }}
    >
      <Link to={`/roadmaps/${roadmap.slug}`} className="group relative block h-full">
        <div className="glass hover:bg-[var(--bg-card)] transition-all p-10 rounded-[3rem] border border-[var(--border-main)] hover:border-cyan-500/40 overflow-hidden h-full flex flex-col items-start gap-8 relative bg-[var(--bg-card)]/40">
          <div className="w-full flex justify-between items-start relative z-10">
            <div className="w-16 h-16 rounded-[1.5rem] bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-indigo-500/40 transition-transform duration-700 group-hover:rotate-[360deg]">
              <MapIcon className="w-8 h-8 text-white" />
            </div>
            <div className="px-4 py-1.5 rounded-full bg-[var(--bg-main)]/50 border border-[var(--border-main)] text-[8px] font-black text-indigo-400 uppercase tracking-[0.3em] backdrop-blur-sm">
              Topic #{roadmap.id.substring(0, 2).toUpperCase()}
            </div>
          </div>

          <div className="space-y-4 relative z-10">
            <h3 className="text-3xl font-black text-[var(--text-main)] group-hover:text-indigo-400 transition-colors leading-[1.1] tracking-tighter">
              {roadmap.title}
            </h3>
            <p className="text-sm text-[var(--text-muted)] font-bold line-clamp-3 leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">
              {roadmap.description || "Clear steps to help you learn this topic step-by-step."}
            </p>
          </div>

          <div className="mt-auto w-full pt-8 border-t border-[var(--border-main)] flex items-center justify-between relative z-10">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                <Clock className="w-4 h-4 text-indigo-500/70" /> {roadmap.estimated_hours}H
              </div>
              <div className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                <Award className="w-4 h-4 text-emerald-500/70" /> VERIFIED
              </div>
            </div>
            <div className="w-12 h-12 rounded-full border border-[var(--border-main)] flex items-center justify-center group-hover:bg-indigo-500 group-hover:border-indigo-500 transition-all group-hover:shadow-[0_0_20px_rgba(99,102,241,0.5)]">
              <Play className="w-4 h-4 text-[var(--text-muted)] group-hover:text-white fill-current translate-x-0.5" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
