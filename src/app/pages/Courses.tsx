import { useState, useEffect } from 'react';
import {
  Map as MapIcon, Play,
  Clock, Award, Search, Layers, Plus, Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';
import { api } from '../utils/api';
import { MainLayout } from '../components/MainLayout';
import { Link } from 'react-router';
export function Courses() {
  const [searchQuery, setSearchQuery] = useState('');
  const [roadmaps, setRoadmaps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const rms = await api.getRoadmaps();
      setRoadmaps(rms);
    } catch (err) {
      console.error("Failed to load roadmaps", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredRoadmaps = roadmaps.filter(roadmap => {
    const matchesSearch = 
      (roadmap.title?.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (roadmap.description?.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  });

  return (
    <MainLayout>
      <div className="p-8 md:p-16">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-3 bg-[var(--bg-card)]/50 border border-[var(--border-main)] px-5 py-2 rounded-full backdrop-blur-sm">
                <Layers size={16} className="text-emerald-500" />
                <span className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em]">Roadmap Catalog</span>
              </div>
              <h1 className="text-5xl font-black tracking-tighter text-[var(--text-main)]">Skill Roadmaps</h1>
              <p className="text-xl text-[var(--text-muted)] max-w-2xl font-medium">Explore every step-by-step roadmap available in our library.</p>
            </div>
          </div>

          <div className="relative max-w-2xl">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-800/40 w-5 h-5" />
            <input
              type="text"
              placeholder="Filter roadmaps..."
              className="w-full pl-14 pr-6 py-4 bg-[var(--bg-card)]/80 backdrop-blur-xl border border-[var(--border-main)] rounded-2xl focus:border-emerald-500 outline-none transition-all text-lg text-[var(--text-main)] font-bold placeholder:text-gray-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-80 bg-[var(--bg-card)]/30 rounded-[3rem] border border-[var(--border-main)] animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="space-y-16">
              {Object.entries(
                filteredRoadmaps.reduce((acc: any, rm) => {
                  const cat = rm.category_name || 'General';
                  if (!acc[cat]) acc[cat] = [];
                  acc[cat].push(rm);
                  return acc;
                }, {})
              ).map(([category, items]: [string, any]) => (
                <div key={category} className="space-y-8">
                  <div className="flex items-center gap-4">
                    <div className="h-px flex-1 bg-gradient-to-r from-emerald-500/50 to-transparent"></div>
                    <h2 className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.4em] px-4">{category}</h2>
                    <div className="h-px flex-1 bg-gradient-to-l from-emerald-500/50 to-transparent"></div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {items.map((rm: any) => (
                      <ModernRoadmapCard key={rm.id} roadmap={rm} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

function ModernRoadmapCard({ roadmap }: { roadmap: any }) {
  return (
    <motion.div
      whileHover={{ y: -10, transition: { duration: 0.3 } }}
    >
      <Link to={`/roadmaps/${roadmap.slug}`} className="group relative block h-full">
        <div className="glass hover:bg-[var(--bg-card)] transition-all p-10 rounded-[3rem] border border-[var(--border-main)] hover:border-cyan-500/40 overflow-hidden h-full flex flex-col items-start gap-8 relative bg-[var(--bg-card)]/40">
          <div className="w-full flex justify-between items-start relative z-10">
            <div className={`w-16 h-16 rounded-[1.5rem] bg-gradient-to-br flex items-center justify-center shadow-2xl transition-transform duration-700 group-hover:rotate-[360deg] ${
              roadmap.is_verified ? 'from-cyan-500 to-blue-600 shadow-cyan-500/40' : 'from-amber-500 to-orange-600 shadow-amber-500/40'
            }`}>
              {roadmap.is_verified ? <MapIcon className="w-8 h-8 text-white" /> : <Sparkles className="w-8 h-8 text-white" />}
            </div>
            <div className="px-4 py-1.5 rounded-full bg-[var(--bg-main)]/50 border border-[var(--border-main)] text-[8px] font-black text-cyan-400 uppercase tracking-[0.3em] backdrop-blur-sm">
              #{roadmap.id.substring(0, 4).toUpperCase()}
            </div>
          </div>

          <div className="space-y-4 relative z-10">
            <h3 className="text-3xl font-black text-[var(--text-main)] group-hover:text-cyan-400 transition-colors leading-[1.1] tracking-tighter">
              {roadmap.title}
            </h3>
            <p className="text-sm text-[var(--text-muted)] font-bold line-clamp-3 leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">
              {roadmap.description || "Simple steps to help you learn this topic from scratch."}
            </p>
          </div>

          <div className="mt-auto w-full pt-8 border-t border-[var(--border-main)] flex items-center justify-between relative z-10">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                <Clock className="w-4 h-4 text-cyan-500/70" /> {roadmap.estimated_hours}H
              </div>
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-500">
                <Award className="w-4 h-4" />
                OFFICIAL
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
