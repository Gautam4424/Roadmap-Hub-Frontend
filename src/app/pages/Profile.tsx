import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { ArrowLeft, Award, BookOpen, Clock, TrendingUp, User, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';

export function Profile() {
  const { user } = useAuth();
  
  const [roadmaps, setRoadmaps] = useState<any[]>([]);
  const [roadmapStats, setRoadmapStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAllData() {
      if (!user) return;
      try {
        const rms = await api.getRoadmaps();
        setRoadmaps(rms);

        const statsPromises = rms.map(async (roadmap: any) => {
          // getProgress returns { "node_uuid": true|false }
          const pMap = await api.getProgress(roadmap.id);
          const completedCount = Object.keys(pMap).filter(k => pMap[k]).length;
          const totalNodes = roadmap.total_nodes || 1; // avoid /0
          const progressPercent = (completedCount / totalNodes) * 100;
          return {
            roadmap,
            progress: progressPercent,
            completed: completedCount,
            total: roadmap.total_nodes || 0
          };
        });

        const stats = await Promise.all(statsPromises);
        setRoadmapStats(stats);
      } catch (e) {
        console.error("Error fetching profile data", e);
      } finally {
        setLoading(false);
      }
    }
    fetchAllData();
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 text-center border border-gray-100">
          <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">You aren't logged in</h2>
          <p className="text-gray-600 mb-6 text-sm">Create an account or login to track your learning journey and save your progress.</p>
          <div className="flex flex-col gap-3">
            <Link to="/login" className="w-full bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors shadow-md">
              Sign In
            </Link>
            <Link to="/register" className="w-full bg-gray-100 text-gray-800 font-semibold py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors">
              Create Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const allTopicIds = roadmapStats.reduce((acc, curr) => acc + curr.total, 0);
  const completedCount = roadmapStats.reduce((acc, curr) => acc + curr.completed, 0);
  const totalProgress = allTopicIds > 0 ? (completedCount / allTopicIds) * 100 : 0;
  
  const completedRoadmaps = roadmapStats.filter(stat => stat.progress >= 100);
  const inProgressRoadmaps = roadmapStats.filter(stat => stat.progress > 0 && stat.progress < 100);
  const notStartedRoadmaps = roadmapStats.filter(stat => stat.progress === 0);

  const totalHoursCompleted = roadmapStats.reduce((acc, stat) => {
    // Approx completion of hours
    const percent = stat.progress / 100;
    const hours = (stat.roadmap.estimated_hours || 0) * percent;
    return acc + Math.round(hours);
  }, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link to="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Roadmaps</span>
            </Link>
          </div>
        </div>
      </header>

      {loading ? (
        <div className="p-20 text-center font-bold">Loading Profile...</div>
      ) : (
        <>
          <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row items-center gap-6 mb-8 text-center sm:text-left">
                <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center flex-shrink-0 border-4 border-white/20 shadow-xl">
                  <User className="w-12 h-12" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold mb-1">{user.username}</h1>
                  <p className="text-white/80 font-medium mb-1">{user.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <BookOpen className="w-6 h-6" />
                    <span className="text-sm font-medium">Topics Completed</span>
                  </div>
                  <p className="text-3xl font-bold">{completedCount}</p>
                  <p className="text-sm text-white/80 mt-1">out of {allTopicIds}</p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Clock className="w-6 h-6" />
                    <span className="text-sm font-medium">Hours Learned</span>
                  </div>
                  <p className="text-3xl font-bold">{totalHoursCompleted}</p>
                  <p className="text-sm text-white/80 mt-1">of study time</p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Award className="w-6 h-6" />
                    <span className="text-sm font-medium">Roadmaps Done</span>
                  </div>
                  <p className="text-3xl font-bold">{completedRoadmaps.length}</p>
                  <p className="text-sm text-white/80 mt-1">out of {roadmaps.length}</p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <TrendingUp className="w-6 h-6" />
                    <span className="text-sm font-medium">Overall Progress</span>
                  </div>
                  <p className="text-3xl font-bold">{Math.round(totalProgress)}%</p>
                  <div className="w-full h-2 bg-white/20 rounded-full mt-2">
                    <div
                      className="h-full bg-white rounded-full transition-all duration-500"
                      style={{ width: `${totalProgress}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8">
              {completedRoadmaps.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Award className="w-6 h-6 text-green-600" />
                    Completed Roadmaps
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {completedRoadmaps.map(({ roadmap, completed, total }) => (
                      <Link
                        key={roadmap.id}
                        to={`/roadmap/${roadmap.slug}`}
                        className="bg-white rounded-xl border-2 border-green-200 p-6 hover:border-green-300 hover:shadow-lg transition-all"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="font-semibold text-lg text-gray-900">{roadmap.title}</h3>
                          <Award className="w-6 h-6 text-green-600 flex-shrink-0" />
                        </div>
                        <div className="flex items-center gap-2 text-sm text-green-700 font-medium mb-2">
                          <span>✓ All {total} topics completed</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {inProgressRoadmaps.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <TrendingUp className="w-6 h-6 text-blue-600" />
                    In Progress
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {inProgressRoadmaps.map(({ roadmap, progress, completed, total }) => (
                      <Link
                        key={roadmap.id}
                        to={`/roadmap/${roadmap.slug}`}
                        className="bg-white rounded-xl border border-gray-200 p-6 hover:border-blue-300 hover:shadow-lg transition-all"
                      >
                        <h3 className="font-semibold text-lg text-gray-900 mb-3">{roadmap.title}</h3>
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-gray-600">{completed} / {total} topics</span>
                          <span className="font-semibold text-blue-600">{Math.round(progress)}%</span>
                        </div>
                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {notStartedRoadmaps.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <BookOpen className="w-6 h-6 text-gray-600" />
                    Ready to Start
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {notStartedRoadmaps.map(({ roadmap, total }) => (
                      <Link
                        key={roadmap.id}
                        to={`/roadmap/${roadmap.slug}`}
                        className="bg-white rounded-xl border border-gray-200 p-6 hover:border-blue-300 hover:shadow-lg transition-all group"
                      >
                        <h3 className="font-semibold text-lg text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                          {roadmap.title}
                        </h3>
                        <div className="text-sm text-gray-600 mb-2">
                          {total} topics • {roadmap.estimated_hours} hours
                        </div>
                        <div className="text-sm text-blue-600 font-medium">
                          Start learning →
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
