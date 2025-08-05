export interface IExercise {
  exercise_id: string;
  name: string;
  force: 'push' | 'pull' | null;
  level: 'beginner' | 'intermediate' | 'expert' | null;
  mechanics: 'compound' | 'isolation' | null;
  equipment: string | null;
  primaryMuscle: string[];
  secondaryMuscle: string[];
  instructions: string[];
  category: string;
  images: string[];
}