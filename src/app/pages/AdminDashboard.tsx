import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import {
  Users, Map as MapIcon, Plus, CheckCircle, XCircle, Shield,
  Bell, Settings, LogOut, Search, Play, Layers, Trash2,
  Home as HomeIcon, BookOpen, Microscope, Info, Terminal, Activity, Zap, Cpu, Globe, ArrowLeft, RefreshCw, Moon, Sun, Mail
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export function AdminDashboard() {
  const { user, loading: authLoading, logout: authLogout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'users' | 'roadmaps'>('users');
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Users Data
  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate('/login'); return; }
    if (!user.is_admin) { navigate('/'); return; }
    if (activeTab === 'users') { loadUsers(); }
  }, [user, authLoading, navigate, activeTab]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await api.getUsers();
      if (Array.isArray(data)) {
        setUsers(data);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleUser = async (userId: string, currentStatus: boolean, isAdmin: boolean) => {
    if (isAdmin) return;
    try {
      await api.toggleUserStatus(userId, !currentStatus);
      setUsers(users.map(u => u.id === userId ? { ...u, is_active: !currentStatus } : u));
    } catch (error) {
      console.error("Failed to update user status.");
    }
  };

  const handleToggleRole = async (userId: string, currentIsAdmin: boolean) => {
    try {
      await api.toggleUserRole(userId, !currentIsAdmin);
      setUsers(users.map(u => u.id === userId ? { ...u, is_admin: !currentIsAdmin } : u));
    } catch (error) {
      console.error("Failed to update user role.");
    }
  };

  // Roadmaps State
  const [newCat, setNewCat] = useState({ name: '', slug: '', color: '#06b6d4', sort_order: 0 });
  const [bulkJSON, setBulkJSON] = useState("");
  const [categories, setCategories] = useState<any[]>([]);
  const [allRoadmaps, setAllRoadmaps] = useState<any[]>([]);
  const [selectedCatId, setSelectedCatId] = useState("");
  const [targetTitle, setTargetTitle] = useState("");
  const [targetDescription, setTargetDescription] = useState("");

  const loadRoadmapData = async () => {
    try {
      const [cats, rms] = await Promise.all([api.getCategories(), api.getRoadmaps()]);
      setCategories(cats || []);
      setAllRoadmaps(rms || []);
    } catch (e) {
      console.error("Failed to load roadmap management data", e);
    }
  };

  useEffect(() => {
    if (activeTab === 'roadmaps') { loadRoadmapData(); }
  }, [activeTab]);

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createCategory(newCat);
      setNewCat({ name: '', slug: '', color: '#06b6d4', sort_order: 0 });
      loadRoadmapData();
    } catch (err) {
      console.error('Error creating category');
    }
  };

  const handleDeleteCategory = async (catId: string) => {
    if (!window.confirm("Are you sure you want to delete this category? It will only work if it's empty.")) return;
    try {
      await api.deleteCategory(catId);
      loadRoadmapData();
    } catch (err: any) {
      alert(err.message || 'Failed to delete category. Ensure it has no roadmaps.');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => setBulkJSON(event.target?.result as string);
    reader.readAsText(file);
  };

  const handleBulkImport = async () => {
    if (!bulkJSON.trim() || !selectedCatId || !targetTitle.trim()) return;
    try {
      const nodesRaw = JSON.parse(bulkJSON);
      const category = categories.find(c => c.id === selectedCatId)?.name || 'General';
      const nodes = Array.isArray(nodesRaw) ? nodesRaw : (nodesRaw.nodes || []);
      
      const payload = {
        title: targetTitle,
        description: targetDescription,
        category: category,
        nodes: nodes
      };

      await api.importRoadmapBulk(payload);
      setBulkJSON("");
      setTargetTitle("");
      setTargetDescription("");
      loadRoadmapData();
    } catch (err: any) {
      console.error('Failed to import: ' + err.message);
    }
  };

  const logout = () => { authLogout(); navigate('/login'); };

  if (!user || !user.is_admin) return null;

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] flex flex-col font-['Outfit'] transition-colors duration-500 overflow-x-hidden">
      {/* Background Mesh Glows - Lush theme */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-500/10 blur-[150px] rounded-full"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-amber-500/5 blur-[150px] rounded-full"></div>
      </div>

      {/* Top Navigation HUD */}
      <header className="h-20 border-b border-[var(--border-main)] bg-[var(--bg-main)]/60 backdrop-blur-xl sticky top-0 z-50 px-12 flex items-center justify-between transition-all">
        <div className="flex items-center gap-12">
          <Link to="/" className="text-3xl font-black tracking-tighter text-emerald-500 flex items-center gap-3 group">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform shadow-lg shadow-emerald-500/20">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span>Admin Panel</span>
          </Link>
          <nav className="hidden xl:flex items-center gap-10 text-[10px] font-black tracking-[0.4em] text-gray-400 uppercase">
            <Link to="/" className="hover:text-emerald-500 transition-all flex items-center gap-2">
              <ArrowLeft className="w-3 h-3" /> Exit Admin
            </Link>
            <span className="text-emerald-500 border-b-2 border-emerald-500 pb-7 translate-y-[14px] flex items-center gap-2">
              <Terminal className="w-4 h-4" /> Global Management Console
            </span>
          </nav>
        </div>
        <div className="flex items-center gap-6">
          <button
            onClick={toggleTheme}
            className="w-11 h-11 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-main)] flex items-center justify-center text-gray-400 hover:text-emerald-500 transition-all hover:scale-105 active:scale-95 shadow-lg"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 border border-white/10 flex items-center justify-center font-bold shadow-lg shadow-emerald-500/20 text-white">
            {user?.username?.[0].toUpperCase() || 'A'}
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden z-10">
        {/* Left Sidebar HUD */}
        <aside className="w-80 border-r border-[var(--border-main)] bg-[var(--bg-sidebar)]/30 backdrop-blur-md hidden lg:flex flex-col p-8 overflow-y-auto custom-scrollbar">
          <div className="space-y-4 mb-16">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-6 pl-2">Management</p>
            <button
              onClick={() => setActiveTab('users')}
              className={`group flex items-center gap-5 px-6 py-5 rounded-3xl transition-all duration-300 ${activeTab === 'users' ? 'bg-emerald-500/10 text-emerald-600 border-r-4 border-emerald-500 rounded-r-none' : 'text-gray-400 hover:text-emerald-500 hover:bg-emerald-500/5'}`}
            >
              <Users className="w-5 h-5" /> <span className="font-black text-[11px] tracking-[0.2em] uppercase">User Management</span>
            </button>
            <button
              onClick={() => setActiveTab('roadmaps')}
              className={`group flex items-center gap-5 px-6 py-5 rounded-3xl transition-all duration-300 ${activeTab === 'roadmaps' ? 'bg-teal-500/10 text-teal-600 border-r-4 border-teal-500 rounded-r-none' : 'text-gray-400 hover:text-teal-500 hover:bg-teal-500/5'}`}
            >
              <MapIcon className="w-5 h-5" /> <span className="font-black text-[11px] tracking-[0.2em] uppercase">Course Hub</span>
            </button>
          </div>

          <div className="mt-auto">
            <div className="glass p-8 rounded-[2.5rem] border border-red-500/10 bg-red-500/5 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-black text-red-500/80 uppercase tracking-widest flex items-center gap-2">
                  <Shield className="w-3.5 h-3.5" /> Full Admin Access
                </p>
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_red]"></span>
              </div>
              <p className="text-[11px] text-gray-500 leading-relaxed font-medium">
                High-level administrative access is active. All actions are logged for security purposes.
              </p>
            </div>
            <button onClick={logout} className="w-full mt-8 flex items-center justify-center gap-4 px-6 py-4 rounded-2xl bg-[var(--bg-card)]/40 hover:bg-red-500/10 text-red-600 border border-[var(--border-main)] transition-all font-black text-[10px] tracking-[0.2em] uppercase active:scale-95 group">
              <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Sign Out from Admin
            </button>
          </div>
        </aside>

        {/* Console View Space */}
        <main className="flex-1 overflow-y-auto bg-transparent p-8 md:p-16 lg:p-24 scroll-smooth custom-scrollbar">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="max-w-6xl mx-auto space-y-16"
          >
            {activeTab === 'users' ? (
              <>
                <div className="flex justify-between items-end">
                  <div className="space-y-4">
                    <div className="inline-flex items-center gap-3 bg-[var(--bg-card)] border border-[var(--border-main)] px-4 py-1.5 rounded-full">
                      <Globe size={14} className="text-emerald-500" />
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">User List v4.0</span>
                    </div>
                    <h2 className="text-6xl font-black text-[var(--text-main)] tracking-tighter uppercase leading-none">Access Control</h2>
                  </div>
                  <button onClick={loadUsers} className="px-10 py-5 bg-[var(--bg-card)] hover:bg-emerald-500/5 rounded-2xl border border-[var(--border-main)] font-black text-[10px] tracking-[0.3em] uppercase transition-all flex items-center gap-4 active:scale-95">
                    <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Re-Sync Data
                  </button>
                </div>

                <div className="glass rounded-[3rem] overflow-hidden border border-[var(--border-main)] shadow-2xl relative">
                  <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent"></div>
                  <table className="w-full text-left">
                    <thead className="bg-[var(--bg-main)]/40 border-b border-[var(--border-main)]">
                      <tr className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em]">
                        <th className="px-10 py-8">User Account</th>
                        <th className="px-10 py-8">Security Level</th>
                        <th className="px-10 py-8">Status</th>
                        <th className="px-10 py-8 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-main)]">
                      {loading ? (
                        <tr><td colSpan={4} className="p-32 text-center text-gray-400 font-black text-[10px] tracking-[0.5em] animate-pulse">Loading User Accounts...</td></tr>
                      ) : users.map(u => (
                        <tr key={u.id} className="hover:bg-emerald-500/[0.03] transition-all group">
                          <td className="px-10 py-8">
                            <div className="flex flex-col gap-1">
                              <div className="font-black text-2xl text-[var(--text-main)] tracking-tighter flex items-center gap-4">
                                {u.username}
                                {user.id === u.id && <span className="text-[9px] bg-emerald-500/10 text-emerald-600 px-3 py-1 rounded-full border border-emerald-500/20 uppercase tracking-[0.3em] italic">Current</span>}
                              </div>
                              <div className="text-xs text-[var(--text-muted)] font-medium tracking-wide flex items-center gap-2">
                                <Mail size={12} /> {u.email}
                              </div>
                            </div>
                          </td>
                          <td className="px-10 py-8">
                            {u.is_admin ? (
                              <div className="inline-flex items-center gap-3 text-emerald-600 font-black text-[10px] tracking-widest bg-emerald-500/5 px-4 py-2 rounded-xl border border-emerald-500/20">
                                <Shield className="w-3.5 h-3.5" /> SUPER_ADMIN
                              </div>
                            ) : (
                              <div className="inline-flex items-center gap-3 text-gray-400 font-black text-[10px] tracking-widest px-4 py-2 bg-[var(--bg-card)] rounded-xl border border-[var(--border-main)]">
                                STANDARD_USER
                              </div>
                            )}
                          </td>
                          <td className="px-10 py-8">
                            <div className={`inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-widest px-5 py-2 rounded-[2rem] border transition-all ${u.is_active ? 'bg-emerald-500/5 text-emerald-600 border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.05)]' : 'bg-red-500/5 text-red-500 border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.05)]'}`}>
                              <div className={`w-2 h-2 rounded-full ${u.is_active ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]' : 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]'}`}></div>
                              {u.is_active ? 'Active' : 'Locked'}
                            </div>
                          </td>
                          <td className="px-10 py-8 text-right">
                            <div className="flex justify-end gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => handleToggleRole(u.id, u.is_admin)}
                                disabled={u.id === user.id}
                                className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${u.is_admin ? 'bg-[var(--bg-card)] text-gray-400 border-[var(--border-main)] hover:text-emerald-500' : 'bg-emerald-600 text-white border-emerald-600 shadow-xl shadow-emerald-500/20 hover:bg-emerald-500'}`}
                              >
                                {u.is_admin ? 'Demote Access' : 'Promote to Admin'}
                              </button>
                              <button
                                onClick={() => handleToggleUser(u.id, u.is_active, u.is_admin)}
                                disabled={u.is_admin}
                                className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${u.is_active ? 'bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500 hover:text-white' : 'bg-emerald-500 text-white border-emerald-500 hover:bg-emerald-400 shadow-xl shadow-emerald-500/20'}`}
                              >
                                {u.is_active ? 'Suspend Account' : 'Activate Account'}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-between items-end">
                  <div className="space-y-4">
                    <div className="inline-flex items-center gap-3 bg-[var(--bg-card)] border border-[var(--border-main)] px-4 py-1.5 rounded-full">
                      <Cpu size={14} className="text-teal-500" />
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Course Management v5.2</span>
                    </div>
                    <h2 className="text-6xl font-black text-[var(--text-main)] tracking-tighter uppercase leading-none">Hub Control</h2>
                  </div>
                  <div className="flex gap-4">
                    <button onClick={loadRoadmapData} className="px-10 py-5 bg-[var(--bg-card)] hover:bg-teal-500/5 rounded-2xl border border-[var(--border-main)] font-black text-[10px] tracking-[0.3em] uppercase transition-all flex items-center gap-4 active:scale-95">
                      <RefreshCw size={16} /> Refresh Courses
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-5 gap-12">
                  {/* Category Management */}
                  <div className="xl:col-span-2 space-y-12">
                    <div className="glass p-10 rounded-[3rem] border border-[var(--border-main)] shadow-2xl space-y-10 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl"></div>
                      <h4 className="text-xl font-black text-[var(--text-main)] uppercase tracking-tighter flex items-center gap-4">
                        <Layers className="w-8 h-8 text-emerald-500" /> Course Groups
                      </h4>
                      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-3 custom-scrollbar">
                        {categories.map(c => (
                          <div key={c.id} className="group p-6 bg-[var(--bg-card)] rounded-3xl border border-[var(--border-main)] hover:border-emerald-500/40 transition-all flex items-center justify-between">
                            <div className="space-y-1">
                              <p className="text-xl font-black text-[var(--text-main)] tracking-tighter">{c.name}</p>
                              <p className="text-[10px] font-mono font-black text-gray-400 uppercase tracking-widest">/roadmaps/{c.slug}</p>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl bg-[var(--bg-main)] flex items-center justify-center text-gray-500 font-black text-xs border border-[var(--border-main)] group-hover:bg-emerald-500/10 group-hover:text-emerald-600 transition-all">
                                {c.roadmaps?.length || 0}
                              </div>
                              <button 
                                onClick={() => handleDeleteCategory(c.id)}
                                className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-500/10 transition-all"
                                title="Delete Category"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                      <form onSubmit={handleCreateCategory} className="pt-10 border-t border-[var(--border-main)] space-y-6">
                        <div className="grid grid-cols-1 gap-4">
                          <input required type="text" placeholder="Group Name" className="w-full bg-[var(--bg-main)] border border-[var(--border-main)] rounded-2xl px-6 py-5 font-black text-xl text-[var(--text-main)] outline-none focus:border-emerald-500 transition-all placeholder:text-gray-300" value={newCat.name} onChange={e => setNewCat({ ...newCat, name: e.target.value })} />
                          <input required type="text" placeholder="URL Slug" className="w-full bg-[var(--bg-main)] border border-[var(--border-main)] rounded-2xl px-6 py-5 font-black text-sm text-teal-600 outline-none focus:border-emerald-500 transition-all uppercase tracking-widest placeholder:text-gray-300" value={newCat.slug} onChange={e => setNewCat({ ...newCat, slug: e.target.value.toLowerCase() })} />
                        </div>
                        <button className="w-full py-6 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[10px] tracking-[0.4em] uppercase rounded-2xl transition-all shadow-xl shadow-emerald-500/30 active:scale-95">
                          Add Group
                        </button>
                      </form>
                    </div>
                  </div>

                  {/* Bulk Import Console */}
                  <div className="xl:col-span-3">
                    <div className="glass p-12 rounded-[3.5rem] border border-[var(--border-main)] shadow-2xl h-full flex flex-col space-y-8 relative overflow-hidden">
                      <div className="absolute bottom-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[100px]"></div>
                      <h4 className="text-xl font-black text-[var(--text-main)] uppercase tracking-tighter flex items-center gap-4">
                        <Zap className="w-8 h-8 text-amber-500" /> Bulk Course Import
                      </h4>

                      <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-3">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] ml-2">Target Group</label>
                          <select
                            className="w-full bg-[var(--bg-main)] border border-[var(--border-main)] rounded-2xl px-6 py-5 text-sm font-black text-[var(--text-main)] outline-none focus:border-emerald-500 transition-all cursor-pointer appearance-none"
                            value={selectedCatId}
                            onChange={(e) => setSelectedCatId(e.target.value)}
                          >
                            <option value="" className="bg-[var(--bg-main)]">Select Target Group...</option>
                            {categories.map(c => (<option key={c.id} value={c.id} className="bg-[var(--bg-main)]">{c.name}</option>))}
                          </select>
                        </div>
                        <div className="space-y-3">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] ml-2">Course Name</label>
                          <input
                            type="text"
                            className="w-full bg-[var(--bg-main)] border border-[var(--border-main)] rounded-2xl px-6 py-5 text-xl font-black text-[var(--text-main)] outline-none focus:border-emerald-500 transition-all placeholder:text-gray-300"
                            placeholder="e.g. Advanced AI Roadmap"
                            value={targetTitle}
                            onChange={(e) => setTargetTitle(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] ml-2">Course Description</label>
                        <input
                          type="text"
                          className="w-full bg-[var(--bg-main)] border border-[var(--border-main)] rounded-2xl px-6 py-5 text-sm font-medium text-[var(--text-main)] outline-none focus:border-emerald-500 transition-all placeholder:text-gray-300"
                          placeholder="Provide a brief overview..."
                          value={targetDescription}
                          onChange={(e) => setTargetDescription(e.target.value)}
                        />
                      </div>

                      <div className="space-y-3 flex-1 flex flex-col">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] ml-2">Curriculum ONLY (Nodes Array)</label>
                        <textarea
                          className="flex-1 min-h-[250px] w-full bg-[var(--bg-main)]/40 border border-[var(--border-main)] rounded-[2rem] p-8 text-sm font-mono text-emerald-600 outline-none focus:border-emerald-500/50 transition-all placeholder:text-gray-200 custom-scrollbar leading-relaxed"
                          placeholder='[{"title":"Phase 1","children": [...]}]'
                          value={bulkJSON}
                          onChange={(e) => setBulkJSON(e.target.value)}
                        />
                      </div>

                      <div className="flex gap-8">
                        <label className="cursor-pointer bg-[var(--bg-card)] border-2 border-dashed border-[var(--border-main)] hover:border-emerald-500/40 hover:bg-emerald-500/5 px-10 py-6 rounded-3xl font-black text-[10px] tracking-[0.3em] text-gray-400 hover:text-emerald-500 uppercase transition-all flex-1 text-center flex items-center justify-center">
                          Upload JSON File
                          <input type="file" accept=".json" className="hidden" onChange={handleFileUpload} />
                        </label>
                        <button
                          onClick={handleBulkImport}
                          disabled={!bulkJSON.trim() || !selectedCatId || !targetTitle.trim()}
                          className={`flex-[1.5] py-6 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[10px] tracking-[0.5em] uppercase rounded-3xl transition-all shadow-2xl shadow-emerald-500/30 flex items-center justify-center gap-4 active:scale-95 ${(!bulkJSON.trim() || !selectedCatId || !targetTitle.trim()) ? 'opacity-30 grayscale' : ''}`}
                        >
                          <Play className="w-5 h-5 fill-current" /> Deploy Bulk Course
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Engine Inventory List */}
                <div className="glass rounded-[3.5rem] border border-[var(--border-main)] overflow-hidden shadow-2xl relative">
                  <div className="p-12 border-b border-[var(--border-main)] flex justify-between items-center bg-[var(--bg-main)]/40">
                    <div className="space-y-2">
                      <h4 className="text-3xl font-black text-[var(--text-main)] uppercase tracking-tighter flex items-center gap-6">
                        <MapIcon className="w-10 h-10 text-emerald-500" /> Command Deployment Index
                      </h4>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] ml-2">Managing {allRoadmaps.length} active learning paths</p>
                    </div>
                    <button className="px-10 py-5 bg-red-500/10 hover:bg-red-500 text-red-600 hover:text-white rounded-2xl border border-red-500/20 transition-all font-black text-[10px] tracking-[0.3em] uppercase active:scale-95">Clear Cache</button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-[var(--bg-main)]/40 border-b border-[var(--border-main)]">
                        <tr className="text-[10px] font-black text-gray-400 uppercase tracking-[0.5em]">
                          <th className="px-12 py-10">Course Name</th>
                          <th className="px-12 py-10">Unique ID</th>
                          <th className="px-12 py-10">Status</th>
                          <th className="px-12 py-10 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[var(--border-main)]">
                        {allRoadmaps.map(rm => (
                          <tr key={rm.id} className="hover:bg-emerald-500/[0.03] transition-all group">
                            <td className="px-12 py-10">
                              <div className="font-black text-2xl text-[var(--text-main)] tracking-tighter leading-none">{rm.title}</div>
                              <div className="text-[10px] font-black text-teal-600 uppercase tracking-[0.2em] mt-3">TARGET: /roadmaps/{rm.slug}</div>
                            </td>
                            <td className="px-12 py-10 font-mono text-[10px] text-[var(--text-muted)] tracking-widest">
                              {rm.id.toUpperCase()}
                            </td>
                            <td className="px-12 py-10">
                              <div className="inline-flex items-center gap-4 px-6 py-3 bg-emerald-500/5 text-emerald-600 rounded-full border border-emerald-500/20 text-[10px] font-black uppercase tracking-[0.3em]">
                                <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_emerald]"></div>
                                Active & Online
                              </div>
                            </td>
                            <td className="px-12 py-10 text-right">
                              <Link to={`/roadmaps/${rm.slug}`} className="group/link inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-main)] text-emerald-600 hover:bg-emerald-500/10 transition-all shadow-xl">
                                <span className="text-[10px] font-black uppercase tracking-[0.3em]">View Topic</span>
                                <Play size={14} className="fill-current group-hover/link:translate-x-1 transition-transform" />
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </main>
      </div>

      <AnimatePresence>
        {loading && activeTab === 'users' && users.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[var(--bg-main)]/80 backdrop-blur-2xl"
          >
            <div className="flex flex-col items-center gap-8 text-center">
              <div className="relative w-32 h-32">
                <div className="absolute inset-0 border-8 border-emerald-500/20 rounded-full"></div>
                <div className="absolute inset-0 border-8 border-t-emerald-500 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Shield size={40} className="text-emerald-500 animate-pulse" />
                </div>
              </div>
              <div className="text-[12px] font-black text-emerald-500 uppercase tracking-[0.6em] animate-pulse">Syncing Matrix identities...</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
