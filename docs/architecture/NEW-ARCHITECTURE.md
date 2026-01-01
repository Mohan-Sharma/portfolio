# Enterprise-Grade Architecture Documentation

**Last Updated**: December 31, 2025
**Architecture Version**: 2.0
**Status**: ✅ Production Ready

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Architecture Overview](#architecture-overview)
3. [Layer-by-Layer Breakdown](#layer-by-layer-breakdown)
4. [Design Patterns & Principles](#design-patterns--principles)
5. [Technology Stack](#technology-stack)
6. [Folder Structure](#folder-structure)
7. [Data Flow](#data-flow)
8. [Migration Path (JSON → Database)](#migration-path)
9. [Performance Considerations](#performance-considerations)
10. [Testing Strategy](#testing-strategy)

---

## Executive Summary

This portfolio application follows **Clean Architecture** principles with clear separation of concerns across multiple layers. The architecture is designed to be:

- ✅ **Maintainable**: Clear separation of concerns, single responsibility
- ✅ **Extensible**: Easy to add new features without touching existing code
- ✅ **Testable**: Business logic isolated from framework and data access
- ✅ **Performant**: Smart caching, minimal overhead
- ✅ **Type-Safe**: Zod schemas + TypeScript for runtime and compile-time safety
- ✅ **Database-Ready**: Trivial to swap JSON files for PostgreSQL/MySQL

### Key Architectural Decisions

| Decision | Rationale |
|----------|-----------|
| **No API Routes** | Fullstack monolith - unnecessary HTTP overhead |
| **Repository Pattern** | Abstracts data access, easy to swap data sources |
| **Service Layer** | Encapsulates business logic, reusable across routes |
| **Zod Schemas** | Runtime validation + TypeScript type inference (single source of truth) |
| **Direct Service Imports** | Server routes call services directly (no HTTP) |

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                      PRESENTATION LAYER                          │
│  +page.svelte (Client-Side UI Components)                       │
│  - Svelte 5 with runes ($state, $derived, $props)              │
│  - No business logic, pure presentation                         │
└────────────────────────┬────────────────────────────────────────┘
                         │ receives typed data
                         ↓
┌─────────────────────────────────────────────────────────────────┐
│                      SERVER ENTRY POINT                          │
│  +page.server.ts (SvelteKit Server Load Function)              │
│  - Runs on server during SSR                                    │
│  - Direct imports (no HTTP)                                     │
│  - Error boundary                                               │
└────────────────────────┬────────────────────────────────────────┘
                         │ imports & calls
                         ↓
┌─────────────────────────────────────────────────────────────────┐
│                      SERVICE LAYER                               │
│  $lib/server/services/cv.service.ts                            │
│  - Business logic                                               │
│  - Data aggregation                                             │
│  - Calculations (years of experience, stats)                    │
│  - Orchestrates multiple repositories                           │
└────────────────────────┬────────────────────────────────────────┘
                         │ calls
                         ↓
┌─────────────────────────────────────────────────────────────────┐
│                      REPOSITORY LAYER                            │
│  $lib/server/repositories/cv.repository.ts                     │
│  - Data access abstraction                                      │
│  - CRUD operations                                              │
│  - Validation (Zod schemas)                                     │
│  - Caching                                                      │
└────────────────────────┬────────────────────────────────────────┘
                         │ validates with
                         ↓
┌─────────────────────────────────────────────────────────────────┐
│                      SCHEMA LAYER                                │
│  $lib/schemas/cv.schema.ts (Zod)                               │
│  - Runtime validation                                           │
│  - TypeScript type inference                                    │
│  - Single source of truth                                       │
└────────────────────────┬────────────────────────────────────────┘
                         │ reads from
                         ↓
┌─────────────────────────────────────────────────────────────────┐
│                      DATA STORAGE                                │
│  data/*.json (Current) → PostgreSQL/MySQL (Future)             │
│  - JSON files (development/simple deployments)                  │
│  - Database (production)                                        │
└─────────────────────────────────────────────────────────────────┘
```

---

## Layer-by-Layer Breakdown

### 1. Presentation Layer (`src/routes/+page.svelte`)

**Responsibility**: Render UI components

```svelte
<script lang="ts">
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();

  // Transform data for display
  let bookPages = $derived(mapCVDataToBookPages(data.cvData, data.yearsOfExperience));
</script>

<!-- Pure presentation, no business logic -->
<PageContent page={bookPages[currentPageIndex]!} />
```

**Characteristics**:
- ✅ No business logic
- ✅ No data fetching
- ✅ Receives pre-processed data from server
- ✅ Uses Svelte 5 runes for reactivity

---

### 2. Server Entry Point (`src/routes/+page.server.ts`)

**Responsibility**: Load data for SSR, handle errors

```typescript
import { cvService } from '$lib/server/services/cv.service';

export const load: PageServerLoad = async () => {
  try {
    // Direct service call - NO HTTP overhead!
    const cvData = cvService.getCompleteCV();
    const yearsOfExperience = cvService.calculateYearsOfExperience();
    const statistics = cvService.getCVStatistics();

    return { cvData, yearsOfExperience, statistics };
  } catch (err) {
    throw error(500, 'Failed to load portfolio data');
  }
};
```

**Key Points**:
- ✅ **Direct imports** - no `fetch()` calls
- ✅ **Type-safe** - full TypeScript inference
- ✅ **Error handling** - catches and logs errors
- ✅ **Prerender-enabled** - static generation at build time

---

### 3. Service Layer (`src/lib/server/services/cv.service.ts`)

**Responsibility**: Business logic, data orchestration

```typescript
export class CVService {
  /**
   * Get complete CV data
   * Aggregates all sections into a single object
   */
  getCompleteCV(): CVData {
    const personal = cvRepository.getPersonalInfo();
    const about = cvRepository.getAbout();

    return {
      personal,
      socials: cvRepository.getSocialLinks(),
      summary: about.summary,
      experience: cvRepository.getAllExperience(),
      projects: cvRepository.getAllProjects(),
      skills: cvRepository.getSkills(),
      education: cvRepository.getAllEducation(),
      achievements: cvRepository.getAllAchievements()
    };
  }

  /**
   * Calculate total years of professional experience
   * Business Rule: From earliest start date to now
   */
  calculateYearsOfExperience(): number {
    const experiences = cvRepository.getAllExperience();
    // ... calculation logic
  }

  /**
   * Get technology usage statistics
   * Useful for highlighting most-used skills
   */
  getTechnologyUsageStats(): Record<string, number> {
    // ... aggregation logic
  }
}

export const cvService = new CVService(); // Singleton
```

**Characteristics**:
- ✅ **Pure business logic** - no framework dependencies
- ✅ **Testable** - easy to unit test in isolation
- ✅ **Reusable** - can be called from multiple routes
- ✅ **No data access** - delegates to repositories

---

### 4. Repository Layer (`src/lib/server/repositories/cv.repository.ts`)

**Responsibility**: Data access, validation, caching

```typescript
export class CVRepository {
  /**
   * Get all work experience entries
   * Validated and cached
   */
  getAllExperience(): Experience[] {
    const experiences = loadAndValidateJSON(
      'experience.json',
      ExperienceSchema.array(),
      'experience'
    );

    // Sort by date (most recent first)
    return experiences.sort((a, b) => {
      const dateA = new Date(a.startDate);
      const dateB = new Date(b.startDate);
      return dateB.getTime() - dateA.getTime();
    });
  }

  /**
   * Generic JSON loader with validation
   */
  private loadAndValidateJSON<T>(
    filename: string,
    schema: ZodSchema<T>,
    cacheKey: string
  ): T {
    // 1. Check cache
    const cached = getCached<T>(cacheKey);
    if (cached) return cached;

    // 2. Read file
    const rawData = readFileSync(join(process.cwd(), 'data', filename), 'utf-8');

    // 3. Parse JSON
    const jsonData = JSON.parse(rawData);

    // 4. Validate with Zod
    const validatedData = schema.parse(jsonData);

    // 5. Cache result
    setCache(cacheKey, validatedData);

    return validatedData;
  }
}

export const cvRepository = new CVRepository(); // Singleton
```

**Characteristics**:
- ✅ **Data source abstraction** - easy to swap JSON → DB
- ✅ **Validation at boundary** - Zod schemas ensure data integrity
- ✅ **Smart caching** - configurable TTL (5 min prod, 0 dev)
- ✅ **No business logic** - pure data access

---

### 5. Schema Layer (`src/lib/schemas/cv.schema.ts`)

**Responsibility**: Runtime validation + TypeScript types

```typescript
import { z } from 'zod';

/**
 * Experience Schema
 * Validates incoming data and provides TypeScript types
 */
export const ExperienceSchema = z.object({
  id: z.string().min(1, 'Experience ID is required'),
  title: z.string().min(1, 'Job title is required'),
  company: z.string().min(1, 'Company name is required'),
  location: z.string().min(1, 'Location is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().nullable(),
  current: z.boolean(),
  description: z.string().min(1, 'Description is required'),
  technologies: z.array(z.string()).min(1, 'At least one technology is required')
});

/**
 * Infer TypeScript type from Zod schema
 * Single source of truth!
 */
export type Experience = z.infer<typeof ExperienceSchema>;
```

**Benefits**:
- ✅ **Single source of truth** - schema defines both validation and types
- ✅ **Runtime safety** - catches bad data before it enters the system
- ✅ **Compile-time safety** - TypeScript catches type errors
- ✅ **Self-documenting** - schema shows expected data structure
- ✅ **Descriptive errors** - clear validation messages

---

## Design Patterns & Principles

### 1. Single Responsibility Principle (SRP)

Each layer has ONE job:

| Layer | Responsibility | Does NOT Do |
|-------|---------------|-------------|
| Presentation | Render UI | Business logic, data fetching |
| Server Entry | Load data for SSR | Business logic, data access |
| Service | Business logic | Data access, UI rendering |
| Repository | Data access | Business logic, validation rules |
| Schema | Validation | Business logic, data transformation |

### 2. Dependency Inversion Principle (DIP)

```
High-level (Service) → Interface → Low-level (Repository)
```

Service depends on **abstraction** (Repository interface), not concrete implementation. Easy to swap:
- JSON files → PostgreSQL
- Local DB → Remote API
- Mock data → Real data (testing)

### 3. Open/Closed Principle (OCP)

**Open for extension, closed for modification**

Want to add a new data source? Create a new repository implementation without touching existing code:

```typescript
// New implementation
export class PostgresCVRepository implements ICVRepository {
  getAllExperience() {
    return db.query('SELECT * FROM experience');
  }
}

// Swap implementation
export const cvRepository = new PostgresCVRepository();
```

### 4. Don't Repeat Yourself (DRY)

- **Zod schemas** → Single source of truth for types and validation
- **Repository methods** → Generic `loadAndValidateJSON()` function
- **Service methods** → Reusable business logic
- **Barrel exports** → Clean import paths

### 5. You Aren't Gonna Need It (YAGNI)

❌ **Removed unnecessary complexity**:
- No API routes (not needed for fullstack app)
- No GraphQL (REST would be overkill)
- No Redux (Svelte stores sufficient)
- No microservices (monolith is simpler)

---

## Technology Stack

### Frontend

| Technology | Version | Purpose |
|-----------|---------|---------|
| **Svelte** | 5.46+ | UI framework with runes |
| **SvelteKit** | 2.49+ | Fullstack framework (SSR, routing) |
| **TypeScript** | 5.x | Type safety |
| **Tailwind CSS** | 4.x | Utility-first styling |
| **Vite** | 7.x | Build tool |

### Backend (Server-Side)

| Technology | Version | Purpose |
|-----------|---------|---------|
| **Node.js** | 20+ | Runtime (SSR) |
| **Zod** | 3.x | Runtime validation |
| **TypeScript** | 5.x | Type safety |

### Data Storage

| Current | Future |
|---------|--------|
| JSON files (`data/*.json`) | PostgreSQL / MySQL / Supabase |

---

## Folder Structure

```
portfolio/
├── src/
│   ├── lib/
│   │   ├── components/              # UI Components
│   │   │   ├── ui/                  # Reusable primitives (Button, Card, Badge)
│   │   │   └── book/                # Domain components (PageContent, pages/*)
│   │   │
│   │   ├── server/                  # ⭐ SERVER-ONLY CODE
│   │   │   ├── services/            # Business logic layer
│   │   │   │   ├── cv.service.ts
│   │   │   │   └── index.ts
│   │   │   ├── repositories/        # Data access layer
│   │   │   │   ├── cv.repository.ts
│   │   │   │   └── index.ts
│   │   │   └── index.ts             # Barrel export
│   │   │
│   │   ├── schemas/                 # ⭐ ZOD VALIDATION
│   │   │   ├── cv.schema.ts         # Single source of truth
│   │   │   └── index.ts
│   │   │
│   │   ├── types/                   # TypeScript types (non-schema)
│   │   │   └── book.ts              # UI-specific types
│   │   │
│   │   ├── utils/                   # Pure utility functions
│   │   │   └── book-mapper.ts
│   │   │
│   │   ├── stores/                  # Client-side state
│   │   │   ├── book.svelte.ts
│   │   │   └── theme.svelte.ts
│   │   │
│   │   └── constants/               # App constants
│   │       └── theme.ts
│   │
│   ├── routes/                      # SvelteKit routes
│   │   ├── +page.svelte             # Home page (UI)
│   │   ├── +page.server.ts          # Server load function
│   │   ├── +layout.svelte           # Root layout
│   │   └── +error.svelte            # Error page
│   │
│   ├── app.html                     # HTML template
│   ├── app.css                      # Global styles
│   └── app.d.ts                     # Global types
│
├── data/                            # ⭐ JSON "DATABASE"
│   ├── personal.json
│   ├── experience.json
│   ├── projects.json
│   ├── skills.json
│   ├── education.json
│   ├── achievements.json
│   ├── socials.json
│   ├── about.json
│   └── contact.json
│
├── static/                          # Static assets
│   └── images/
│
├── docs/                            # Documentation
│   ├── architecture/
│   │   ├── NEW-ARCHITECTURE.md      # This file
│   │   └── adrs/                    # Architecture decision records
│   └── DEVELOPMENT-GUIDELINES.md
│
├── svelte.config.js                 # SvelteKit config
├── vite.config.ts                   # Vite config
├── tailwind.config.js               # Tailwind config
├── tsconfig.json                    # TypeScript config
└── package.json
```

### Key Directories

| Directory | Purpose | Server-Only? |
|-----------|---------|--------------|
| `src/lib/server/` | Business logic + data access | ✅ Yes |
| `src/lib/schemas/` | Validation + types | ❌ Shared |
| `src/lib/components/` | UI components | ❌ Client |
| `src/routes/` | Pages + layouts | ❌ Both |
| `data/` | JSON files (future: DB) | N/A |

---

## Data Flow

### 1. Initial Page Load (SSR)

```
User requests "/"
  ↓
SvelteKit calls +page.server.ts load()
  ↓
load() calls cvService.getCompleteCV()
  ↓
Service calls cvRepository methods
  ↓
Repository reads & validates JSON files
  ↓
Service aggregates data
  ↓
load() returns { cvData, stats }
  ↓
SvelteKit renders +page.svelte with data
  ↓
HTML sent to browser
```

### 2. Client-Side Reactivity

```
User clicks "Next Page"
  ↓
Svelte updates currentPageIndex state
  ↓
$derived recalculates bookPages
  ↓
Component re-renders with new page
  ↓
Smooth transition
```

**No server round-trip!** All data loaded during SSR.

---

## Migration Path (JSON → Database)

### Current Architecture (JSON Files)

```typescript
// Repository
export class CVRepository {
  getAllExperience(): Experience[] {
    return loadAndValidateJSON('experience.json', ExperienceSchema.array(), 'experience');
  }
}
```

### Future Architecture (PostgreSQL)

```typescript
// Same interface, different implementation!
export class CVRepository {
  getAllExperience(): Promise<Experience[]> {
    const experiences = await db.query('SELECT * FROM experience ORDER BY start_date DESC');

    // Still validate with Zod!
    return ExperienceSchema.array().parse(experiences);
  }
}
```

### Migration Steps

1. ✅ **Already done**: Abstracted data access behind repository
2. 🔄 **Set up database**: Create PostgreSQL instance (Supabase/Neon/Railway)
3. 🔄 **Create schema**: Run migration SQL
4. 🔄 **Update repository**: Swap file reads for DB queries
5. 🔄 **Test**: Ensure Zod validation still works
6. 🔄 **Deploy**: Zero changes to service/presentation layers!

**No other code changes needed!** Service and presentation layers are decoupled from data source.

---

## Performance Considerations

### 1. Caching Strategy

```typescript
const CACHE_TTL = process.env.NODE_ENV === 'production' ? 5 * 60 * 1000 : 0;
```

- **Production**: 5-minute cache (reduce file I/O)
- **Development**: No cache (instant updates)

### 2. Prerendering

```typescript
// +page.server.ts
export const prerender = true;
```

- **Static generation** at build time
- **No server** needed for hosting
- **Instant page loads** from CDN

### 3. Minimal Bundle Size

- ✅ No API routes → No extra client-side code
- ✅ Server-only code → Excluded from browser bundle
- ✅ Tree-shaking → Only used code shipped

### 4. Type Safety Without Runtime Cost

- ✅ Zod validation runs **only on server**
- ✅ TypeScript types **compile away**
- ✅ No validation libraries in browser bundle

---

## Testing Strategy

### Unit Tests (Services & Utilities)

```typescript
// cv.service.test.ts
describe('CVService', () => {
  it('should calculate years of experience correctly', () => {
    const years = cvService.calculateYearsOfExperience();
    expect(years).toBeGreaterThan(0);
  });
});
```

### Integration Tests (Repository)

```typescript
// cv.repository.test.ts
describe('CVRepository', () => {
  it('should load and validate experience data', () => {
    const experiences = cvRepository.getAllExperience();

    expect(experiences).toBeInstanceOf(Array);
    expect(experiences[0]).toHaveProperty('id');
    expect(experiences[0]).toHaveProperty('title');
  });

  it('should throw on invalid data', () => {
    expect(() => loadAndValidateJSON('invalid.json', ExperienceSchema)).toThrow();
  });
});
```

### E2E Tests (Playwright)

```typescript
// portfolio.spec.ts
test('should display portfolio pages', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: /Portfolio/i })).toBeVisible();

  // Click next page
  await page.getByRole('button', { name: /Next/i }).click();

  await expect(page.getByRole('heading', { name: /About Me/i })).toBeVisible();
});
```

---

## Conclusion

This architecture demonstrates **enterprise-grade** software engineering principles:

✅ **Clean Architecture** - Clear separation of concerns
✅ **SOLID Principles** - SRP, DIP, OCP
✅ **Type Safety** - Zod + TypeScript
✅ **Performance** - Caching, prerendering, minimal bundles
✅ **Maintainability** - DRY, testable, documented
✅ **Extensibility** - Easy to add features and swap implementations
✅ **Production-Ready** - Error handling, validation, logging

**No unnecessary complexity. Just clean, maintainable, scalable code.**

---

**Questions? Check the [Development Guidelines](../DEVELOPMENT-GUIDELINES.md) or [ADRs](./adrs/).**
