import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router';
import {
   Award, BookOpen, Clock, TrendingUp, User,
   LogOut, Layers, Microscope, Shield, Play, Zap, Activity, Mail
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import { MainLayout } from '../components/MainLayout';

export function Profile() {
   const { user, logout: authLogout } = useAuth();
   const navigate = useNavigate();

   const [roadmaps, setRoadmaps] = useState<any[]>([]);
   const [roadmapStats, setRoadmapStats] = useState<any[]>([]);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      async function fetchAllData() {
         if (!user) return;
         try {
            setLoading(true);
            const [enrolledIds, allRms] = await Promise.all([
               api.getEnrolled(),
               api.getRoadmaps()
            ]);
            
            const enrolledRms = allRms.filter((rm: any) => enrolledIds.includes(rm.id));
            setRoadmaps(enrolledRms);

            const statsPromises = enrolledRms.map(async (roadmap: any) => {
               try {
                  const pMap = await api.getProgress(roadmap.id);
                  const completedCount = Object.keys(pMap).filter(k => pMap[k]).length;
                  const totalNodes = roadmap.total_nodes || (roadmap.nodes?.length || 1);
                  const progressPercent = (completedCount / totalNodes) * 100;
                  return {
                     roadmap,
                     progress: progressPercent,
                     completed: completedCount,
                     total: totalNodes
                  };
               } catch (e) {
                  return { roadmap, progress: 0, completed: 0, total: roadmap.total_nodes || 0 };
               }
            });

            const stats = await Promise.all(statsPromises);
            setRoadmapStats(stats);
         } catch (e) {
            console.error("Error fetching profile data", e);
         } finally {
            setLoading(false);
         }
      }
      fetchAllData();
   }, [user]);

   const logout = () => { authLogout(); navigate('/login'); };

   const { allTopicIds, completedCount, totalProgress, totalHoursCompleted, inProgressRoadmaps } = useMemo(() => {
      const total = roadmapStats.reduce((acc, curr) => acc + curr.total, 0);
      const completed = roadmapStats.reduce((acc, curr) => acc + curr.completed, 0);
      const progress = total > 0 ? (completed / total) * 100 : 0;
      const inProgress = roadmapStats.filter(stat => stat.progress > 0);
      const hours = roadmapStats.reduce((acc, stat) => {
         const p = stat.progress / 100;
         return acc + Math.round((stat.roadmap.estimated_hours || 0) * p);
      }, 0);

      return {
         allTopicIds: total,
         completedCount: completed,
         totalProgress: progress,
         totalHoursCompleted: hours,
         inProgressRoadmaps: inProgress
      };
   }, [roadmapStats]);

   if (!user) {
      return (
         <MainLayout hideSidebar>
            <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-center">
               <div className="w-24 h-24 rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-center mb-8 shadow-2xl text-gray-700 relative z-10">
                  <Shield size={48} className="animate-pulse" />
               </div>
               <h1 className="text-4xl font-black text-white mb-4 tracking-tighter uppercase">Access Denied</h1>
               <p className="text-lg text-gray-500 max-w-lg leading-relaxed font-medium mb-12">Please sign in to view your learning progress and joined courses.</p>
               <Link to="/login" className="px-10 py-5 bg-cyan-500 hover:bg-cyan-400 text-[#0b1120] font-black rounded-2xl transition-all shadow-2xl shadow-cyan-500/30 uppercase tracking-[0.3em] text-[10px] active:scale-95">
                  Sign In Now
               </Link>
            </div>
         </MainLayout>
      );
   }

   return (
      <MainLayout>
         <div className="p-8 md:p-16 lg:p-24 scroll-smooth custom-scrollbar">
            <div className="max-w-5xl mx-auto space-y-24">
                {/* User Profile Header */}
               <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col md:flex-row items-center gap-12"
               >
                  <div className="relative group">
                     <div className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full scale-110 group-hover:scale-125 transition-transform duration-700"></div>
                     <div className="w-40 h-40 rounded-[3.5rem] bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 border border-white/20 flex items-center justify-center shadow-[0_30px_60px_rgba(16,185,129,0.3)] relative z-10 transition-transform duration-700 group-hover:rotate-6">
                        <User className="w-20 h-20 text-white" />
                     </div>
                     <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-emerald-500 rounded-2xl border-4 border-[var(--bg-main)] flex items-center justify-center z-20 shadow-xl">
                        <Zap className="w-6 h-6 text-white" />
                     </div>
                  </div>

                  <div className="text-center md:text-left space-y-4">
                     <div className="flex items-center gap-4 justify-center md:justify-start">
                        <h1 className="text-6xl font-black text-[var(--text-main)] tracking-tighter leading-none">{user.username}</h1>
                        {user.is_admin && (
                           <div className="inline-flex items-center gap-2 text-[10px] font-black text-emerald-600 bg-emerald-500/10 px-4 py-1.5 rounded-full uppercase tracking-[0.3em] border border-emerald-500/20">
                              <Shield size={12} /> ADMIN
                           </div>
                        )}
                     </div>
                     <div className="flex items-center gap-6 justify-center md:justify-start text-[var(--text-muted)]">
                        <div className="flex items-center gap-2">
                           <Mail className="w-4 h-4 text-emerald-500" />
                           <span className="text-xl font-light tracking-wide">{user.email}</span>
                        </div>
                        <div className="h-4 w-[1px] bg-[var(--border-main)]"></div>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 italic">Status: Active</span>
                     </div>
                  </div>
               </motion.div>

               {/* Statistics Overview */}
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                   <StatCard
                     icon={<BookOpen className="text-emerald-500" />}
                     label="Topics Finished"
                     value={completedCount}
                     sub={`of ${allTopicIds} total`}
                     index={0}
                  />
                  <StatCard
                     icon={<Clock className="text-teal-500" />}
                     label="Time Spent"
                     value={`${totalHoursCompleted}H`}
                     sub="estimated hours"
                     index={1}
                  />
                  <StatCard
                     icon={<Award className="text-amber-500" />}
                     label="Active Paths"
                     value={inProgressRoadmaps.length}
                     sub={`out of ${roadmaps.length}`}
                     index={2}
                  />
                  <StatCard
                     icon={<TrendingUp className="text-emerald-500" />}
                     label="Overall Progress"
                     value={`${Math.round(totalProgress)}%`}
                     isProgress
                     index={3}
                  />
               </div>

               {/* My Learning Paths Grid */}
               <div className="space-y-12">
                  <div className="flex items-center justify-between">
                     <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] flex items-center gap-4">
                        <div className="w-8 h-[2px] bg-[var(--border-main)]"></div>
                        My Learning Paths
                     </h3>
                     <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{inProgressRoadmaps.length} COURSES IN PROGRESS</span>
                  </div>

                  {loading ? (
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {[1, 2, 3, 4].map(i => <div key={i} className="h-48 bg-[var(--bg-card)]/40 rounded-[2.5rem] border border-[var(--border-main)] animate-pulse"></div>)}
                     </div>
                  ) : inProgressRoadmaps.length === 0 ? (
                     <div className="glass p-20 rounded-[3rem] text-center border border-[var(--border-main)] space-y-8">
                        <div className="w-20 h-20 rounded-full bg-[var(--bg-card)]/40 mx-auto flex items-center justify-center text-gray-400">
                           <Layers size={40} />
                        </div>
                        <div className="space-y-4">
                           <h4 className="text-2xl font-black text-[var(--text-main)] tracking-tighter uppercase">No Courses Joined Yet</h4>
                           <p className="text-[var(--text-muted)] font-medium max-w-md mx-auto">You haven't joined any learning paths yet. Explore the catalog to find your first topic.</p>
                        </div>
                        <Link to="/courses" className="inline-flex items-center gap-3 px-10 py-5 bg-[var(--bg-card)]/40 hover:bg-emerald-500/10 text-emerald-600 rounded-2xl font-black transition-all border border-[var(--border-main)] uppercase tracking-[0.3em] text-[10px]">
                           Browse All Courses <ChevronRight size={14} />
                        </Link>
                     </div>
                  ) : (
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {inProgressRoadmaps.map(({ roadmap, progress, completed, total }, i) => (
                           <motion.div
                              key={roadmap.id}
                              initial={{ opacity: 0, y: 30 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.1 * i }}
                           >
                              <Link to={`/roadmaps/${roadmap.slug}`} className="group relative block h-full">
                                 <div className="glass h-full p-10 rounded-[3rem] border border-[var(--border-main)] hover:border-emerald-500/40 transition-all group-hover:-translate-y-3 group-hover:shadow-[0_40px_80px_rgba(0,0,0,0.4)] relative bg-[var(--bg-card)]/40 overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                    <div className="flex justify-between items-start mb-8">
                                       <div className="space-y-2">
                                          <div className="text-[9px] font-black text-emerald-600 uppercase tracking-widest font-mono">TOPIC {roadmap.slug.toUpperCase()}</div>
                                          <h4 className="text-3xl font-black text-[var(--text-main)] group-hover:text-emerald-600 transition-colors tracking-tighter leading-tight">{roadmap.title}</h4>
                                       </div>
                                       <div className="w-12 h-12 rounded-2xl bg-[var(--bg-main)] flex items-center justify-center text-gray-400 group-hover:bg-emerald-500 group-hover:text-white transition-all shadow-xl">
                                          <Play size={20} className="fill-current" />
                                       </div>
                                    </div>

                                    <div className="mt-auto space-y-6">
                                       <div className="flex justify-between items-end">
                                          <div className="space-y-1">
                                             <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Learning Stats</p>
                                             <p className="text-xl font-black text-[var(--text-main)]">{completed} <span className="text-[var(--text-muted)] text-sm">/ {total} TOPICS</span></p>
                                          </div>
                                          <div className="text-right">
                                             <p className="text-3xl font-black text-emerald-600 leading-none">{Math.round(progress)}%</p>
                                          </div>
                                       </div>
                                       <div className="h-3 w-full bg-[var(--bg-main)]/40 rounded-full overflow-hidden border border-[var(--border-main)] p-[2px]">
                                          <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(16,185,129,0.3)]" style={{ width: `${progress}%` }}></div>
                                       </div>
                                    </div>
                                 </div>
                              </Link>
                           </motion.div>
                        ))}
                     </div>
                  )}
               </div>
            </div>
         </div>
      </MainLayout>
   );
}

function StatCard({ icon, label, value, sub, isProgress, index }: { icon: any, label: string, value: string | number, sub?: string, isProgress?: boolean, index: number }) {
   return (
      <motion.div
         initial={{ opacity: 0, scale: 0.9 }}
         animate={{ opacity: 1, scale: 1 }}
         transition={{ delay: 0.1 * index }}
         className="glass p-10 rounded-[3rem] border border-[var(--border-main)] space-y-8 group hover:bg-[var(--bg-card)]/60 transition-all duration-500 relative overflow-hidden bg-[var(--bg-card)]/40"
      >
         <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
         <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-cyan-500/10 transition-all shadow-xl">
            <div className="group-hover:scale-110 transition-transform">{icon}</div>
         </div>
         <div className="space-y-2">
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-2">{label}</p>
            <div className="flex items-baseline gap-2">
               <p className="text-5xl font-black text-white tracking-tighter">{value}</p>
               {isProgress && <span className="text-cyan-400 text-xs font-black animate-pulse">LIVE</span>}
            </div>
            {sub && <p className="text-[10px] text-gray-700 font-extrabold uppercase tracking-widest">{sub}</p>}
         </div>
      </motion.div>
   );
}

function ChevronRight({ size }: { size: number }) {
    return <Activity size={size} />; // Placeholder as it was not imported
}
