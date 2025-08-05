import { Injectable, effect, inject } from '@angular/core';
import { AppStore } from '../app.store';
import { AuthChangeEvent, Session } from '@supabase/supabase-js';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly supabaseService = inject(SupabaseService);
  private readonly appStore = inject(AppStore);

  constructor() {
    // Effect to fetch exercises when session is available
    effect(() => {
      if (this.appStore.session() && this.appStore.isSessionLoaded() && !this.appStore.exercisesLoaded()) {
        this.fetchExercises();
        this.appStore.setExercisesLoaded(true);
      }
    });
  }

  async initializeAuth() {
    // Listen for auth state changes and update the store
    this.supabaseService.authChanges((_: AuthChangeEvent, session: Session | null) => {
      this.appStore.setSession(session);
    });

    // Load the initial session
    const session = await this.supabaseService.getSession();
    this.appStore.setSession(session);
  }

  private async fetchExercises() {
    try {
      const { data, error } = await this.supabaseService.fetchExercises();
      if (error) {
        throw error;
      }
      this.appStore.setExercises(data || []);
    } catch (error) {
      console.error('Error fetching exercises:', error);
      this.appStore.setExercises([]);
    }
  }
}
