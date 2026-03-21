import { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { ArrowLeft, BookOpen, Clock, Award, TrendingUp, Calendar, LogIn, LogOut, User, PlusCircle } from 'lucide-react';
import { TopicNode } from '../components/TopicNode';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';

export function RoadmapDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const [roadmap, setRoadmap] = useState<any>(null);
  const [customNodes, setCustomNodes] = useState<any[]>([]);
  const [progressMap, setProgressMap] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  // Load standard roadmap, custom topics, and progress
  useEffect(() => {
    async function loadData() {
      if (!id) return;
      setLoading(true);
      try {
        const rmData = await api.getRoadmap(id);
        
        const customData = user ? await api.getCustomNodes(rmData.id) : [];
        
        setRoadmap(rmData);
        setCustomNodes(customData);
        
        if (user) {
          const progData = await api.getProgress(rmData.id);
          // Convert array of objects to map {node_id: is_completed}
          const pMap: Record<string, boolean> = {};
          progData.forEach((p: any) => {
            pMap[p.node_id] = p.is_completed;
          });
          setProgressMap(pMap);
        }
      } catch (err) {
        console.error("Failed to load roadmap data", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id, user]);

  const handleToggleProgress = async (nodeId: string, currentStatus: boolean) => {
    if (!user) {
      if (window.confirm("Please login to track progress.")) navigate('/login');
      return;
    }
    const newStatus = !currentStatus;

    // Optimistic UI update for instant feedback
    setProgressMap(prev => ({ ...prev, [nodeId]: newStatus }));

    try {
      await api.toggleProgress(roadmap.id, nodeId, newStatus);
    } catch (err) {
      console.error("API error toggling progress", err);
      // Revert the optimistic update if backend fails
      setProgressMap(prev => ({ ...prev, [nodeId]: currentStatus }));
      alert("Failed to sync progress. Please check your connection.");
    }
  };

  const handleAddCustom = async (parentNodeId?: string) => {
    const title = window.prompt("Enter title for your custom topic:");
    if (!title) return;
    try {
      const newNode = await api.addCustomNode({
        roadmap_id: roadmap.id,
        parent_node_id: parentNodeId,
        title
      });
      setCustomNodes(prev => [...prev, newNode]);
    } catch (err) {
      alert("Failed to add custom topic.");
    }
  };

  // Merge standard topics and custom topics
  const mergedTopics = useMemo(() => {
    if (!roadmap) return [];
    
    // Convert standard roadmap nodes to the format expected by TopicNode
    const standard = roadmap.nodes.map((n: any) => ({
      ...n,
      isCustom: false,
      completed: !!progressMap[n.id]
    }));

    // Attach custom topics to their parents
    const custom = customNodes.map(n => ({
      ...n,
      isCustom: true,
      completed: !!progressMap[n.id],
      subtopics: [], // We'll assume custom nodes don't have nested subs yet or handle them
      resources: []
    }));

    // For simplicity, we'll append custom nodes at the end OR under parents
    // In a real tree, we'd recursively merge.
    return standard.map((s: any) => ({
      ...s,
      customAdditions: custom.filter(c => c.parent_node_id === s.id)
    }));
  }, [roadmap, customNodes, progressMap]);

  const totalPossible = roadmap ? roadmap.total_nodes + customNodes.length : 0;
  const totalCompleted = Object.values(progressMap).filter(v => v).length;
  const progressPercent = totalPossible > 0 ? (totalCompleted / totalPossible) * 100 : 0;

  if (loading) return <div className="p-20 text-center font-bold">Loading Learning Journey...</div>;
  if (!roadmap) return <div className="p-20 text-center">Roadmap not found.</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <button onClick={() => navigate('/')} className="flex items-center gap-2 hover:text-blue-600">
               <ArrowLeft size={18}/> Back to Home
            </button>
            <div className="flex gap-4 items-center">
               {user ? <span className="font-semibold">{user.username}</span> : <Link to="/login" className="text-blue-600">Login</Link>}
               {user && <button onClick={logout} className="text-red-600 hover:bg-red-50 px-3 py-1 rounded">Logout</button>}
            </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between gap-8">
            <div className="flex-1">
                <h1 className="text-4xl font-extrabold mb-2">{roadmap.title}</h1>
                <p className="text-white/80 max-w-2xl">{roadmap.description}</p>
                <div className="flex gap-6 mt-6 opacity-90">
                    <div className="flex items-center gap-2"><BookOpen size={18}/> {totalPossible} Total Topics</div>
                    <div className="flex items-center gap-2"><Clock size={18}/> {roadmap.estimated_hours}h Estimate</div>
                    <div className="flex items-center gap-2"><Award size={18}/> {totalCompleted} Finished</div>
                </div>
            </div>
            <div className="bg-white/10 backdrop-blur px-8 py-6 rounded-2xl min-w-[280px]">
                <div className="flex justify-between items-end mb-2">
                    <span className="font-bold text-lg">Your Progress</span>
                    <span className="text-3xl font-black">{Math.round(progressPercent)}%</span>
                </div>
                <div className="w-full bg-white/20 h-3 rounded-full overflow-hidden">
                    <div className="h-full bg-white" style={{ width: `${progressPercent}%` }} />
                </div>
            </div>
        </div>
      </section>

      {/* Curriculum */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-white shadow-xl rounded-2xl border border-gray-200 overflow-hidden">
            <div className="p-8 border-b border-gray-100 flex justify-between items-center">
                <div>
                   <h2 className="text-2xl font-black text-gray-900">📚 Learning Curriculum</h2>
                   <p className="text-gray-500">Master every topic to complete the track.</p>
                </div>
                <button onClick={() => handleAddCustom()} className="bg-blue-600 text-white px-5 py-2 rounded-xl hover:bg-blue-700 flex items-center gap-2 font-bold transition-all shadow-lg active:scale-95">
                    <PlusCircle size={20}/> New Custom Topic
                </button>
            </div>
            
            <div className="p-8 space-y-6">
                {mergedTopics.map((topic: any, idx: number) => (
                    <div key={topic.id} className="relative group">
                        <TopicNode 
                            topic={topic} 
                            progressMap={progressMap}
                            onToggle={(id, current) => handleToggleProgress(id, current)}
                            index={idx} 
                        />
                        
                        {/* Custom Topic Sub-Action in Header */}
                        <div className="bg-gray-50 p-6 border-x border-b rounded-b-xl border-gray-100 ml-4">
                            <h4 className="text-xs uppercase font-bold text-gray-400 mb-4 tracking-widest">My Private Additions</h4>
                            <div className="space-y-3">
                                {topic.customAdditions.map((cad: any) => (
                                    <div key={cad.id} className="flex items-center gap-3 bg-white p-3 rounded-lg shadow-sm border border-blue-50">
                                        <input 
                                            type="checkbox" 
                                            checked={!!progressMap[cad.id]}
                                            onChange={() => handleToggleProgress(cad.id, !!progressMap[cad.id])}
                                            className="w-5 h-5 rounded text-blue-600"
                                        />
                                        <span className="font-medium text-gray-700">{cad.title}</span>
                                        <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-bold ml-auto">PRIVATE</span>
                                    </div>
                                ))}
                                <button 
                                    onClick={() => handleAddCustom(topic.id)}
                                    className="w-full py-2 border-2 border-dashed border-gray-200 rounded-lg text-gray-400 hover:text-blue-500 hover:border-blue-200 transition-all flex items-center justify-center gap-2 text-sm font-medium"
                                >
                                    <PlusCircle size={16}/> Add relevant sub-topic here
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </section>
    </div>
  );
}