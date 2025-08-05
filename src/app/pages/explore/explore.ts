import { Component, effect } from '@angular/core';
import { IExercise } from '@models/exercise.model';
import { AppStore } from 'src/app/app.store';

@Component({
  selector: 'app-explore',
  imports: [],
  templateUrl: './explore.html',
  styleUrl: './explore.scss',
})
export class ExploreComponent {
  exercises: IExercise[] = [];

  constructor(private appStore: AppStore) {
    effect(() => {
      const exercises = this.appStore.exercises();
      if (exercises.length) {
        console.log('Updated exercises in effect:', exercises);
        this.exercises = exercises;
        const musclesList = [
          ...exercises.map((e) => e.primaryMuscles).flat(),
          ...exercises.map((e) => e.secondaryMuscles).flat(),
        ];
        const uniqueMuscles = Array.from(new Set(musclesList));
        const categories = Array.from(new Set(exercises.map((e) => e.category).filter((c) => c !== null)));
        const equipment = Array.from(new Set(exercises.map((e) => e.equipment).filter((c) => c !== null)));
        const mechanics = Array.from(new Set(exercises.map((e) => e.mechanic).filter((c) => c !== null)));
        const levels = Array.from(new Set(exercises.map((e) => e.level).filter((c) => c !== null)));
        const force = Array.from(new Set(exercises.map((e) => e.force).filter((c) => c !== null)));

        console.log('Unique categories:', categories);
        console.log('Unique equipment:', equipment);
        console.log('Unique mechanics:', mechanics);
        console.log('Unique levels:', levels);
        console.log('Unique force:', force);
        console.log('Unique muscles:', uniqueMuscles);
      }
    });
  }
}
