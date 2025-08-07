import { IExercise } from "./exercise.model";

/** Note these are for the system created workouts */
export interface IWorkout {
  id?: string;
  name: string;
  image_url?: string;
  is_public: boolean;
  user_id?: string;
  created_at?: string;
  exercises: IWorkoutExercise[];
}

export interface IWorkoutExercise {
  id?: string;
  workout_id?: string;
  exercise_id: string;
  position: number;
  sets: ISetEntry[];
  rest: number | null;
  exercise?: IExercise; // joined
}

export interface ISetEntry {
  reps: number;
  weight: number;
}

export const exampleWorkout: IWorkout = {
    name: "Upper body",
    image_url: "https://mimaktxujtbngbncgwqn.supabase.co/storage/v1/object/public/workout-images//senior-strength-training-stockcake.jpg",
    is_public: true,
    exercises: [
        {
            exercise_id: "ccfbe80b-ac09-4f13-bee6-c2da89be38d6",
            position: 1,
            rest: 60,
            sets: [
                { reps: 12, weight: 30 },
                { reps: 12, weight: 25 },
                { reps: 12, weight: 20 }
            ],
        },
        {
            exercise_id: "d7c564d9-520e-4178-93aa-a7e580c5530e",
            position: 2,
            rest: 60,
            sets: [
                { reps: 12, weight: 10 },
                { reps: 12, weight: 10 },
                { reps: 12, weight: 10 }
            ],
        },
        {
            exercise_id: "86d86cbc-7d21-48df-b87e-67d0153950e3",
            position: 3,
            rest: 60,
            sets: [
                { reps: 12, weight: 30 },
                { reps: 12, weight: 30 },
                { reps: 12, weight: 30 }
            ],
        }
    ]
};