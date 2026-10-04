import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { MobileNav } from './components/layout/MobileNav';
import { PageContainer } from './components/layout/PageContainer';
import { LoadingSkeleton } from './components/common/Loading';
// Lazy-loaded pages
const Home = lazy(() => import('./pages/Home').then((m) => ({ default: m.Home })));
const Dashboard = lazy(() => import('./pages/Dashboard').then((m) => ({ default: m.Dashboard })));
const Explore = lazy(() => import('./pages/Explore').then((m) => ({ default: m.Explore })));
const AnimeDetail = lazy(() => import('./pages/AnimeDetail').then((m) => ({ default: m.AnimeDetail })));
const Analytics = lazy(() => import('./pages/Analytics').then((m) => ({ default: m.Analytics })));
const Reviews = lazy(() => import('./pages/Reviews').then((m) => ({ default: m.Reviews })));
const Recommendations = lazy(() => import('./pages/Recommendations').then((m) => ({ default: m.Recommendations })));
const Pipeline = lazy(() => import('./pages/Pipeline').then((m) => ({ default: m.Pipeline })));
const Settings = lazy(() => import('./pages/Settings').then((m) => ({ default: m.Settings })));
function PageFallback() {
    return (<div className="space-y-4 p-6">
      <LoadingSkeleton className="h-6 w-48"/>
      <LoadingSkeleton className="h-4 w-72"/>
      <div className="grid grid-cols-4 gap-4 mt-6">
        {Array.from({ length: 4 }).map((_, i) => (<LoadingSkeleton key={i} className="h-28 rounded-xl"/>))}
      </div>
      <LoadingSkeleton className="h-64 rounded-xl"/>
    </div>);
}
function AppLayout({ title, subtitle, children }) {
    return (<div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <MobileNav />
        <Header title={title} subtitle={subtitle}/>
        <PageContainer>
          <Suspense fallback={<PageFallback />}>{children}</Suspense>
        </PageContainer>
      </div>
    </div>);
}
export default function App() {
    return (<BrowserRouter>
      <Routes>
        {/* Landing page — full page, no layout shell */}
        <Route path="/" element={<Suspense fallback={<div className="h-screen bg-[#0f1117] flex items-center justify-center text-white text-sm">Loading AniVerse…</div>}>
              <Home />
            </Suspense>}/>

        {/* App pages — wrapped in layout */}
        <Route path="/dashboard" element={<AppLayout title="Dashboard" subtitle="Key insights from anime data and community reviews.">
              <Dashboard />
            </AppLayout>}/>
        <Route path="/explore" element={<AppLayout title="Explore Anime" subtitle="Search and discover anime from the AniVerse catalog.">
              <Explore />
            </AppLayout>}/>
        <Route path="/anime/:id" element={<AppLayout title="Anime Detail" subtitle="Detailed information, stats, and reviews.">
              <AnimeDetail />
            </AppLayout>}/>
        <Route path="/analytics" element={<AppLayout title="Anime Analytics" subtitle="Explore trends, distributions and correlations.">
              <Analytics />
            </AppLayout>}/>
        <Route path="/reviews" element={<AppLayout title="Community Reviews" subtitle="Read and analyze user reviews with sentiment analysis.">
              <Reviews />
            </AppLayout>}/>
        <Route path="/recommendations" element={<AppLayout title="Anime Recommendations" subtitle="Personalized picks based on community ratings and genre analysis.">
              <Recommendations />
            </AppLayout>}/>
        <Route path="/pipeline" element={<AppLayout title="Data Pipeline" subtitle="Monitor data ingestion, transformation and processing.">
              <Pipeline />
            </AppLayout>}/>
        <Route path="/settings" element={<AppLayout title="Settings" subtitle="Manage your account, preferences, and API configuration.">
              <Settings />
            </AppLayout>}/>

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace/>}/>
      </Routes>
    </BrowserRouter>);
}
