import { Routes } from '@angular/router';
import { authGuard } from './common/auth.guard';

export const routes: Routes = [
    {
        path: 'auth',
        loadComponent: () => import('./pages/auth/auth').then((m) => m.Auth),
    },
    {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard').then((m) => m.DashboardComponent),
        canActivate: [authGuard],
    },
    {
        path: 'workout',
        loadComponent: () => import('./pages/workout/workout').then((m) => m.WorkoutComponent),
        canActivate: [authGuard],
        children: [
            {
                path: ':id',
                loadComponent: () => import('./pages/workout/workout').then((m) => m.WorkoutComponent),
                canActivate: [authGuard],
            },
            {
                path: ':id/:exerciseId',
                loadComponent: () => import('./pages/exercise/exercise').then((m) => m.ExerciseComponent),
                canActivate: [authGuard],
            },
            {
                path: ':id/:exerciseId/history',
                loadComponent: () => import('./pages/exercise/exercise-history/exercise-history').then((m) => m.ExerciseHistoryComponent),
                canActivate: [authGuard],
            },
        ],
    },
    {
        path: 'explore',
        loadComponent: () => import('./pages/explore/explore').then((m) => m.ExploreComponent),
        canActivate: [authGuard],
    },
    {
        path: 'account',
        loadComponent: () => import('./pages/account/account').then((m) => m.Account),
        canActivate: [authGuard],
    },
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
    },
];

export const protectedRoutes = Array.from(
  new Set(
    routes
      .filter((route) => route.canActivate && route.canActivate.includes(authGuard))
      .map((route) => (route.path ? route.path.split('/')[0] : ''))
      .filter((path) => path)
  )
);
