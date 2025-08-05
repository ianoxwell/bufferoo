import { Injectable, signal, Signal, WritableSignal } from '@angular/core';
import { IProfile } from '@models/user.model';
import { AuthChangeEvent, createClient, Session, SupabaseClient, User } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase: SupabaseClient;
  private readonly supabaseUrl = import.meta.env.NG_APP_SUPABASE_URL;
  private readonly supabaseKey = import.meta.env.NG_APP_SUPABASE_KEY;


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
  }

  async getSession() {
    try {
      const { data, error } = await this.supabase.auth.getSession();
      if (error) {
        console.error('Error getting session:', error);
        return null;
      }
      return data.session;
    } catch (error) {
      console.error('Session acquisition error:', error);
      return null;
    }
  }

  authChanges(callback: (event: AuthChangeEvent, session: Session | null) => void) {
    return this.supabase.auth.onAuthStateChange(callback);
  }

  async fetchExercises() {
    const { data, error } = await this.supabase.from('exercises').select('*');
    return { data, error };
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
