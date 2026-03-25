import { Link } from 'react-router';
import { BookOpen, Clock, TrendingUp } from 'lucide-react';

interface RoadmapCardProps {
  roadmap: any;
}

export function RoadmapCard({ roadmap }: RoadmapCardProps) {
  // Use slug for the link if available, otherwise id
  const linkId = roadmap.slug || roadmap.id;

  return (
    <Link
      to={`/roadmaps/${linkId}`}
      className="block bg-[var(--bg-card)] rounded-[2.5rem] border border-[var(--border-main)] hover:border-emerald-500/40 hover:shadow-[0_40px_80px_rgba(16,185,129,0.1)] transition-all duration-500 overflow-hidden group h-full relative"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
      
      <div className="p-10 flex flex-col h-full relative z-10">
        <div className="flex-1">
            <div className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.3em] mb-3 font-mono opacity-60 group-hover:opacity-100 transition-opacity">PROTOCOL NEURAL_LINK</div>
            <h3 className="text-3xl font-black text-[var(--text-main)] mb-4 group-hover:text-emerald-600 transition-colors tracking-tighter leading-tight">
              {roadmap.title}
            </h3>
            <p className="text-[var(--text-muted)] text-[15px] leading-relaxed mb-8 line-clamp-3 font-medium">
              {roadmap.description}
            </p>
        </div>

        <div className="pt-8 border-t border-[var(--border-main)] mt-auto">
          <div className="flex items-center gap-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
            <div className="flex items-center gap-3">
              <BookOpen size={16} className="text-emerald-500"/>
              <span>Topic Track</span>
            </div>
            <div className="flex items-center gap-3">
              <Clock size={16} className="text-teal-500"/>
              <span>{roadmap.estimated_hours || 40}h</span>
            </div>
          </div>
          
          <div className="mt-8 flex items-center justify-between">
              <span className="text-[9px] bg-emerald-500/10 text-emerald-600 px-4 py-1.5 rounded-full font-black border border-emerald-500/20 uppercase tracking-widest">EXPERT VERIFIED</span>
              <div className="flex items-center gap-2 text-emerald-600 group-hover:translate-x-1 transition-transform">
                  <span className="text-[10px] font-black uppercase tracking-widest">VIEW PATH</span>
                  <TrendingUp size={14}/>
              </div>
          </div>
        </div>
      </div>
    </Link>
  );
}