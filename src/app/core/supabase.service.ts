import { Injectable } from '@angular/core';
import { IWorkout } from '@app/models/workout.model';
import { environment } from '@env/environment';
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

  async getWorkoutImages(): Promise<{ name: string; url: string }[]> {
    const { data, error } = await this.supabase.storage.from('workout-images').list();
    if (error) {
      console.error('Error fetching workout images:', error);
      return [];
    }
    return data.map((item) => ({ name: item.name, url: `${environment.workoutBucket}${item.name}` }));
  }

  async getPublicWorkouts(): Promise<IWorkout[]> {
    const { data, error } = await this.supabase
      .from('workouts')
      .select('*, workout_exercises(*, exercise:exercises(*))');
    if (error) {
      console.error('Error fetching public workouts:', error);
      return [];
    }

    return data;
  }

  async createWorkout(workout: IWorkout, user_id = '414a20bd-6773-43c4-a0e0-f3a03b766b58') {
    const { data: workoutData, error: workoutError } = await this.supabase
      .from('workouts')
      .insert([
        {
          name: workout.name,
          image_url: workout.image_url ?? null,
          is_public: true,
          user_id,
        },
      ])
      .select()
      .single();
    if (workoutError || !workoutData) {
      return { data: null, error: workoutError ?? new Error('Workout not created') };
    }

    const workout_id = workoutData.id;

    // Step 2: Prepare workout_exercises with the new workout ID
    const workoutExercises = workout.workout_exercises.map((ex, index) => ({
      workout_id,
      exercise_id: ex.exercise_id,
      position: ex.position ?? index,
      sets: ex.sets,
    }));

    // Step 3: Insert workout_exercises
    const { data: exercisesData, error: exercisesError } = await this.supabase
      .from('workout_exercises')
      .insert(workoutExercises)
      .select();

    if (exercisesError) {
      return { data: null, error: exercisesError };
    }

    return { data: { workout: workoutData, workout_exercises: exercisesData }, error: null };
  }
}
