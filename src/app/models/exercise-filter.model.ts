import { TExerciseEquipment, TExerciseForce, TExerciseLevel, TExerciseMechanic, TExerciseMuscleGroup } from "./exercise.model";

export interface IExerciseFilter {
  force: TExerciseForce[];
  level: TExerciseLevel[];
  mechanic: TExerciseMechanic[];
  equipment: TExerciseEquipment[];
  muscles: TExerciseMuscleGroup[];
  search: string;
  sortBy: string;
}
