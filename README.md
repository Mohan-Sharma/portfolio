# Interactive Portfolio - Production-Grade Architecture

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Svelte](https://img.shields.io/badge/Svelte-5.x-orange.svg)](https://svelte.dev/)
[![SvelteKit](https://img.shields.io/badge/SvelteKit-2.x-orange.svg)](https://kit.svelte.dev/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

> Enterprise-grade portfolio showcasing **Clean Architecture**, **SOLID principles**, and modern **Svelte 5** + **SvelteKit** capabilities.

---

## 🎯 Project Overview

An interactive, responsive portfolio application built with **production-grade architecture** demonstrating:

- ✅ **Clean Architecture** with clear separation of concerns
- ✅ **Repository Pattern** for data access abstraction
- ✅ **Service Layer** for business logic encapsulation
- ✅ **Zod Validation** for runtime type safety
- ✅ **TypeScript** for compile-time type safety
- ✅ **Svelte 5** with runes for reactive UI
- ✅ **Zero API Routes** (direct service imports for performance)
- ✅ **Database-Ready** (easy migration from JSON to PostgreSQL)

---

## 🏗️ Architecture Highlights

### Layered Architecture

```
+page.svelte (Presentation)
    ↓
+page.server.ts (Server Entry)
    ↓
CVService (Business Logic)
    ↓
CVRepository (Data Access)
    ↓
Zod Schemas (Validation)
    ↓
JSON Files (Current) → PostgreSQL (Future)
```

**📖 Read the full architecture documentation:** [`docs/architecture/NEW-ARCHITECTURE.md`](docs/architecture/NEW-ARCHITECTURE.md)

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 20+ (LTS recommended)
- **pnpm** 9+ (faster than npm)

### Installation

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
# Type check
pnpm check

# Build static site
pnpm build

# Preview production build
pnpm preview
```

---

## 📁 Project Structure

```
portfolio/
├── src/
│   ├── lib/
│   │   ├── server/              # ⭐ SERVER-ONLY CODE
│   │   │   ├── services/        # Business logic
│   │   │   └── repositories/    # Data access
│   │   ├── schemas/             # ⭐ ZOD VALIDATION
│   │   ├── components/          # UI components
│   │   ├── stores/              # Client state
│   │   └── utils/               # Utilities
│   └── routes/                  # SvelteKit routes
│
├── data/                        # ⭐ JSON "DATABASE"
│   ├── personal.json
│   ├── experience.json
│   └── ...
│
└── docs/                        # Documentation
    └── architecture/
        └── NEW-ARCHITECTURE.md  # Full architecture guide
```

---

## 🛠️ Tech Stack

- **[Svelte 5](https://svelte.dev/)** - Reactive UI with runes
- **[SvelteKit 2](https://kit.svelte.dev/)** - Fullstack framework
- **[TypeScript 5](https://www.typescriptlang.org/)** - Type safety
- **[Zod 3](https://zod.dev/)** - Runtime validation
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Utility-first styling
- **[Vite 7](https://vitejs.dev/)** - Build tool

---

## 📝 Available Scripts

```bash
pnpm dev              # Start dev server
pnpm check            # Type check
pnpm build            # Build for production
pnpm preview          # Preview production build
```

---

## 📦 Deployment

Build generates static files compatible with **any web host**:

- **Vercel** - Zero-config deployment
- **Netlify** - Drag & drop
- **Hostinger** - Upload via FTP
- **GitHub Pages** - Free static hosting
- **AWS S3** - Enterprise CDN

```bash
pnpm build
# Upload build/ folder to your host
```

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| **[NEW-ARCHITECTURE.md](docs/architecture/NEW-ARCHITECTURE.md)** | Complete architecture guide |
| **[DEVELOPMENT-GUIDELINES.md](docs/DEVELOPMENT-GUIDELINES.md)** | Coding standards |
| **[plan.md](plan.md)** | Development roadmap |

---

**Built with ❤️ using Svelte 5, SvelteKit, and enterprise-grade architecture principles.**
