import { effect, Injectable, signal, Signal, WritableSignal } from '@angular/core';
import { IExercise } from '@models/exercise.model';
import { Session } from '@supabase/supabase-js';

@Injectable({ providedIn: 'root' })
export class AppStore {
  private readonly state = {
    _session: signal<Session | null>(null),
    _isSessionLoaded: signal<boolean>(false),
    _exercises: signal<IExercise[]>([]),
    _exercisesLoaded: signal<boolean>(false),
  } as const;

  public readonly session: Signal<Session | null> = this.state._session.asReadonly();
  public readonly isSessionLoaded: Signal<boolean> = this.state._isSessionLoaded.asReadonly();
  public readonly exercises: Signal<IExercise[]> = this.state._exercises.asReadonly();
  public readonly exercisesLoaded: Signal<boolean> = this.state._exercisesLoaded.asReadonly();

  setSession(session: Session | null) {
    this.state._session.set(session);
    this.state._isSessionLoaded.set(!!session);
  }

  setExercises(exercises: IExercise[]) {
    this.state._exercises.set(exercises);
  }

  setExercisesLoaded(loaded: boolean) {
    this.state._exercisesLoaded.set(loaded);
  }
}
