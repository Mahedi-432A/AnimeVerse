# AnimeVerse

A high-performance, visually stunning anime discovery web application built with Next.js 15, TypeScript, and modern web technologies.

## 🚀 Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript (Strict mode)
- **Styling:** Tailwind CSS + tailwind-merge + clsx
- **Animations:** Framer Motion
- **Data Fetching:** TanStack Query v5
- **Icons:** Lucide React
- **API:** Jikan API v4
- **State Management:** Zustand

## ✨ Features

- 🎬 Immersive Hero Section with Parallax Effects
- 🎨 Cosmic Dark Theme with Glassmorphism
- 🚀 Advanced Search with Debouncing
- ♾️ Infinite Scroll Grid
- 🎭 Shared Element Transitions
- ⚡ Rate-Limited API Calls

## 🛠️ Getting Started

First, install dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🎯 Project Structure

```
src/
├── app/              # Next.js App Router pages
├── components/       # React components
│   ├── ui/          # Reusable UI components
│   ├── animations/  # Animation wrappers
│   ├── hero/        # Hero section components
│   └── anime/       # Anime-specific components
├── lib/             # Utilities and configurations
│   ├── api.ts       # Jikan API with rate limiting
│   ├── utils.ts     # Helper functions
│   └── store.ts     # Zustand store
└── hooks/           # Custom React hooks
```

## 🔥 API Rate Limiting

This project implements intelligent rate limiting for the Jikan API:
- 400ms delay between requests
- Automatic retry on errors
- Request/response interceptors

## 📝 License

MIT
