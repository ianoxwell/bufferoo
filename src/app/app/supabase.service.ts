import { Injectable } from '@angular/core';
import { IProfile } from '@models/user.model';
import { AuthChangeEvent, AuthSession, createClient, Session, SupabaseClient, User } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase: SupabaseClient;
  _session: AuthSession | null = null;
  private readonly supabaseUrl = import.meta.env.NG_APP_SUPABASE_URL;
  private readonly supabaseKey = import.meta.env.NG_APP_SUPABASE_KEY;

  constructor() {
    console.log('Initializing Supabase client...', this.supabaseUrl, this.supabaseKey);
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

  get session() {
    return this._session;
  }

  async getSession() {
    try {
      const { data, error } = await this.supabase.auth.getSession();
      if (error) {
        console.error('Error getting session:', error);
        return null;
      }

      this._session = data.session;
      return this._session;
    } catch (error) {
      console.error('Session acquisition error:', error);
      return null;
    }
  }

  profile(user: User) {
    return this.supabase.from('profiles').select(`username, website, avatar_url`).eq('id', user.id).single();
  }
  authChanges(callback: (event: AuthChangeEvent, session: Session | null) => void) {
    return this.supabase.auth.onAuthStateChange(callback);
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
    try {
      const { error } = await this.supabase.auth.signOut();
      if (error) {
        console.error('Sign out error:', error);
      }
      this._session = null;
      return { error };
    } catch (error) {
      console.error('Sign out failed:', error);
      return { error };
    }
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
