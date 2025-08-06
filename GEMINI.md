# Bufferoo - Technical overview

Bufferoo is a clean, fast, web-based workout tracker built with a strong focus on usability, accessibility, and simplicity. Inspired by the structure and flow of apps like [strong.app](https://strong.app), Bufferoo helps users plan, execute, and track their workouts—without the clutter.

## Project Structure

- **Frontend**: [Angular 20](https://angular.io/), [Angular Material](https://material.angular.dev/components/categories)
- **Auth + DB**: [Supabase](https://supabase.com/) (Postgres, Auth, Storage)
- **API**: Supabase [GraphQL](https://supabase.com/docs/guides/api/graphql)
- **Hosting**: [Vercel](https://vercel.com/)

## Key Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Creates a production build.
- `npm run start`: Starts the production server.
- `npm run lint`: Lints the codebase for errors.
- `npm run typecheck`: Runs the TypeScript compiler to check for type errors.

## Directory Overview

```text
src/app/
├── app.config.ts         # Angular app configuration
├── app.routes.ts         # Application routing configuration
├── app.store.ts          # Global state management with signals
├── app.ts               # Root app component
├── app.html             # Root app template
├── app.scss             # Root app styles
├── app.spec.ts          # Root app tests
├── common/              # Services and utilities used throughout app
│   ├── auth.guard.ts    # Route guard for authentication
│   ├── auth.service.ts  # Authentication state management
│   └── supabase.service.ts # Supabase client and data operations
├── components/          # Reusable UI components
├── models/              # TypeScript interfaces and types
└── pages/               # Route-based page components, pages composed from components

```

### Architecture Notes

- **Signals-based State**: Uses Angular's new signals for reactive state management
- **Service Layer Pattern**: Separation between data operations (SupabaseService) and state management (AuthService + AppStore)
- **Component Organization**: Pages for routes, components for reusable UI elements
- **Type Safety**: Strong TypeScript typing with dedicated model interfaces

