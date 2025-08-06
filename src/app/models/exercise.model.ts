export interface IExercise {
  id: string; // Unique identifier for the exercise
  exercise_id: string; // Identifier for the exercise, possibly used for external references
  name: string;
  force: TExerciseForce;
  level: TExerciseLevel;
  mechanic: TExerciseMechanic;
  equipment: TExerciseEquipment;
  primaryMuscles: TExerciseMuscleGroup[];
  secondaryMuscles: TExerciseMuscleGroup[];
  instructions: string[];
  category: TExerciseCategory;
  images: string[];
}

export type TExerciseCategory =
  | 'strength'
  | 'stretching'
  | 'plyometrics'
  | 'strongman'
  | 'powerlifting'
  | 'cardio'
  | 'olympic weightlifting'
  | null;
export type TExerciseForce = 'push' | 'pull' | 'static' | null;
export type TExerciseLevel = 'beginner' | 'intermediate' | 'expert' | null;
export type TExerciseMechanic = 'compound' | 'isolation' | null;
export type TExerciseEquipment =
  | 'body only'
  | 'machine'
  | 'other'
  | 'foam roll'
  | 'kettlebells'
  | 'dumbbell'
  | 'cable'
  | 'barbell'
  | 'bands'
  | 'medicine ball'
  | 'exercise ball'
  | 'e-z curl bar'
  | null;

  export type TExerciseMuscleGroup =
    | 'abdominals'
    | 'hamstrings'
    | 'adductors'
    | 'quadriceps'
    | 'biceps'
    | 'calves'
    | 'shoulders'
    | 'chest'
    | 'middle back'
    | 'glutes'
    | 'lower back'
    | 'lats'
    | 'triceps'
    | 'traps'
    | 'forearms'
    | 'neck'
    | 'abductors';
