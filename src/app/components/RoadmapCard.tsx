import { Link } from 'react-router';
import { BookOpen, Clock, Award, Calendar } from 'lucide-react';
import { Roadmap } from '../data/roadmaps';
import { getRoadmapProgress } from '../utils/progressStorage';

interface RoadmapCardProps {
  roadmap: Roadmap;
}

export function RoadmapCard({ roadmap }: RoadmapCardProps) {
  const topicIds = roadmap.topics.map(t => t.id);
  const progress = getRoadmapProgress(topicIds);

  const categoryColors = {
    tech: 'bg-blue-500/10 text-blue-600',
    management: 'bg-purple-500/10 text-purple-600',
    design: 'bg-pink-500/10 text-pink-600',
    'data-science': 'bg-green-500/10 text-green-600',
  };

  const difficultyColors = {
    beginner: 'bg-green-500/10 text-green-700',
    intermediate: 'bg-yellow-500/10 text-yellow-700',
    advanced: 'bg-red-500/10 text-red-700',
  };

  return (
    <Link
      to={`/roadmap/${roadmap.id}`}
      className="block bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-200 overflow-hidden group"
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
              {roadmap.title}
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              {roadmap.description}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${categoryColors[roadmap.category]}`}>
            {roadmap.category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
          </span>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${difficultyColors[roadmap.difficulty]}`}>
            {roadmap.difficulty.charAt(0).toUpperCase() + roadmap.difficulty.slice(1)}
          </span>
        </div>

        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-3 text-sm text-gray-600">
            <div className="flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" />
              <span>{roadmap.topics.length} Topics</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              <span>{roadmap.totalHours} Hours</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              <span>{roadmap.estimatedWeeks} Weeks</span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-gray-600 font-medium">Your Progress</span>
              <span className="text-blue-600 font-semibold">{Math.round(progress)}%</span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {progress === 100 && (
          <div className="mt-4 flex items-center gap-2 text-green-600 text-sm font-medium">
            <Award className="w-5 h-5" />
            <span>Completed!</span>
          </div>
        )}
      </div>
    </Link>
  );
}