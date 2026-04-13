# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

## Artifacts

### Wisata Sejarah GIS (Mobile App)
- **Path**: `artifacts/wisata-sejarah/`
- **Type**: Expo (React Native)
- **Purpose**: GIS-based Historical Tourism mobile app for Indonesia
- **Features**:
  - Interactive map with `react-native-maps` showing 6 historical sites
  - Home screen with featured destinations and category filtering
  - Search functionality across all sites
  - Site detail pages with info, highlights, tips, AI recommendations
  - Favorites (persisted via AsyncStorage)
  - Explore tab for browsing all destinations
  - Web fallback for map (stub + `.web.tsx` platform override)
- **Color Scheme**: Earthy terracotta/gold tones (Indonesian batik-inspired)
- **Data**: 6 pre-loaded Indonesian historical sites (Borobudur, Prambanan, Keraton, Fort Rotterdam, National Museum, Trowulan)

### API Server
- **Path**: `artifacts/api-server/`
- **Type**: Express API
- **Purpose**: Shared backend service

### Metro Config Note
- `metro.config.js` includes a custom resolver that stubs `react-native-maps` on web to prevent native-only import errors
- Web map fallback is at `app/(tabs)/map.web.tsx`
