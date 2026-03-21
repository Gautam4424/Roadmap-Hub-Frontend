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
      to={`/roadmap/${linkId}`}
      className="block bg-white rounded-3xl border-2 border-gray-100 hover:border-blue-500 hover:shadow-2xl transition-all duration-300 overflow-hidden group h-full"
    >
      <div className="p-8 flex flex-col h-full">
        <div className="flex-1">
            <h3 className="text-2xl font-black text-gray-900 mb-3 group-hover:text-blue-600 transition-colors leading-tight">
              {roadmap.title}
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-3">
              {roadmap.description}
            </p>
        </div>

        <div className="pt-6 border-t border-gray-100 mt-auto">
          <div className="flex items-center gap-6 text-xs font-bold text-gray-400 uppercase tracking-widest">
            <div className="flex items-center gap-2">
              <BookOpen size={16} className="text-blue-600"/>
              <span>Topic Track</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-purple-600"/>
              <span>{roadmap.estimated_hours || 40}h</span>
            </div>
          </div>
          
          <div className="mt-6 flex items-center justify-between">
              <span className="text-[10px] bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-black">EXPERT VERIFIED</span>
              <div className="flex items-center gap-1 text-blue-600 group-hover:translate-x-1 transition-transform">
                  <span className="text-xs font-black">VIEW PATH</span>
                  <TrendingUp size={14}/>
              </div>
          </div>
        </div>
      </div>
    </Link>
  );
}