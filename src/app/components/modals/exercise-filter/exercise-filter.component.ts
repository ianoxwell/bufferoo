
import { ScrollingModule } from '@angular/cdk/scrolling';
import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AppStore } from '@app/app.store';
import { DialogMessageData } from '@app/models/dialog.model';
import { environment } from '@env/environment';
import { IExerciseFilter } from '@models/exercise-filter.model';
import { IExercise, TExerciseEquipment, TExerciseForce, TExerciseLevel, TExerciseMechanic, TExerciseMuscleGroup } from '@models/exercise.model';

@Component({
  selector: 'app-exercise-filter',
  templateUrl: './exercise-filter.component.html',
  styleUrls: ['./exercise-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatToolbarModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule,
    MatChipsModule,
    ScrollingModule,
    FormsModule,
    NgOptimizedImage,
  ],
})
export class ExerciseFilterComponent {
  data: DialogMessageData<null> = inject(MAT_DIALOG_DATA);
  dialogRef = inject(MatDialogRef<ExerciseFilterComponent>);
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

  readonly equipmentOptions = computed(() => [...new Set(this.exercises().map(e => e.equipment))]);
  readonly muscleOptions = computed(() => [...new Set(this.exercises().flatMap(e => [...e.primaryMuscles, ...e.secondaryMuscles]))]);

  readonly filteredExercises = computed(() => {
    const exercises = this.exercises();
    const force = this.force();
    const level = this.level();
    const mechanic = this.mechanic();
    const equipment = this.equipment();
    const muscles = this.muscles();
    const search = this.search().toLowerCase();
    const sortBy = this.sortBy();

    let filtered = exercises;

    if (force.length) {
      filtered = filtered.filter(e => force.includes(e.force));
    }

    if (level.length) {
      filtered = filtered.filter(e => level.includes(e.level));
    }

    if (mechanic.length) {
      filtered = filtered.filter(e => mechanic.includes(e.mechanic));
    }

    if (equipment.length) {
      filtered = filtered.filter(e => equipment.includes(e.equipment));
    }

    if (muscles.length) {
      filtered = filtered.filter(e => 
        muscles.some(m => e.primaryMuscles.includes(m) || e.secondaryMuscles.includes(m))
      );
    }

    if (search) {
      filtered = filtered.filter(e => e.name.toLowerCase().includes(search));
    }

    if (sortBy === 'name') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'difficulty') {
      const levelSortOrder: TExerciseLevel[] = ['beginner', 'intermediate', 'expert'];
      filtered.sort((a, b) => levelSortOrder.indexOf(a.level) - levelSortOrder.indexOf(b.level));
    }

    console.log('Filtered exercises:', filtered);
    return filtered;
  });

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
      // Save current filter state to store
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
      
      // Return the selected exercise
      this.dialogRef.close(selectedExercise);
    }
  }

  applyFiltersOnly() {
    // Just save filters without selecting an exercise
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
    this.dialogRef.close(null);
  }

  clearFilters() {
    this.force.set([]);
    this.level.set([]);
    this.mechanic.set([]);
    this.equipment.set([]);
    this.muscles.set([]);
    this.search.set('');
    this.sortBy.set('name');
  }

  getOptimizedExerciseImageUrl(imageName: string): string {
    if (!imageName) return '';
    
    // Create optimized URL with Supabase image transformation
    // Using 240x240 for exercise cards (square for consistent layout)
    return `${environment.exerciseBucket}${imageName}?width=240&height=240&resize=cover&quality=85`;
  }
}
