import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { ArrowLeft, BookOpen, Clock, Award, TrendingUp, Calendar, LogIn, LogOut, User } from 'lucide-react';
import { roadmaps } from '../data/roadmaps';
import { TopicNode } from '../components/TopicNode';
import { getRoadmapProgress } from '../utils/progressStorage';
import { useAuth } from '../context/AuthContext';

export function RoadmapDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const roadmap = roadmaps.find(r => r.id === id);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (roadmap) {
      const topicIds = roadmap.topics.map(t => t.id);
      setProgress(getRoadmapProgress(topicIds));
    }
  }, [roadmap]);

  const handleProgressUpdate = () => {
    if (roadmap) {
      const topicIds = roadmap.topics.map(t => t.id);
      setProgress(getRoadmapProgress(topicIds));
    }
  };

  if (!roadmap) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Roadmap not found</h2>
          <Link to="/" className="text-blue-600 hover:text-blue-700 font-medium">
            ← Back to home
          </Link>
        </div>
      </div>
    );
  }

  const completedTopics = roadmap.topics.filter(t => {
    const topicIds = roadmap.topics.map(topic => topic.id);
    const currentProgress = getRoadmapProgress(topicIds);
    return currentProgress > 0;
  }).length;

  const categoryColors = {
    tech: 'from-blue-600 to-blue-700',
    management: 'from-purple-600 to-purple-700',
    design: 'from-pink-600 to-pink-700',
    'data-science': 'from-green-600 to-green-700',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Roadmaps</span>
            </button>
            
            <div className="flex items-center gap-4">
              {user ? (
                <>
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors font-medium text-gray-700"
                  >
                    <User className="w-5 h-5" />
                    <span className="hidden sm:inline">Profile</span>
                  </Link>
                  <button
                    onClick={logout}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors font-medium border border-transparent"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors font-medium text-gray-700"
                  >
                    <LogIn className="w-5 h-5" />
                    <span>Login</span>
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className={`bg-gradient-to-r ${categoryColors[roadmap.category]} text-white py-12`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
            <div className="flex-1">
              <div className="inline-block bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium mb-4">
                {roadmap.category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} • {roadmap.difficulty.charAt(0).toUpperCase() + roadmap.difficulty.slice(1)}
              </div>
              
              <h1 className="text-4xl font-bold mb-4">{roadmap.title}</h1>
              <p className="text-lg text-white/90 mb-6 max-w-3xl">{roadmap.description}</p>
              
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  <span>{roadmap.topics.length} Chapters</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>{roadmap.totalHours} Total Hours</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span>{roadmap.estimatedWeeks} Weeks</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  <span>{completedTopics} Completed</span>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 md:w-80">
              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold">Overall Progress</span>
                <span className="text-2xl font-bold">{Math.round(progress)}%</span>
              </div>
              <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden mb-4">
                <div
                  className="h-full bg-white rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              {progress === 100 && (
                <div className="flex items-center gap-2 text-white bg-white/20 rounded-lg px-3 py-2">
                  <Award className="w-5 h-5" />
                  <span className="font-medium">Roadmap Completed! 🎉</span>
                </div>
              )}
              {progress < 100 && (
                <p className="text-sm text-white/80">
                  {roadmap.topics.length - completedTopics} chapters remaining
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Topics Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Timeline Info */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100 p-6 mb-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-2">📅 Learning Timeline</h3>
                <p className="text-gray-700 mb-3">
                  This roadmap is designed to be completed in approximately <span className="font-semibold text-blue-600">{roadmap.estimatedWeeks} weeks</span> with consistent study. 
                  Each chapter includes a recommended week number to help you stay on track.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                  <div className="bg-white rounded-lg p-3 border border-blue-200">
                    <div className="text-gray-600">Daily Commitment</div>
                    <div className="font-semibold text-gray-900">{Math.round((roadmap.totalHours / roadmap.estimatedWeeks) / 7 * 10) / 10} hrs/day</div>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-blue-200">
                    <div className="text-gray-600">Weekly Commitment</div>
                    <div className="font-semibold text-gray-900">{Math.round(roadmap.totalHours / roadmap.estimatedWeeks)} hrs/week</div>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-blue-200">
                    <div className="text-gray-600">Total Chapters</div>
                    <div className="font-semibold text-gray-900">{roadmap.topics.length} chapters</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">📚 Complete Curriculum</h2>
            <p className="text-gray-600 mb-6">
              Follow these chapters in order for the best learning experience. Click on each chapter to view the detailed curriculum (like a book index) and learning resources.
            </p>

            <div className="space-y-4">
              {roadmap.topics.map((topic, index) => (
                <div key={topic.id} className="relative">
                  {index < roadmap.topics.length - 1 && (
                    <div className="absolute left-3 top-12 bottom-0 w-0.5 bg-gray-200 -mb-4" />
                  )}
                  <TopicNode topic={topic} onToggle={handleProgressUpdate} index={index} />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100 p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">💡 Tips for Success</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0 mt-0.5">1</div>
                <p className="text-gray-700">Follow the chapters in order - each builds on the previous one</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0 mt-0.5">2</div>
                <p className="text-gray-700">Expand each chapter to see the detailed curriculum breakdown (like a book's table of contents)</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0 mt-0.5">3</div>
                <p className="text-gray-700">Use multiple resources for each topic to get different perspectives</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0 mt-0.5">4</div>
                <p className="text-gray-700">Practice what you learn with real projects and exercises</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0 mt-0.5">5</div>
                <p className="text-gray-700">Track your progress regularly to stay motivated and on schedule</p>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}