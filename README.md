# AniVerse 🌟

> **Explore. Analyze. Discover Anime.**

AniVerse is a production-quality, full-stack anime analytics and discovery platform frontend built with React, JavaScript, Vite, and Tailwind CSS. It is designed for seamless integration with a FastAPI + PostgreSQL + Airflow + Kafka backend.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🏠 **Landing Page** | Hero with search, trending genres, top-rated anime, analytics preview |
| 📊 **Dashboard** | KPI cards, release trend, score distribution, top genres, top-rated list |
| 🔍 **Explore Anime** | Search, genre/score filters, sortable grid with pagination |
| 🎬 **Anime Detail** | Full info page with synopsis, stats, community reviews, recommendations |
| 📈 **Analytics** | 5-tab analytics: overview, genre, rating, review, release trends |
| 💬 **Reviews** | Community reviews with sentiment badges, filters, pagination |
| ⭐ **Recommendations** | Top picks, hidden gems, genre-based discovery |
| 🔧 **Pipeline Monitor** | Real-time pipeline status flow + DAG run history table |
| ⚙️ **Settings** | Profile, appearance, notifications, API status |

---

## 🛠 Frontend Stack

| Technology | Purpose |
|---|---|
| React 19 | UI framework |
| JavaScript (ES6+ / JSX) | Application logic & components |
| Vite 8 | Build tool & dev server |
| Tailwind CSS v4 | Utility-first styling |
| React Router v7 | Client-side routing |
| Recharts | Data visualization charts |
| Lucide React | Icon library |

---

## 🏗 Architecture

```
React (Vite) ──► FastAPI ──► PostgreSQL
                    ▲
         Kafka ──► Airflow ──► Databricks
                    ▲
              Data Sources (Anime APIs / Datasets)
```

### Frontend Structure

```
src/
├── api/            # Service layer (swap mock → FastAPI calls here)
│   ├── client.js       # Configurable HTTP client abstraction
│   ├── anime.js
│   ├── reviews.js
│   ├── analytics.js
│   ├── recommendations.js
│   └── pipeline.js
├── components/     # Reusable components
│   ├── layout/         # Sidebar, Header, MobileNav, PageContainer
│   ├── anime/          # AnimeCard, AnimeGrid, AnimeSearch, AnimeFilters
│   ├── reviews/        # ReviewCard, ReviewList, ReviewFilters
│   ├── analytics/      # StatCard, ChartCard, GenreChart, TrendChart…
│   ├── pipeline/       # PipelineStatus, PipelineRunsTable
│   └── common/         # Button, Badge, Modal, Loading, EmptyState, ErrorState
├── pages/          # Route-level page components (.jsx)
├── hooks/          # useAsync.js, useDebounce.js
├── data/           # mockData.js — centralized mock data
└── utils/
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm

### Install & Run

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

Open [http://localhost:5173](http://localhost:5173)

---

## 🔌 Backend Integration

The frontend is **fully mock-data driven** today and ready for FastAPI integration.

### 1. Set your API base URL

Create a `.env` file:

```env
VITE_API_BASE_URL=http://localhost:8000
```

### 2. Replace mock service functions

Each file in `src/api/` contains functions that currently return mock data. Replace them with real API calls:

```js
// src/api/anime.js — before (mock)
export async function getAnime(params) {
  return simulateDelay(filterMockData(params));
}

// After (FastAPI)
export async function getAnime(params) {
  return apiClient.get('/api/anime', params);
}
```

### Planned API Routes

```
GET  /api/anime                     # Anime list with filters
GET  /api/anime/{id}                # Anime detail
GET  /api/anime/search              # Search
GET  /api/anime/{id}/reviews        # Reviews for anime
GET  /api/genres                    # Genre list
GET  /api/analytics/overview        # KPI summary
GET  /api/analytics/genres          # Genre analytics
GET  /api/analytics/ratings         # Score distribution
GET  /api/analytics/trends          # Release trends
GET  /api/reviews                   # All reviews with filters
GET  /api/recommendations/{id}      # ML-based recommendations
GET  /api/pipeline/status           # Pipeline node statuses
GET  /api/pipeline/runs             # DAG run history
```

---

## 📦 Mock Data

All mock data lives in [`src/data/mockData.js`](src/data/mockData.js):

- **20 anime** with full metadata (score, rank, popularity, genres, synopsis)
- **20 community reviews** with sentiment labels
- **15 genres** with analytics (count, avg score)
- **Analytics datasets**: score distribution, release trends, scatter data
- **8 pipeline runs** with realistic DAG names and statuses

---

## 🗺 Routes

| Route | Page |
|---|---|
| `/` | Landing page |
| `/dashboard` | Analytics dashboard |
| `/explore` | Anime discovery |
| `/anime/:id` | Anime detail |
| `/analytics` | Deep analytics |
| `/reviews` | Community reviews |
| `/recommendations` | Recommendations |
| `/pipeline` | Data pipeline monitor |
| `/settings` | Settings |

---

## 🎨 Design System

- **Colors**: Navy sidebar (`#0f1117`), white content area, indigo/violet accents
- **Typography**: Inter (Google Fonts)
- **Components**: Rounded cards, subtle shadows, clean borders
- **Charts**: Recharts with consistent indigo/violet palette
- **Responsive**: Mobile-first with collapsible sidebar + drawer nav

---

## 🔮 Planned Backend

The backend will be built with:

- **FastAPI** — REST API
- **PostgreSQL** — Operational database
- **Airflow** — ETL orchestration
- **Kafka** — Event streaming
- **Databricks** — Lakehouse platform
- **Python ML** — Content-based recommendation engine

---

*Built as a full-stack data engineering portfolio project.*
