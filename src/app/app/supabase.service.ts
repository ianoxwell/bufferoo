import { effect, Injectable, signal, Signal, WritableSignal } from '@angular/core';
import { IExercise } from '@models/exercise.model';
import { IProfile } from '@models/user.model';
import { createClient, Session, SupabaseClient, User } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase: SupabaseClient;
  private readonly supabaseUrl = import.meta.env.NG_APP_SUPABASE_URL;
  private readonly supabaseKey = import.meta.env.NG_APP_SUPABASE_KEY;

  private _session: WritableSignal<Session | null> = signal(null);
  readonly session: Signal<Session | null> = this._session.asReadonly();

  private _isSessionLoaded: WritableSignal<boolean> = signal(false);
  readonly isSessionLoaded: Signal<boolean> = this._isSessionLoaded.asReadonly();

  private _exercises: WritableSignal<IExercise[]> = signal([]);
  readonly exercises: Signal<IExercise[]> = this._exercises.asReadonly();

  private _exercisesLoaded: WritableSignal<boolean> = signal(false);

  constructor() {
    this.supabase = createClient(this.supabaseUrl, this.supabaseKey, {
      auth: {
        storage: window.localStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        flowType: 'pkce',
      },
    });

    // Listen for auth state changes and update the session signal
    this.supabase.auth.onAuthStateChange((_, session) => {
      this._session.set(session);
      // Mark session as loaded after any auth state change
      this._isSessionLoaded.set(true);
    });

    // Load the initial session
    this.loadSession();

    effect(() => {
      if (this.session() && this.isSessionLoaded() && !this._exercisesLoaded()) {
        this.fetchExercises();
        this._exercisesLoaded.set(true);
      }
    });
  }

  async loadSession() {
    const { data } = await this.supabase.auth.getSession();
    this._session.set(data.session);
    // Mark session as loaded after initial load
    this._isSessionLoaded.set(true);
  }

  async fetchExercises() {
    try {
      const { data, error } = await this.supabase.from('exercises').select('*');
      if (error) {
        throw error;
      }
      this._exercises.set(data || []);
    } catch (error) {
      console.error('Error fetching exercises:', error);
      this._exercises.set([]);
    }
  }

  profile(user: User) {
    return this.supabase.from('profiles').select(`username, website, avatar_url`).eq('id', user.id).single();
  }

  signIn(email: string) {
    return this.supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
      },
    });
  }

  async signOut() {
    const { error } = await this.supabase.auth.signOut();
    return { error };
  }

  updateProfile(profile: IProfile) {
    const update = {
      ...profile,
      updated_at: new Date(),
    };
    return this.supabase.from('profiles').upsert(update);
  }

  downLoadImage(path: string) {
    return this.supabase.storage.from('avatars').download(path);
  }

  uploadAvatar(filePath: string, file: File) {
    return this.supabase.storage.from('avatars').upload(filePath, file);
  }
}
