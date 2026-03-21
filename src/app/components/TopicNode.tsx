import { useState } from 'react';
import { CheckCircle2, Circle, Clock, ExternalLink, BookOpen, ChevronRight, List, PlusCircle } from 'lucide-react';

interface TopicNodeProps {
  topic: any;
  progressMap: Record<string, boolean>;
  onToggle: (id: string, current: boolean) => void;
  index: number;
}

export function TopicNode({ topic, progressMap, onToggle, index }: TopicNodeProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showResources, setShowResources] = useState(false);
  const completed = !!progressMap[topic.id];

  return (
    <div className={`border rounded-2xl overflow-hidden transition-all shadow-md ${
      completed ? 'border-green-300 bg-green-50/20' : 'border-gray-200 bg-white'
    }`}>
      <div
        className="p-6 cursor-pointer hover:bg-gray-50/50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start gap-6">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggle(topic.id, completed);
            }}
            className="flex-shrink-0 mt-1 focus:outline-none focus:ring-4 focus:ring-blue-100 rounded-full bg-white p-1"
          >
            {completed ? (
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            ) : (
              <Circle className="w-8 h-8 text-gray-300 hover:text-green-500 transition-all" />
            )}
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs font-black uppercase tracking-tighter text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">
                    Chapter {index + 1}
                  </span>
                  {topic.is_optional && (
                    <span className="text-[10px] bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-bold">
                      OPTIONAL
                    </span>
                  )}
                </div>
                <h3 className={`font-black text-xl leading-snug ${completed ? 'text-green-900 line-through opacity-70' : 'text-gray-900'}`}>
                  {topic.title}
                </h3>
              </div>
            </div>
            
            <p className="text-gray-500 text-sm mb-4 leading-relaxed line-clamp-2">
              {topic.description}
            </p>

            <div className="flex items-center gap-4 text-xs">
              <button
                className="text-blue-600 hover:text-blue-700 font-black flex items-center gap-1.5 uppercase tracking-wide px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 transition-all border border-blue-100"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded(!isExpanded);
                }}
              >
                <List className="w-4 h-4" />
                {topic.children?.length || 0} Topics
              </button>
              
              <button 
                className="text-gray-600 font-bold flex items-center gap-1 hover:text-blue-600 transition-colors"
                onClick={(e) => { e.stopPropagation(); setShowResources(!showResources); }}
              >
                 <ExternalLink size={14}/> {topic.resources?.length || 0} Links
              </button>
            </div>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="px-8 pb-8 pt-4 border-t border-gray-100 bg-gray-50/50">
          <div className="mb-8">
            <h4 className="text-sm font-black text-gray-900 mb-6 flex items-center gap-2 uppercase tracking-widest bg-white w-fit px-4 py-1 rounded-full border border-gray-100 shadow-sm animate-pulse">
              <BookOpen className="w-4 h-4 text-blue-600" />
              Sub Topics
            </h4>
            <div className="grid gap-3">
              {topic.children?.map((sub: any, idx: number) => {
                const subCompleted = !!progressMap[sub.id];
                return (
                  <div key={sub.id} className="group flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all">
                    <button onClick={() => onToggle(sub.id, subCompleted)} className="focus:outline-none">
                       {subCompleted ? <CheckCircle2 size={24} className="text-green-500"/> : <Circle size={24} className="text-gray-200 group-hover:text-blue-400 transition-colors"/>}
                    </button>
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-mono font-bold text-gray-400 bg-gray-50 p-1 rounded leading-none">{index + 1}.{idx + 1}</span>
                            <h5 className={`font-bold text-sm ${subCompleted ? 'text-gray-400 line-through' : 'text-gray-900'}`}>{sub.title}</h5>
                        </div>
                        <p className="text-xs text-gray-500 line-clamp-1">{sub.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Resources */}
          {showResources && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                  <h4 className="text-xs font-black text-gray-400 mb-4 uppercase tracking-widest pl-2">Recommended Resources</h4>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {topic.resources?.map((res: any, index: number) => (
                        <a key={index} href={res.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 hover:border-blue-500 hover:shadow-xl transition-all group">
                            <div className="w-10 h-10 bg-blue-50 text-blue-600 flex items-center justify-center rounded-xl font-black group-hover:bg-blue-600 group-hover:text-white transition-all">{res.type.charAt(0).toUpperCase()}</div>
                            <div className="flex-1 min-w-0">
                                <div className="font-bold text-sm text-gray-900 truncate">{res.title}</div>
                                <div className="text-[10px] text-gray-400 uppercase tracking-tighter">Reference Link</div>
                            </div>
                            <ExternalLink size={16} className="text-gray-200 group-hover:text-blue-600 transition-all"/>
                        </a>
                    ))}
                  </div>
              </div>
          )}
        </div>
      )}
    </div>
  );
}
