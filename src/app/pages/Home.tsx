import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Map, TrendingUp, User, Search, LogOut, LogIn } from 'lucide-react';
import { RoadmapCard } from '../components/RoadmapCard';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';

export function Home() {
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [roadmaps, setRoadmaps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRoadmaps() {
      try {
        const data = await api.getRoadmaps();
        setRoadmaps(data);
      } catch (err) {
        console.error("Failed to load roadmaps", err);
      } finally {
        setLoading(false);
      }
    }
    loadRoadmaps();
  }, []);

  const filteredRoadmaps = roadmaps.filter(roadmap => {
    const matchesSearch = roadmap.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         roadmap.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Map className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-xl text-gray-900">RoadmapHub</span>
            </Link>
            
            <nav className="flex items-center gap-4">
              {user ? (
                <>
                  <Link to="/profile" className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-700">
                    <User className="w-5 h-5" />
                    <span className="font-medium">Profile</span>
                  </Link>
                  <button onClick={logout} className="flex items-center gap-2 px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors font-medium">
                    <LogOut className="w-5 h-5" />
                  </button>
                </>
              ) : (
                <Link to="/login" className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium">Login</Link>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-bold mb-6">
            <TrendingUp size={16}/> TRACK YOUR LEARNING JOURNEY
          </div>
          <h1 className="text-6xl font-black text-gray-900 mb-6 tracking-tight">
            Master Your Skills with <br/>
            <span className="text-blue-600">Curated Roadmaps</span>
          </h1>
          <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto">Structured learning paths to help you land your dream job. Free, community-driven, and expert-verified.</p>
          
          <div className="relative max-w-2xl mx-auto">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"/>
             <input 
                type="text" 
                placeholder="Search roadmaps (e.g. Frontend, DevOps...)" 
                className="w-full pl-12 pr-6 py-4 rounded-2xl border-2 border-gray-100 focus:border-blue-500 outline-none shadow-sm transition-all text-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
             />
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="max-w-7xl mx-auto px-4 pb-20">
         {loading ? <div className="text-center font-bold">Fetching latest roadmaps...</div> : (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredRoadmaps.map(rm => (
                <RoadmapCard key={rm.id} roadmap={rm} />
              ))}
           </div>
         )}
      </section>
    </div>
  );
}
