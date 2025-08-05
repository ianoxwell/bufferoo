# 🦘 Bufferoo – The Aussie Gym Journal

**Bufferoo** is a clean, fast, web-based workout tracker built with a strong focus on usability, accessibility, and simplicity. Inspired by the structure and flow of apps like [strong.app](https://strong.app), Bufferoo helps you plan, execute, and track your workouts—without the clutter.

Whether you're lifting heavy or just getting started, Bufferoo keeps your progress front and center.

---

## 🔧 Tech Stack

| Layer        | Tech                       |
|--------------|----------------------------|
| **Frontend** | [Angular 20](https://angular.io/), [Angular Material](https://material.angular.io/) |
| **Auth + DB**| [Supabase](https://supabase.com/) (Postgres, Auth, Storage) |
| **API**      | Supabase [GraphQL](https://supabase.com/docs/guides/api/graphql) |
| **Hosting**  | [Vercel](https://vercel.com/) |

---

## 🎯 Features (Work in Progress)

- 🗂 **Workout Templates**  
  Plan your workouts using a searchable list of exercises, grouped by category.

- 🔁 **Weekly Scheduling**  
  Assign workouts to days of the week with repeat options (e.g., UpperBody on Mondays).

- 🏋️ **Drag-and-Drop Workout Planner**  
  Reorder your exercise list effortlessly using Angular CDK drag/drop.

- ✅ **Smart Exercise Tracking**  
  Pre-fills your last used weights & reps, tracks sets during workouts, and allows exercise substitutions on the fly.

- 📈 **History & Progress**  
  Weekly overview and individual exercise history, visualized with bar charts.

- ♿ **Accessible UI**  
  Built using WCAG-compliant color schemes and Angular Material’s accessible components.

---

## 🚀 Project Status

Bufferoo is a **fast build in progress**, developed as part of a frontend-focused demo project. It serves as both a personal tool and a public portfolio project showcasing:

- Component-driven Angular development
- Scalable architecture
- Responsive, WCAG-friendly UI design
- Integration with GraphQL APIs and Supabase Auth
- Use of JSONB in Postgres for flexible data storage

A full roadmap is in place for upcoming features, including:

- Dark mode
- Social workout sharing
- Set timers and rest periods
- Import/export workout data
- PWA support

---

## 💡 Roadmap Preview

- [ ] User-specific exercise library
- [ ] Exercise substitution suggestions based on muscle group
- [ ] Deep analytics (volume tracking, PRs)
- [ ] Drag-to-complete workout calendar
- [ ] Mobile-friendly UI optimizations
- [ ] Auto sync to localStorage / offline mode

---

## 📸 Screenshots (coming soon)

> Featuring a bold UI, accessible fonts and colors, and a buff kangaroo logo with serious attitude.

---

## 🧠 Why Bufferoo?

Bufferoo combines the structure of modern gym journaling apps with a smooth, low-friction UI and a friendly Aussie vibe. Built for speed, clarity, and flexibility — it's your digital training partner with no fluff, no ads, and no excuses.

---

## 🛠 Dev Notes

This project is built using:

- `@angular/material`
- Supabase's `@supabase/supabase-js` SDK
- Supabase GraphQL endpoint via Apollo Client

---

## 📦 Installation (local dev)

```bash
npm install
ng serve
