import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, ArrowRight, ArrowLeft, Layers, Zap, BookOpen, Sparkles, Plus } from 'lucide-react';
import { api } from '../utils/api';

interface CreateRoadmapModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateRoadmapModal({ onClose, onSuccess }: CreateRoadmapModalProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestedCategories, setSuggestedCategories] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    nodesJson: ''
  });

  useEffect(() => {
    api.getCategories()
      .then(setSuggestedCategories)
      .catch(() => {});
  }, []);

  const nextStep = () => {
    if (step === 1 && !formData.title.trim()) return;
    if (step === 2 && !formData.category.trim()) return;
    setStep(s => s + 1);
  };
  const prevStep = () => setStep(s => s - 1);

  const handleCreate = async () => {
    try {
      setLoading(true);
      setError(null);

      let nodes = [];
      try {
        nodes = JSON.parse(formData.nodesJson);
        if (!Array.isArray(nodes)) throw new Error("Nodes must be an array");
      } catch (e: any) {
        throw new Error(`Invalid JSON format: ${e.message}`);
      }

      const payload = {
        title: formData.title,
        description: formData.description,
        category: formData.category || 'General',
        nodes: nodes
      };

      await api.importUserRoadmap(payload);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { title: 'Identity', subtitle: 'What is this roadmap about?' },
    { title: 'Classification', subtitle: 'Organize your roadmap' },
    { title: 'Curriculum', subtitle: 'Paste your JSON structure' }
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-3xl bg-emerald-900/10 font-['Outfit'] animate-fade-in">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="glass w-full max-w-2xl p-10 rounded-[3rem] border border-[var(--border-main)] shadow-3xl space-y-8 bg-[var(--bg-card)] overflow-hidden relative"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[100px] rounded-full -mr-32 -mt-32"></div>

        <div className="flex justify-between items-center relative z-10">
          <div className="space-y-1">
            <h3 className="text-3xl font-black text-[var(--text-main)] tracking-tighter uppercase flex items-center gap-3">
              <Sparkles className="text-emerald-500" /> {steps[step-1].title}
            </h3>
            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em]">
              Step {step} of 3 • {steps[step-1].subtitle}
            </p>
          </div>
          <button onClick={onClose} className="w-12 h-12 rounded-2xl bg-[var(--bg-main)] flex items-center justify-center hover:bg-red-500/20 hover:text-red-400 text-gray-400 transition-all border border-[var(--border-main)]">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden relative z-10">
          <motion.div 
            className="h-full bg-emerald-500"
            initial={{ width: '33%' }}
            animate={{ width: `${(step/3)*100}%` }}
          />
        </div>

        <div className="min-h-[400px] relative z-10">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Roadmap Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Advanced Agentic AI Architecture"
                    className="w-full bg-[var(--bg-main)] border border-[var(--border-main)] rounded-2xl px-6 py-5 text-[var(--text-main)] font-black text-xl outline-none focus:border-emerald-500 focus:bg-[var(--bg-card)] transition-all placeholder:text-gray-200"
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    autoFocus
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Description</label>
                  <textarea
                    placeholder="Provide a brief overview of what this roadmap covers..."
                    className="w-full bg-[var(--bg-main)] border border-[var(--border-main)] rounded-2xl px-6 py-5 text-[var(--text-main)] font-medium text-sm outline-none focus:border-emerald-500 focus:bg-[var(--bg-card)] transition-all placeholder:text-gray-200 h-40 resize-none leading-relaxed"
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Select Category</label>
                  
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {suggestedCategories.map(cat => (
                      <button 
                        key={cat.id} 
                        onClick={() => setFormData({...formData, category: cat.name})}
                        className={`px-5 py-4 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all text-left flex items-center justify-between ${
                          formData.category === cat.name 
                            ? 'bg-emerald-500 border-emerald-500 text-white shadow-xl shadow-emerald-500/20' 
                            : 'bg-[var(--bg-main)] border-[var(--border-main)] text-gray-400 hover:border-emerald-500/50 hover:text-emerald-500'
                        }`}
                      >
                        {cat.name}
                        {formData.category === cat.name && <Check size={14} />}
                      </button>
                    ))}
                  </div>

                  <div className="space-y-4 pt-6 border-t border-[var(--border-main)]">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">OR ADD CUSTOM CATEGORY</label>
                    <div className="relative">
                      <Layers className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        placeholder="Enter new category name..."
                        className="w-full bg-[var(--bg-main)] border border-[var(--border-main)] rounded-2xl pl-16 pr-6 py-5 text-[var(--text-main)] font-black text-lg outline-none focus:border-emerald-500 focus:bg-[var(--bg-card)] transition-all placeholder:text-gray-200"
                        value={formData.category}
                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2 block">Curriculum Content Only</label>
                      <p className="text-[8px] font-bold text-emerald-600 mt-1 pl-2">Title, Description & Category are inherited from UI steps.</p>
                    </div>
                    <span className="text-[9px] font-black text-emerald-600 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 uppercase">Core Nodes ONLY</span>
                  </div>
                  <textarea
                    placeholder='[
  { 
    "title": "Phase 1: Foundations", 
    "duration": "2 weeks", 
    "duration_hours": 28, 
    "children": [
      { "title": "Introduction to Python", "duration_hours": 2 }
    ]
  }
]'
                    className="w-full bg-slate-950 border border-[var(--border-main)] rounded-2xl px-6 py-5 text-emerald-400 font-mono text-xs outline-none focus:border-emerald-500 transition-all h-64 resize-none leading-relaxed custom-scrollbar"
                    value={formData.nodesJson}
                    onChange={e => setFormData({ ...formData, nodesJson: e.target.value })}
                  />
                  {error && (
                    <p className="text-red-500 text-[10px] font-black uppercase tracking-widest mt-2 px-2 flex items-center gap-2">
                      <X className="w-3 h-3" /> {error}
                    </p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex gap-4 pt-4 relative z-10">
          {step > 1 && (
            <button 
              onClick={prevStep} 
              disabled={loading}
              className="px-8 py-5 bg-[var(--bg-main)] hover:bg-white/5 text-gray-400 font-black text-[10px] tracking-widest uppercase rounded-2xl transition-all border border-[var(--border-main)] flex items-center justify-center gap-2"
            >
              <ArrowLeft size={16} /> Back
            </button>
          )}
          
          {step < 3 ? (
            <button 
              onClick={nextStep}
              disabled={(!formData.title && step === 1) || (!formData.category && step === 2)}
              className="flex-1 py-5 bg-emerald-500 hover:bg-emerald-400 text-white font-black text-[10px] tracking-widest uppercase rounded-2xl transition-all shadow-2xl shadow-emerald-500/30 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Forward <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          ) : (
            <button 
              onClick={handleCreate}
              disabled={loading || !formData.nodesJson}
              className="flex-1 py-5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black text-[10px] tracking-widest uppercase rounded-2xl transition-all shadow-2xl shadow-emerald-500/40 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                   <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                   Launching Roadmap...
                </>
              ) : (
                <>
                  <Check size={16} /> Deploy Custom Roadmap
                </>
              )}
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
