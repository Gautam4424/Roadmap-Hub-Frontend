import { useState } from 'react';
import { CheckCircle2, Circle, Clock, ExternalLink, BookOpen, Video, FileText, Code, ChevronRight, List } from 'lucide-react';
import { Topic } from '../data/roadmaps';
import { isTopicCompleted, toggleTopicCompletion } from '../utils/progressStorage';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';

interface TopicNodeProps {
  topic: Topic;
  onToggle: () => void;
  index: number;
}

export function TopicNode({ topic, onToggle, index }: TopicNodeProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showResources, setShowResources] = useState(false);
  const completed = isTopicCompleted(topic.id) && user != null;

  const resourceIcons = {
    video: Video,
    article: FileText,
    course: BookOpen,
    documentation: Code,
  };

  const handleToggle = () => {
    if (!user) {
      if (window.confirm("You need to log in to track your progress. Go to login page?")) {
        navigate('/login');
      }
      return;
    }
    toggleTopicCompletion(topic.id);
    onToggle();
  };

  return (
    <div className={`border rounded-xl overflow-hidden transition-all ${
      completed ? 'border-green-300 bg-green-50/30' : 'border-gray-200 bg-white'
    }`}>
      <div
        className="p-5 cursor-pointer hover:bg-gray-50/50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start gap-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleToggle();
            }}
            className="flex-shrink-0 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-full"
          >
            {completed ? (
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            ) : (
              <Circle className="w-6 h-6 text-gray-400 hover:text-gray-600 transition-colors" />
            )}
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-blue-600">
                    Chapter {index + 1}
                  </span>
                  {topic.weekNumber && (
                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium">
                      Week {topic.weekNumber}
                    </span>
                  )}
                </div>
                <h3 className={`font-semibold text-lg ${completed ? 'text-green-900' : 'text-gray-900'}`}>
                  {topic.title}
                </h3>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-gray-500 flex-shrink-0">
                <Clock className="w-4 h-4" />
                <span>{topic.estimatedHours}h</span>
              </div>
            </div>
            
            <p className="text-gray-600 text-sm mb-3 leading-relaxed">
              {topic.description}
            </p>

            {topic.prerequisites && topic.prerequisites.length > 0 && (
              <div className="text-xs text-amber-700 bg-amber-50 px-2.5 py-1.5 rounded-md inline-block mb-3">
                ⚠️ Prerequisites required
              </div>
            )}

            <div className="flex items-center gap-2 text-sm">
              <button
                className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded(!isExpanded);
                }}
              >
                <List className="w-4 h-4" />
                {isExpanded ? 'Hide' : 'View'} Curriculum ({topic.subtopics.length} topics)
              </button>
            </div>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="px-5 pb-5 pt-2 border-t border-gray-100 bg-gray-50/50">
          {/* Subtopics - Book Index Style */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Detailed Curriculum
            </h4>
            <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100">
              {topic.subtopics.map((subtopic, idx) => (
                <div key={subtopic.id} className="p-4 hover:bg-blue-50/30 transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="text-xs font-mono font-semibold text-blue-600">
                          {index + 1}.{idx + 1}
                        </span>
                        <h5 className="font-medium text-gray-900">
                          {subtopic.title}
                        </h5>
                      </div>
                      <p className="text-sm text-gray-600 ml-8">
                        {subtopic.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500 flex-shrink-0">
                      <Clock className="w-3 h-3" />
                      <span>{subtopic.estimatedHours}h</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-3 text-xs text-gray-600 bg-blue-50 p-3 rounded-lg border border-blue-100">
              <span className="font-semibold">💡 Learning Tip:</span> Follow the curriculum in order for the best learning experience. Each subtopic builds on the previous one.
            </div>
          </div>

          {/* Resources Section */}
          <div>
            <button
              onClick={() => setShowResources(!showResources)}
              className="w-full flex items-center justify-between text-sm font-semibold text-gray-900 mb-3 hover:text-blue-600 transition-colors"
            >
              <span className="flex items-center gap-2">
                <ExternalLink className="w-4 h-4" />
                Learning Resources ({topic.resources.length})
              </span>
              <ChevronRight className={`w-4 h-4 transition-transform ${showResources ? 'rotate-90' : ''}`} />
            </button>
            
            {showResources && (
              <div className="space-y-2">
                {topic.resources.map((resource, index) => {
                  const Icon = resourceIcons[resource.type];
                  return (
                    <a
                      key={index}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all group bg-white"
                    >
                      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                        <Icon className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm text-gray-900 group-hover:text-blue-700 transition-colors">
                          {resource.title}
                        </div>
                        <div className="text-xs text-gray-500 capitalize">{resource.type}</div>
                      </div>
                      <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-600 flex-shrink-0 transition-colors" />
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
