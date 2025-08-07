import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AppStore } from '@app/app.store';
import { ExerciseCardComponent } from '@app/components/exercise-card/exercise-card.component';
import { DialogMessageData } from '@app/models/dialog.model';
import { IExerciseFilter } from '@models/exercise-filter.model';
import {
  IExercise,
  TExerciseEquipment,
  TExerciseForce,
  TExerciseLevel,
  TExerciseMechanic,
  TExerciseMuscleGroup,
} from '@models/exercise.model';

@Component({
  selector: 'app-select-exercise',
  templateUrl: './select-exercise.component.html',
  styleUrls: ['./select-exercise.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatToolbarModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule,
    FormsModule,
    ExerciseCardComponent,
  ],
})
export class SelectExerciseComponent {
  data: DialogMessageData<null> = inject(MAT_DIALOG_DATA);
  dialogRef = inject(MatDialogRef<SelectExerciseComponent>);
  private readonly store = inject(AppStore);

  readonly exercises = this.store.exercises;
  readonly selectedExercise = signal<IExercise | null>(null);

  readonly force = signal<TExerciseForce[]>([]);
  readonly level = signal<TExerciseLevel[]>([]);
  readonly mechanic = signal<TExerciseMechanic[]>([]);
  readonly equipment = signal<TExerciseEquipment[]>([]);
  readonly muscles = signal<TExerciseMuscleGroup[]>([]);
  readonly search = signal<string>('');
  readonly sortBy = signal<string>('name');
  readonly sortDirection = signal<'asc' | 'desc'>('asc');

  readonly equipmentOptions = computed(() => [...new Set(this.exercises().map((e) => e.equipment))]);
  readonly muscleOptions = computed(() => [
    ...new Set(this.exercises().flatMap((e) => [...e.primaryMuscles, ...e.secondaryMuscles])),
  ]);

  readonly filteredExercises = computed(() => this.filterAndSortExercises());

  constructor() {
    // Hydrate form from current exercise filter in store
    const currentFilter = this.store.exerciseFilter();
    if (currentFilter) {
      this.force.set(currentFilter.force || []);
      this.level.set(currentFilter.level || []);
      this.mechanic.set(currentFilter.mechanic || []);
      this.equipment.set(currentFilter.equipment || []);
      this.muscles.set(currentFilter.muscles || []);
      this.search.set(currentFilter.search || '');
      this.sortBy.set(currentFilter.sortBy || 'name');
    }

    // Keep store filter in sync with form signals
    effect(() => {
      const filter: IExerciseFilter = {
        force: this.force(),
        level: this.level(),
        mechanic: this.mechanic(),
        equipment: this.equipment(),
        muscles: this.muscles(),
        search: this.search(),
        sortBy: this.sortBy(),
      };
      this.store.setExerciseFilter(filter);
    });
  }

  private filterAndSortExercises(): IExercise[] {
    const exercises = this.exercises();
    const force = this.force();
    const level = this.level();
    const mechanic = this.mechanic();
    const equipment = this.equipment();
    const muscles = this.muscles();
    const search = this.search().toLowerCase();
    const sortBy = this.sortBy();
    const sortDirection = this.sortDirection();

    let filtered = exercises;

    // Apply filters only if they have values to avoid unnecessary iterations
    if (force.length > 0) {
      filtered = filtered.filter((e) => force.includes(e.force));
    }

    if (level.length > 0) {
      filtered = filtered.filter((e) => level.includes(e.level));
    }

    if (mechanic.length > 0) {
      filtered = filtered.filter((e) => mechanic.includes(e.mechanic));
    }

    if (equipment.length > 0) {
      filtered = filtered.filter((e) => equipment.includes(e.equipment));
    }

    if (muscles.length > 0) {
      filtered = filtered.filter((e) =>
        muscles.some((m) => e.primaryMuscles.includes(m) || e.secondaryMuscles.includes(m))
      );
    }

    if (search.length > 0) {
      filtered = filtered.filter((e) => e.name.toLowerCase().includes(search));
    }

    // Sort the results with direction
    if (sortBy === 'name') {
      filtered.sort((a, b) => {
        const result = a.name.localeCompare(b.name);
        return sortDirection === 'asc' ? result : -result;
      });
    } else if (sortBy === 'difficulty') {
      const levelSortOrder: TExerciseLevel[] = ['beginner', 'intermediate', 'expert'];
      filtered.sort((a, b) => {
        const result = levelSortOrder.indexOf(a.level) - levelSortOrder.indexOf(b.level);
        return sortDirection === 'asc' ? result : -result;
      });
    }

    // Limit to first 100 results for performance
    return filtered.slice(0, 100);
  }

  trackByExerciseId(_: number, exercise: IExercise): string {
    return exercise.exercise_id;
  }

  selectExercise(exercise: IExercise) {
    this.selectedExercise.set(exercise);
  }

  isExerciseSelected(exercise: IExercise): boolean {
    return this.selectedExercise()?.exercise_id === exercise.exercise_id;
  }

  applySelection() {
    const selectedExercise = this.selectedExercise();
    if (selectedExercise) {
      // Return the selected exercise (filter is already synced via effect)
      this.dialogRef.close(selectedExercise);
    }
  }

  clearFilters() {
    this.force.set([]);
    this.level.set([]);
    this.mechanic.set([]);
    this.equipment.set([]);
    this.muscles.set([]);
    this.search.set('');
    this.sortBy.set('name');
    this.sortDirection.set('asc');
  }

  toggleSortDirection() {
    this.sortDirection.update(direction => direction === 'asc' ? 'desc' : 'asc');
  }
}
