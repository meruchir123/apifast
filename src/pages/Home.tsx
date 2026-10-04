import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, TrendingUp, Star, Users, BarChart3, Database, Zap, ArrowRight } from 'lucide-react';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { AnimeCard } from '../components/anime/AnimeCard';
import { StatCard } from '../components/analytics/StatCard';
import { CardSkeleton } from '../components/common/Loading';
import { getAnime, searchAnime } from '../api/anime';
import { MOCK_ANALYTICS_OVERVIEW } from '../data/mockData';
import type { Anime } from '../types/anime';
import { HERO_IMAGES, FALLBACK_IMAGE } from '../data/mockData';

const TRENDING_GENRES = ['Action', 'Fantasy', 'Romance', 'Sci-Fi', 'Mystery', 'Isekai'];

function HeroSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Anime[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!query.trim()) { setResults([]); setShowResults(false); return; }
    const timer = setTimeout(() => {
      setLoading(true);
      searchAnime(query)
        .then((r) => { setResults(r); setShowResults(true); })
        .finally(() => setLoading(false));
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="relative max-w-xl w-full">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
          <input
            type="search"
            placeholder="Search anime, genre, or keyword..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => results.length > 0 && setShowResults(true)}
            className="w-full pl-12 pr-4 py-3.5 text-sm bg-white/95 backdrop-blur border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-lg text-slate-800 placeholder-slate-400"
            aria-label="Search anime"
          />
        </div>
        <Button
          size="lg"
          onClick={() => navigate(`/explore${query ? `?q=${encodeURIComponent(query)}` : ''}`)}
          className="shrink-0 shadow-lg"
        >
          Search
        </Button>
      </div>

      {showResults && results.length > 0 && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowResults(false)} aria-hidden="true" />
          <div className="absolute top-full left-0 right-16 mt-2 bg-white rounded-xl border border-slate-200 shadow-xl z-50 overflow-hidden max-h-72 overflow-y-auto">
            {results.map((anime) => (
              <button
                key={anime.id}
                onClick={() => { navigate(`/anime/${anime.id}`); setShowResults(false); setQuery(''); }}
                className="flex items-center gap-3 px-4 py-3 w-full text-left hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0"
              >
                <img
                  src={anime.imageUrl}
                  alt={anime.title}
                  className="w-8 h-10 rounded object-cover shrink-0"
                  onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMAGE; }}
                />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">{anime.title}</p>
                  <p className="text-xs text-slate-500">{anime.genres.slice(0,2).join(', ')} • ★ {anime.score}</p>
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export function Home() {
  const navigate = useNavigate();
  const [popular, setPopular] = useState<Anime[]>([]);
  const [loadingPopular, setLoadingPopular] = useState(true);
  const stats = MOCK_ANALYTICS_OVERVIEW;

  useEffect(() => {
    getAnime({ sortBy: 'score', sortOrder: 'desc', limit: 6 })
      .then((r) => setPopular(r.data))
      .finally(() => setLoadingPopular(false));
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-white text-lg">AniVerse</span>
        </div>
        <div className="hidden md:flex items-center gap-6">
          {['Dashboard', 'Explore', 'Analytics', 'About'].map((item) => (
            <button
              key={item}
              onClick={() => navigate(item === 'About' ? '/' : `/${item.toLowerCase()}`)}
              className="text-sm text-white/80 hover:text-white transition-colors font-medium"
            >
              {item}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="text-white/80 hover:text-white hover:bg-white/10">Login</Button>
          <Button size="sm" className="shadow-lg">Sign Up</Button>
        </div>
      </nav>

      {/* Hero */}
      <section
        className="relative min-h-[600px] flex items-center justify-center text-center px-4 py-24 overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0f1117 0%, #1e1b4b 40%, #312e81 70%, #1e1b4b 100%)',
        }}
      >
        {/* Background overlay pattern */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle at 25% 25%, #6366f1 0%, transparent 50%), radial-gradient(circle at 75% 75%, #8b5cf6 0%, transparent 50%)'
        }} />

        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
            <TrendingUp className="w-3.5 h-3.5" />
            Data-driven anime insights
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-4 leading-tight">
            Explore.
            <span className="text-indigo-400"> Analyze.</span><br />
            Discover Anime.
          </h1>
          <p className="text-lg text-slate-300 mb-8 max-w-xl mx-auto">
            Data-driven insights from {stats.totalAnime.toLocaleString()}+ anime titles and {stats.totalReviews.toLocaleString()}+ community reviews.
          </p>

          <div className="flex justify-center mb-8">
            <HeroSearch />
          </div>

          {/* Trending genres */}
          <div className="flex flex-wrap justify-center gap-2">
            <span className="text-xs text-slate-400 mr-1 flex items-center">Trending:</span>
            {TRENDING_GENRES.map((genre) => (
              <button
                key={genre}
                onClick={() => navigate(`/explore?genre=${encodeURIComponent(genre)}`)}
                className="text-xs px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white border border-white/20 transition-all font-medium"
              >
                {genre}
              </button>
            ))}
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-white" />
      </section>

      {/* Stats Bar */}
      <section className="bg-white border-b border-slate-100 py-8 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: 'Anime Titles', value: stats.totalAnime.toLocaleString(), icon: <Database className="w-5 h-5" />, color: 'text-indigo-600' },
            { label: 'User Reviews', value: stats.totalReviews.toLocaleString(), icon: <Star className="w-5 h-5" />, color: 'text-violet-600' },
            { label: 'Genres', value: `${stats.totalGenres}+`, icon: <BarChart3 className="w-5 h-5" />, color: 'text-blue-600' },
            { label: 'Real-time Analytics', value: 'Live', icon: <TrendingUp className="w-5 h-5" />, color: 'text-emerald-600' },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className={`flex justify-center mb-2 ${s.color}`}>{s.icon}</div>
              <p className="text-3xl font-bold text-slate-900">{s.value}</p>
              <p className="text-sm text-slate-500 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Popular Anime */}
      <section className="py-14 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Top Rated Anime</h2>
              <p className="text-slate-500 text-sm mt-1">Highest scoring titles in the AniVerse catalog.</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => navigate('/explore')} icon={<ArrowRight className="w-4 h-4" />} iconPosition="right">
              View all
            </Button>
          </div>
          {loadingPopular ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              {popular.map((anime) => <AnimeCard key={anime.id} anime={anime} />)}
            </div>
          )}
        </div>
      </section>

      {/* Analytics Preview */}
      <section className="py-14 px-6 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Powered by Data Analytics</h2>
            <p className="text-slate-500 max-w-xl mx-auto">AniVerse is built on a professional data engineering pipeline — from ingestion to insights.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Genre Analysis', desc: 'Explore score and popularity distributions across 50+ genres.', icon: <BarChart3 className="w-6 h-6 text-indigo-600" />, path: '/analytics' },
              { title: 'Community Reviews', desc: 'Sentiment analysis and rating patterns from 130K+ community reviews.', icon: <Star className="w-6 h-6 text-violet-600" />, path: '/reviews' },
              { title: 'Data Pipeline', desc: 'Monitor Kafka → Airflow → Snowflake → PostgreSQL pipeline status.', icon: <Database className="w-6 h-6 text-emerald-600" />, path: '/pipeline' },
            ].map((feat) => (
              <button
                key={feat.title}
                onClick={() => navigate(feat.path)}
                className="text-left p-6 bg-white rounded-xl border border-slate-200 hover:border-indigo-200 hover:shadow-md transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center mb-4 group-hover:bg-indigo-50 transition-colors">
                  {feat.icon}
                </div>
                <h3 className="font-semibold text-slate-800 mb-1.5">{feat.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{feat.desc}</p>
                <div className="flex items-center gap-1 text-indigo-600 text-xs font-medium mt-3 group-hover:gap-2 transition-all">
                  Explore <ArrowRight className="w-3 h-3" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 bg-gradient-to-br from-indigo-600 to-violet-700 text-center">
        <h2 className="text-3xl font-bold text-white mb-3">Start Discovering Anime</h2>
        <p className="text-indigo-100 mb-6 max-w-md mx-auto">Search and filter 16,000+ anime titles with detailed stats and community reviews.</p>
        <Button
          size="lg"
          className="bg-white text-indigo-700 hover:bg-indigo-50 shadow-xl"
          onClick={() => navigate('/explore')}
          icon={<ArrowRight className="w-5 h-5" />}
          iconPosition="right"
        >
          Explore Anime
        </Button>
      </section>

      {/* Footer */}
      <footer className="bg-[#0f1117] py-8 px-6 text-center">
        <p className="text-slate-400 text-sm">© 2026 AniVerse • Explore. Analyze. Discover Anime.</p>
      </footer>
    </div>
  );
}
