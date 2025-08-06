I need a **reusable full-screen modal filter component** for an Angular 20 + Angular Material app (Bufferoo) that allows users to quickly browse and filter over 1000 exercises.

### Key Features:

- **Mobile-first full-screen modal layout** using Angular Material.
- Filters for:
  - **Force**: push, pull, static
  - **Level**: beginner, intermediate, expert
  - **Mechanic**: isolation, compound
  - **Equipment**: e.g., machine, body only, dumbbell
  - **Muscles**: biceps, hamstrings, etc - this should filter to both primary and secondaryMuscles
  - see types in @src/app/models/exercise.model.ts
- **Text input** for search-as-you-type (case-insensitive, fuzzy or substring match is okay).
- **Sort dropdown** (e.g., by name, difficulty).
- The UI should be:
  - Fully **accessible** (WCAG AA)
  - **Keyboard navigable**
  - **Responsive** and touch-friendly
  - Use material UI components where possible
  - Mobile First
  - each exercise card in list should should image on the left with exercise name on the right along with additional information like force, level mechanic, equipment and muscles
  - Selecting card should expand to show more details such as secondary muscles and instructions in numbered list
- Should emit selected filters and search results to parent.
- Should refer to IExercise in models/exercise.model.ts
- Use **OnPush** change detection and **standalone components**.
- Use **Angular signals** or **RxJS** where appropriate.
- The modal itself should be stored in components/modals
- The modal should be instantiated with a function in core/modal-service.ts

### Reusability:

The modal should be usable from multiple pages and easily accept inputs like:

- Pre-selected filters
- last filter state should be remembered in app.store.ts
- Custom title/description
- Callback or output when filter is applied or cancelled

Please scaffold the component with TypeScript, HTML template, and SCSS using Angular best practices.
