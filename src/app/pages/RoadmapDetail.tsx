import { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import {
  Plus, ChevronRight, CheckCircle2,
  Circle, Trash2, ArrowLeft,
  BookOpen, Sparkles, Zap, TrendingUp,
  Share2, Save, Cpu, Globe, Activity, Layers, X, Shield, Map as MapIcon, Play, Clock, Award, RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import TopicNode from '../components/TopicNode';
import { MainLayout } from '../components/MainLayout';

export function RoadmapDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [roadmap, setRoadmap] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'content' | 'graph'>('content');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTopic, setNewTopic] = useState({ title: '', description: '' });
  const [isAddingSubTopic, setIsAddingSubTopic] = useState<string | null>(null);
  const [progressMap, setProgressMap] = useState<Record<string, boolean>>({});
  const [isEnrolled, setIsEnrolled] = useState<boolean>(false);
  const [isEnrolling, setIsEnrolling] = useState<boolean>(false);

  useEffect(() => {
    fetchRoadmap();
  }, [id]);

  const fetchRoadmap = async () => {
    try {
      setLoading(true);
      const data = await api.getRoadmap(id!);
      
      // Fetch custom elements associated with this roadmap
      let customNodes = [];
      try {
        customNodes = await api.getCustomNodes(data.id);
      } catch (err) {
        console.warn("Could not fetch custom segments:", err);
      }

      // Merge and categorize nodes
      const finalNodes = [...(data.nodes || [])];
      
      customNodes.forEach((node: any) => {
        const enrichedNode = { ...node, is_custom: true };
        if (node.parent_node_id) {
          // Look for parent in base nodes
          const parent = finalNodes.find(n => n.id === node.parent_node_id);
          if (parent) {
            if (!parent.subtopics) parent.subtopics = [];
            // Avoid duplicate additions
            if (!parent.subtopics.find((s: any) => s.id === node.id)) {
              parent.subtopics.push(enrichedNode);
            }
          }
        } else {
          // It's a top-level custom node
          if (!finalNodes.find(n => n.id === node.id)) {
            finalNodes.push(enrichedNode);
          }
        }
      });

      data.nodes = finalNodes;
      setRoadmap(data);

      // Initialize progress (mock for now, but covering all nodes)
      const initialProgress: Record<string, boolean> = {};
      data.nodes?.forEach((node: any) => {
        initialProgress[node.id] = false;
        node.subtopics?.forEach((sub: any) => {
          initialProgress[sub.id] = false;
        });
      });
      setProgressMap(initialProgress);

      // Check enrollment status
      if (user) {
        const { enrolled } = await api.isEnrolled(data.id);
        setIsEnrolled(enrolled);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load the learning plan.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleProgress = (nodeId: string) => {
    setProgressMap(prev => ({ ...prev, [nodeId]: !prev[nodeId] }));
  };

  const handleEnroll = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      setIsEnrolling(true);
      await api.enroll(roadmap.id);
      setIsEnrolled(true);
      fetchRoadmap(); // Refresh stats/data if needed
    } catch (err: any) {
      console.error("Enrollment error:", err);
    } finally {
      setIsEnrolling(false);
    }
  };

  const handleAddCustomTopic = async () => {
    if (!newTopic.title.trim()) return;
    try {
      const payload = {
        roadmap_id: roadmap.id,
        parent_node_id: isAddingSubTopic,
        title: newTopic.title,
        description: newTopic.description,
        sort_order: isAddingSubTopic ? 0 : (roadmap.nodes?.length || 0) + 1
      };

      await api.createCustomNode(payload);
      setNewTopic({ title: '', description: '' });
      setShowAddModal(false);
      setIsAddingSubTopic(null);
      fetchRoadmap();
    } catch (err) {
      console.error('Failed to inject node:', err);
    }
  };

  const handleDeleteCustomTopic = async (nodeId: string) => {
    try {
      await api.deleteCustomNode(nodeId);
      fetchRoadmap();
    } catch (err) {
      console.error('Failed to purge node:', err);
    }
  };

  const totalPossible = useMemo(() => {
    if (!roadmap) return 0;
    let count = 0;
    roadmap.nodes?.forEach((node: any) => {
      count++;
      count += (node.subtopics?.length || 0);
    });
    return count;
  }, [roadmap]);

  const totalCompleted = useMemo(() => {
    return Object.values(progressMap).filter(v => v).length;
  }, [progressMap]);

  const progressPercent = totalPossible > 0 ? (totalCompleted / totalPossible) * 100 : 0;

  if (loading) return (
    <div className="min-h-screen bg-[var(--bg-main)] flex flex-col items-center justify-center space-y-8">
      <div className="relative w-24 h-24">
        <div className="absolute inset-0 border-4 border-cyan-500/20 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-t-cyan-500 rounded-full animate-spin"></div>
      </div>
      <div className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.4em] animate-pulse">Loading Roadmap...</div>
    </div>
  );

  if (error || !roadmap) return (
    <div className="min-h-screen bg-[var(--bg-main)] flex flex-col items-center justify-center p-8 text-center">
      <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mb-6">
        <X className="w-10 h-10 text-red-500" />
      </div>
      <h2 className="text-4xl font-black text-white mb-2 tracking-tighter uppercase">Error Loading Roadmap</h2>
      <p className="text-gray-500 max-w-sm font-medium mb-8">{error || 'Roadmap data not found.'}</p>
      <Link to="/" className="px-8 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-black text-[10px] tracking-widest uppercase hover:bg-white/10 transition-all">Back to Dashboard</Link>
    </div>
  );

  return (
    <MainLayout
      headerExtra={
        <div className="flex items-center gap-4 mr-4">
          <button className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-[var(--bg-card)]/50 border border-[var(--border-main)] rounded-xl text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest hover:text-[var(--text-main)] transition-all">
            <Share2 size={16} /> Share
          </button>
          <button className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black text-[10px] tracking-widest uppercase rounded-xl transition-all shadow-lg shadow-emerald-500/30 active:scale-95 flex items-center gap-2">
            <Save size={16} /> Sync Progress
          </button>
        </div>
      }
      hideSidebar
    >
      <div className="flex flex-1 overflow-hidden z-10 h-full">
        {/* Detail Sidebar */}
        <aside className="w-80 border-r border-[var(--border-main)] bg-[var(--bg-sidebar)]/30 backdrop-blur-md hidden xl:flex flex-col p-8 overflow-y-auto custom-scrollbar">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center text-center space-y-6 mb-12"
          >
            <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-2xl shadow-emerald-500/20 mb-2">
              <Zap className="w-12 h-12 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tighter mb-2">{roadmap.title}</h2>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border bg-emerald-500/10 border-emerald-500/20 text-emerald-600 text-[9px] font-black uppercase tracking-widest shadow-sm">
                Official Roadmap
              </div>
            </div>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed font-medium">
              {roadmap.description || "A complete guide to help you master this topic step-by-step."}
            </p>
          </motion.div>

          <div className="space-y-6">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-4">Roadmap Stats</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-[var(--bg-card)]/50 border border-[var(--border-main)] space-y-1">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Estimated</p>
                <p className="text-lg font-black text-emerald-600">{roadmap.estimated_hours} Hours</p>
              </div>
              <div className="p-4 rounded-2xl bg-[var(--bg-card)]/50 border border-[var(--border-main)] space-y-1">
                <p className="text-lg font-black text-teal-600">98%</p>
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Roadmap Quality</p>
              </div>
            </div>

            <div className="p-6 rounded-[2rem] border border-[var(--border-main)] bg-[var(--bg-card)]/30 relative overflow-hidden group">
              <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Shield className="w-3 h-3" /> Roadmap Progress
              </p>

              <div className="relative w-32 h-32 mx-auto mb-4">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-emerald-500/5" />
                  <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent"
                    strokeDasharray={364.4}
                    strokeDashoffset={364.4 - (364.4 * progressPercent) / 100}
                    className="text-emerald-500 transition-all duration-1000 ease-out"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-black text-[var(--text-main)] leading-none">{Math.round(progressPercent)}%</span>
                  <span className="text-[8px] font-black text-gray-400 uppercase mt-1 tracking-tighter">Done</span>
                </div>
              </div>

              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-400">
                <span>{totalCompleted} DONE</span>
                <span>{totalPossible - totalCompleted} LEFT</span>
              </div>
            </div>

            <button
              onClick={() => { setIsAddingSubTopic(null); setShowAddModal(true); }}
              className="w-full mt-4 flex items-center justify-between px-6 py-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 font-black text-[10px] uppercase tracking-widest hover:bg-emerald-500/20 transition-all"
            >
              Add Topic <Plus size={16} />
            </button>
          </div>
        </aside>

        {/* Roadmap Visualization Space */}
        <main className="flex-1 overflow-y-auto bg-transparent p-8 md:p-16 scroll-smooth custom-scrollbar relative">
          <div className="max-w-4xl mx-auto h-full">
            {!isEnrolled ? (
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="h-full flex flex-col items-center justify-center text-center space-y-10 py-20"
              >
                <div className="relative">
                   <div className="absolute inset-0 bg-emerald-500/20 blur-[60px] rounded-full scale-150 animate-pulse"></div>
                   <div className="w-32 h-32 rounded-[2.5rem] bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-3xl shadow-emerald-500/40 relative z-10 border-4 border-white/20">
                     <Shield className="w-16 h-16 text-white" />
                   </div>
                </div>
                
                <div className="space-y-4 max-w-sm relative z-10">
                  <h2 className="text-4xl font-black text-[var(--text-main)] tracking-tighter uppercase leading-none">Access Locked</h2>
                  <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.4em] mb-4">Roadmap Enrollment Required</p>
                  <p className="text-sm text-[var(--text-muted)] font-medium leading-relaxed">
                    This roadmap is not in your library. Join now to start learning and track your progress.
                  </p>
                </div>

                <div className="flex flex-col gap-4 w-full max-w-xs relative z-10">
                  <button 
                    onClick={handleEnroll}
                    disabled={isEnrolling}
                    className="w-full py-5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs tracking-[0.2em] uppercase rounded-2xl transition-all shadow-2xl shadow-emerald-500/30 flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                  >
                    {isEnrolling ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Joining...
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4" />
                        Join Roadmap
                      </>
                    )}
                  </button>
                  <Link to="/" className="text-[9px] font-black text-gray-500 uppercase tracking-widest hover:text-emerald-500 transition-colors">Return to Central Hub</Link>
                </div>
              </motion.div>
            ) : activeTab === 'content' ? (
              <div className="space-y-12 pb-20">
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-12 flex items-center justify-between"
                >
                  <div className="flex items-center gap-8">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Official Topic</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-teal-500 shadow-[0_0_10px_rgba(20,184,166,0.5)]"></div>
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">User Added Topic</span>
                    </div>
                  </div>
                </motion.div>

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
                  className="space-y-6 relative"
                >
                  <div className="absolute left-[2.2rem] top-8 bottom-8 w-[1px] bg-gradient-to-b from-emerald-500/50 via-teal-500/50 to-transparent z-0"></div>

                  <AnimatePresence mode="wait">
                    {roadmap.nodes?.map((node: any, index: number) => (
                      <motion.div
                        key={node.id}
                        variants={{
                          hidden: { opacity: 0, x: -20 },
                          show: { opacity: 1, x: 0 }
                        }}
                        layout
                      >
                        <TopicNode
                          topic={node}
                          index={index}
                          progressMap={progressMap}
                          onToggle={handleToggleProgress}
                          onDeleteCustom={(id) => handleDeleteCustomTopic(id)}
                          onAddSubTopic={(parentId) => {
                            setIsAddingSubTopic(parentId);
                            setShowAddModal(true);
                          }}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>

                {(!roadmap.nodes || roadmap.nodes.length === 0) && (
                  <div className="py-32 flex flex-col items-center justify-center space-y-6 text-center">
                    <div className="w-20 h-20 rounded-full bg-[var(--bg-card)] border border-[var(--border-main)] flex items-center justify-center text-gray-300 mb-4 opacity-50">
                      <Layers size={40} />
                    </div>
                    <h3 className="text-2xl font-black text-gray-400 tracking-tighter uppercase">No Topics Found</h3>
                    <p className="text-sm text-gray-400 max-w-sm font-medium">This course is empty. Start by adding your first learning topic.</p>
                    <button
                      onClick={() => setShowAddModal(true)}
                      className="mt-6 px-10 py-4 bg-emerald-500 hover:bg-emerald-400 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-emerald-500/20 active:scale-95"
                    >
                      Add New Topic
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="animate-fade-in space-y-12 pb-20">
                <div className="flex items-center justify-between">
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] flex items-center gap-2">
                    <span className="w-8 h-[1px] bg-gray-300 dark:bg-gray-700"></span>
                    Topic Exploration View
                  </h3>
                  <p className="text-[10px] font-black text-emerald-600 bg-emerald-500/5 px-4 py-1.5 rounded-full border border-emerald-500/10 uppercase tracking-[0.2em] shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                    Map Mode
                  </p>
                </div>

                <div className="glass rounded-[3rem] p-16 min-h-[700px] border border-[var(--border-main)] flex flex-col items-center justify-center relative overflow-hidden group">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_var(--bg-main)_100%)] z-10"></div>
                  
                  <div className="relative z-20 w-full flex flex-col items-center gap-20">
                    <div className="glass p-8 rounded-[2.5rem] border-2 border-emerald-500 shadow-[0_0_40px_rgba(16,185,129,0.2)] text-center w-72">
                      <div className="w-14 h-14 rounded-2xl bg-emerald-500 flex items-center justify-center mx-auto mb-4">
                        <MapIcon className="text-white w-8 h-8" />
                      </div>
                      <h4 className="text-2xl font-black text-[var(--text-main)] tracking-widest uppercase mb-1">{roadmap.title}</h4>
                      <div className="flex items-center justify-center gap-2 text-[9px] font-black text-emerald-600 tracking-[0.2em] uppercase">
                        <Activity size={10} /> Main Path
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full">
                      {roadmap.nodes?.map((node: any, i: number) => (
                        <div key={node.id} className="relative group/node">
                          <div className="absolute top-[-50px] left-1/2 -translate-x-1/2 w-[2px] h-[50px] bg-gradient-to-b from-emerald-500/30 to-transparent"></div>

                          <div className={`glass p-6 rounded-[2rem] border transition-all duration-500 text-center space-y-4 h-full flex flex-col items-center ${progressMap[node.id] ? 'border-teal-500 bg-teal-500/5 shadow-[0_0_20px_rgba(20,184,166,0.1)]' : 'border-[var(--border-main)] hover:border-emerald-500 shadow-xl'
                            }`}>
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black ${progressMap[node.id] ? 'bg-teal-500 text-white' : 'bg-[var(--bg-main)] text-gray-400'
                              }`}>
                              {i + 1}
                            </div>
                            <h4 className="font-black text-[11px] text-[var(--text-main)] uppercase tracking-widest leading-tight">{node.title}</h4>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, var(--text-main) 1px, transparent 1px)', backgroundSize: '50px 50px' }}></div>
                </div>
              </div>
            )}
          </div>

          {/* Floating Tactical Graph Toggle */}
          <div className="fixed bottom-10 right-10 z-[60] flex flex-col gap-4">
            <button
              onClick={() => setActiveTab(activeTab === 'graph' ? 'content' : 'graph')}
              className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-2xl border-2 ${activeTab === 'graph' ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-white/80 dark:bg-[#0f172a] border-[var(--border-main)] text-emerald-600 hover:border-emerald-500/50'
                }`}
            >
              {activeTab === 'graph' ? <Layers className="w-6 h-6" /> : <TrendingUp className="w-6 h-6" />}
            </button>
          </div>
        </main>
      </div>

      {/* Unified Add Topic Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-3xl bg-emerald-900/10 font-['Outfit'] animate-fade-in">
          <div className="glass w-full max-w-xl p-10 rounded-[3rem] border border-[var(--border-main)] shadow-3xl space-y-8 bg-[var(--bg-card)]">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <h3 className="text-3xl font-black text-[var(--text-main)] tracking-tighter uppercase">
                  {isAddingSubTopic ? 'Add Sub-Topic' : 'Add Main Topic'}
                </h3>
                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em]">
                  {isAddingSubTopic ? `Adding to parent section` : 'Adding to course outline'}
                </p>
              </div>
              <button onClick={() => { setShowAddModal(false); setIsAddingSubTopic(null); }} className="w-12 h-12 rounded-2xl bg-[var(--bg-main)] flex items-center justify-center hover:bg-red-500/20 hover:text-red-400 text-gray-400 transition-all border border-[var(--border-main)]">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Topic Title</label>
                <input
                  type="text"
                  placeholder="e.g. Memory Management Optimization"
                  className="w-full bg-[var(--bg-main)] border border-[var(--border-main)] rounded-2xl px-6 py-5 text-[var(--text-main)] font-black text-xl outline-none focus:border-emerald-500 focus:bg-[var(--bg-card)] transition-all placeholder:text-gray-200"
                  value={newTopic.title}
                  onChange={e => setNewTopic({ ...newTopic, title: e.target.value })}
                  autoFocus
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Description</label>
                <textarea
                  placeholder="Explain what this topic covers..."
                  className="w-full bg-[var(--bg-main)] border border-[var(--border-main)] rounded-2xl px-6 py-5 text-[var(--text-main)] font-medium text-sm outline-none focus:border-emerald-500 focus:bg-[var(--bg-card)] transition-all placeholder:text-gray-200 h-32 resize-none leading-relaxed"
                  value={newTopic.description}
                  onChange={e => setNewTopic({ ...newTopic, description: e.target.value })}
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button onClick={() => { setShowAddModal(false); setIsAddingSubTopic(null); }} className="flex-1 py-5 bg-[var(--bg-main)] hover:bg-gray-100 dark:hover:bg-white/5 text-gray-400 font-black text-[10px] tracking-widest uppercase rounded-2xl transition-all border border-[var(--border-main)]">
                Cancel
              </button>
              <button onClick={handleAddCustomTopic} className="flex-[2] py-5 bg-emerald-500 hover:bg-emerald-400 text-white font-black text-[10px] tracking-widest uppercase rounded-2xl transition-all shadow-2xl shadow-emerald-500/30">
                Save Topic
              </button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}