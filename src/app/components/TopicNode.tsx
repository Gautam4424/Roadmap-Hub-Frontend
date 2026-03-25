import { useState } from 'react';
import {
  CheckCircle, Circle, Clock, ExternalLink, BookOpen,
  ChevronRight, List, PlusCircle, Terminal, Cpu, Play,
  Layers, Plus, X, XCircle, Trash2, Zap, ArrowRight, Shield
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TopicNodeProps {
  topic: any;
  progressMap: Record<string, boolean>;
  onToggle: (id: string, current: boolean) => void;
  onAddSubTopic: (parentId: string) => void;
  onDeleteCustom?: (nodeId: string) => void;
  index: number;
}

export default function TopicNode({ topic, progressMap, onToggle, onAddSubTopic, onDeleteCustom, index }: TopicNodeProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showResources, setShowResources] = useState(false);
  const completed = !!progressMap[topic.id];

  const isAnyNodeIncomplete = (topic.subtopics && topic.subtopics.length > 0)
    ? topic.subtopics.some((sub: any) => !progressMap[sub.id])
    : !completed;

  const isAllNodesComplete = topic.subtopics?.length > 0 &&
    topic.subtopics.every((sub: any) => progressMap[sub.id]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`glass rounded-[2.5rem] overflow-hidden transition-all duration-500 border-l-[6px] ${isAllNodesComplete ? 'border-emerald-500 hover:border-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.1)]' :
          completed ? 'border-teal-500 hover:border-teal-400 shadow-[0_0_30px_rgba(20,184,166,0.1)]' :
            'border-[var(--border-main)] hover:border-emerald-500/20 shadow-xl'
        } bg-[var(--bg-card)]/40 relative z-10`}
    >
      <div
        className="p-10 cursor-pointer hover:bg-emerald-500/[0.02] transition-all group"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start gap-10">
          {/* Main Checkbox HUD */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              const newStatus = !completed;
              onToggle(topic.id, completed);

              if (topic.subtopics && topic.subtopics.length > 0) {
                topic.subtopics.forEach((sub: any) => {
                  if (!!progressMap[sub.id] !== newStatus) {
                    onToggle(sub.id, !!progressMap[sub.id]);
                  }
                });
              }
            }}
            className="flex-shrink-0 mt-2 focus:outline-none relative"
          >
            <div className={`w-14 h-14 rounded-[1.5rem] border-2 flex items-center justify-center transition-all duration-700 ${completed ? 'bg-emerald-500 border-emerald-500 shadow-[0_0_25px_rgba(16,185,129,0.4)] rotate-12 scale-110' :
                'border-[var(--border-main)] group-hover:border-emerald-500 group-hover:bg-emerald-500/10'
              }`}>
              {completed ? (
                <CheckCircle className="w-8 h-8 text-white stroke-[3]" />
              ) : (
                <Circle className="w-8 h-8 text-gray-300 group-hover:text-emerald-500 transition-colors" />
              )}
            </div>
            {/* Neon connector dots */}
            <div className="absolute top-16 left-1/2 -translate-x-1/2 flex flex-col gap-1 items-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="w-1 h-1 bg-emerald-500 rounded-full"></div>
              <div className="w-1 h-1 bg-emerald-500/50 rounded-full"></div>
            </div>
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-8 mb-6">
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-[10px] font-black text-emerald-600 bg-emerald-500/10 px-4 py-1.5 rounded-full uppercase tracking-[0.2em] border border-emerald-500/20">
                    <Terminal size={12} /> TOPIC-{index + 1}
                  </div>
                  {topic.duration && (
                    <div className="flex items-center gap-2 text-[10px] font-black text-amber-600 bg-amber-500/10 px-4 py-1.5 rounded-full uppercase tracking-[0.2em] border border-amber-500/20">
                      <Clock size={12} /> {topic.duration}
                    </div>
                  )}
                  {topic.duration_hours > 0 && (
                    <div className="flex items-center gap-2 text-[10px] font-black text-blue-600 bg-blue-500/10 px-4 py-1.5 rounded-full uppercase tracking-[0.2em] border border-blue-500/20">
                      <Zap size={12} /> {topic.duration_hours} hrs
                    </div>
                  )}
                  <AnimatePresence>
                    {isAnyNodeIncomplete && !completed && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="flex items-center gap-2 text-[10px] font-black text-amber-600 uppercase tracking-widest px-3 py-1 bg-amber-500/10 rounded-full border border-amber-500/20"
                      >
                        <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span> REQUIRED
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <h3 className={`text-4xl font-black tracking-tighter leading-none transition-all duration-500 ${completed ? 'text-emerald-900/40 opacity-60' : 'text-[var(--text-main)]'}`}>
                  {topic.title}
                </h3>
              </div>
              <motion.div
                animate={{ rotate: isExpanded ? 90 : 0 }}
                className={`w-12 h-12 rounded-2xl bg-[var(--bg-card)]/50 border border-[var(--border-main)] flex items-center justify-center text-gray-400 group-hover:text-emerald-500 transition-colors`}
              >
                <ChevronRight size={24} />
              </motion.div>
            </div>

            <p className="text-xl text-[var(--text-muted)] font-medium leading-relaxed max-w-3xl mb-8">
              {topic.description || "Clear steps to help you master this topic from scratch."}
            </p>

            <div className="flex items-center gap-6">
              <button
                className={`flex items-center gap-3 px-6 py-3 rounded-2xl transition-all font-black text-[10px] tracking-widest uppercase border ${isExpanded ? 'bg-emerald-500 text-white border-emerald-500 shadow-xl shadow-emerald-500/30' : 'glass-emerald text-emerald-600 border-emerald-500/20 hover:border-emerald-400 transition-all'
                  }`}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded(!isExpanded);
                }}
              >
                <Layers className="w-4 h-4" />
                {topic.subtopics?.length || 0} Sub-Topics
              </button>

              <button
                className="flex items-center gap-3 text-[10px] font-black text-gray-400 hover:text-emerald-500 transition-all uppercase tracking-widest group/btn"
                onClick={(e) => { e.stopPropagation(); setShowResources(!showResources); }}
              >
                <ExternalLink size={16} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                {topic.resources?.length || 0} Learning Resources
              </button>

              {topic.is_custom && (
                <button
                  className="flex items-center gap-3 text-[10px] font-black text-red-500 hover:bg-red-500 hover:text-white px-5 py-3 rounded-2xl border border-red-500/20 transition-all uppercase tracking-widest ml-auto shadow-lg hover:shadow-red-500/20"
                  onClick={(e) => { e.stopPropagation(); if (onDeleteCustom) onDeleteCustom(topic.id); }}
                >
                  <Trash2 size={16} /> Delete Topic
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-[var(--border-main)] bg-emerald-500/[0.02]"
          >
            <div className="p-12 space-y-8">
              <div className="flex items-center justify-between mb-8">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] flex items-center gap-3">
                  <div className="w-4 h-[2px] bg-emerald-500"></div>
                  What you will learn
                </h4>
                <button
                  onClick={(e) => { e.stopPropagation(); onAddSubTopic(topic.id); }}
                  className="px-6 py-3 glass-emerald text-emerald-600 rounded-2xl border border-emerald-500/20 text-[10px] font-black uppercase tracking-widest flex items-center gap-3 transition-all hover:scale-105 active:scale-95 shadow-lg group"
                >
                  <Plus size={16} className="group-hover:rotate-90 transition-transform" /> Add My Own Topic
                </button>
              </div>

              <div className="grid gap-6">
                {topic.subtopics?.map((sub: any, idx: number) => {
                  const subCompleted = !!progressMap[sub.id];
                  return (
                    <motion.div
                      key={sub.id}
                      whileHover={{ x: 10 }}
                      className={`group flex items-center gap-8 p-8 rounded-[2rem] border transition-all duration-500 ${subCompleted ? 'bg-[var(--bg-card)]/20 border-[var(--border-main)] opacity-50' :
                          sub.is_custom ? 'bg-emerald-500/[0.05] border-emerald-500/20 hover:border-emerald-500/50 shadow-2xl' :
                            'bg-[var(--bg-card)]/60 border-[var(--border-main)] hover:border-emerald-500/40 hover:shadow-2xl hover:shadow-emerald-500/5'
                        }`}
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggle(sub.id, subCompleted);
                        }}
                        className="focus:outline-none relative"
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center border-2 transition-all duration-700 ${subCompleted ? 'bg-emerald-500 border-emerald-500 shadow-lg shadow-emerald-500/40 rotate-6' :
                            sub.is_custom ? 'border-emerald-500/30 group-hover:border-emerald-400' :
                              'border-[var(--border-main)] group-hover:border-emerald-500'
                          }`}>
                          {subCompleted ? <CheckCircle size={20} className="text-white stroke-[3]" /> : <Circle size={20} className={`group-hover:scale-110 transition-all ${sub.is_custom ? 'text-emerald-400/50' : 'text-gray-300 group-hover:text-emerald-500'}`} />}
                        </div>
                      </button>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-4">
                          <span className={`text-[10px] font-black tracking-widest ${sub.is_custom ? 'text-emerald-600' : 'text-emerald-500'} opacity-50`}>STEP {index + 1}.{idx + 1}</span>
                          <h5 className={`font-black text-2xl tracking-tighter ${subCompleted ? 'text-emerald-900/40 line-through' : 'text-[var(--text-main)]'}`}>{sub.title}</h5>
                           {sub.is_custom && (
                            <span className="text-[8px] bg-emerald-500/10 text-emerald-600 px-3 py-1 rounded-full font-black border border-emerald-500/20 uppercase tracking-widest flex items-center gap-2">
                              <Zap size={10} /> Personal Topic
                            </span>
                          )}
                          {sub.duration && (
                            <span className="text-[8px] bg-amber-500/10 text-amber-600 px-3 py-1 rounded-full font-black border border-amber-500/20 uppercase tracking-widest flex items-center gap-2">
                              <Clock size={10} /> {sub.duration}
                            </span>
                          )}
                          {sub.duration_hours > 0 && (
                            <span className="text-[8px] bg-blue-500/10 text-blue-600 px-3 py-1 rounded-full font-black border border-blue-500/20 uppercase tracking-widest flex items-center gap-2">
                              <Zap size={10} /> {sub.duration_hours}h
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-[var(--text-muted)] font-medium leading-relaxed max-w-2xl">{sub.description || "Learn the key concepts for this topic step-by-step."}</p>
                      </div>
                      {sub.is_custom && onDeleteCustom && (
                        <button
                          onClick={(e) => { e.stopPropagation(); onDeleteCustom(sub.id); }}
                          className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all border border-red-500/20 flex items-center justify-center shadow-lg"
                          title="Delete Sub-Topic"
                        >
                          <Trash2 size={20} />
                        </button>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Resources HUD */}
            {showResources && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="mx-12 mb-12 glass p-10 rounded-[3rem] border border-[var(--border-main)] relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl rounded-full"></div>
                <h4 className="text-[10px] font-black text-gray-400 mb-8 uppercase tracking-[0.4em] flex items-center gap-3">
                  <div className="w-4 h-4 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                    <BookOpen size={10} className="text-emerald-500" />
                  </div>
                  Resource List
                </h4>
                <div className="grid sm:grid-cols-2 gap-6 relative z-10">
                  {topic.resources?.map((res: any, index: number) => (
                    <a key={index} href={res.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-6 p-6 bg-[var(--bg-card)]/50 rounded-3xl border border-[var(--border-main)] hover:border-emerald-500/40 hover:bg-[var(--bg-card)] transition-all group/res">
                      <div className="w-14 h-14 bg-[var(--bg-main)] text-[var(--text-muted)] flex items-center justify-center rounded-2xl font-black group-hover/res:bg-emerald-500 group-hover/res:text-white transition-all shadow-lg">
                        <Zap size={24} />
                      </div>
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="font-black text-xl text-[var(--text-main)] group-hover/res:text-emerald-600 transition-colors truncate tracking-tighter">{res.title}</div>
                        <div className="flex items-center gap-2 text-[9px] font-black text-gray-400 uppercase tracking-widest">
                          <Shield size={10} /> VERIFIED SOURCE
                        </div>
                      </div>
                      <div className="w-10 h-10 rounded-full border border-[var(--border-main)] flex items-center justify-center group-hover/res:border-emerald-500 group-hover/res:bg-emerald-500/5 transition-all">
                        <ArrowRight size={18} className="text-gray-400 group-hover/res:text-emerald-500 group-hover/res:translate-x-1 transition-all" />
                      </div>
                    </a>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
