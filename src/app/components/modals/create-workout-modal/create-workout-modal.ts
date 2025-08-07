import { Component, inject, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NgOptimizedImage } from '@angular/common';
import { AppStore } from '@app/app.store';
import { SupabaseService } from '@app/core/supabase.service';
import { DialogMessageData, IDialogText } from '@models/dialog.model';
import { ISetEntry, IWorkout } from '@models/workout.model';
import { ModalService } from '@app/core/modal-service';

@Component({
  selector: 'app-create-workout-modal',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
    ReactiveFormsModule,
    NgOptimizedImage,
  ],
  templateUrl: './create-workout-modal.html',
  styleUrl: './create-workout-modal.scss',
})
export class CreateWorkoutModalComponent implements OnInit {
  private readonly supabaseService = inject(SupabaseService);
  private readonly dialogRef = inject(MatDialogRef<CreateWorkoutModalComponent>);
  private readonly appStore = inject(AppStore);
  private readonly modalService = inject(ModalService);
  readonly data = inject<DialogMessageData<IDialogText>>(MAT_DIALOG_DATA);


  workoutForm!: FormGroup;
  isLoading = false;
  errorMessage = '';
  workoutImages: { name: string; url: string; optimizedUrl: string }[] = [];

  get exercisesLength(): number {
    const exercises = this.workoutForm.get('exercises');
    if (!exercises) {
      return 0;
    }

    return Array.isArray(exercises?.value) ? exercises.value.length : 0;
  }

  async ngOnInit(): Promise<void> {
    this.workoutForm = this.createForm();
    this.setDialogDisableClose();
    this.workoutImages = await this.supabaseService.getWorkoutImages();
    console.log('Workout images:', this.workoutImages);
  }

  private createForm(): FormGroup {
    return new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(100)]),
      description: new FormControl('', [Validators.maxLength(500)]),
      isPublic: new FormControl(false),
      selectedImageUrl: new FormControl(''),
      exercises: new FormArray([], {
        validators: Validators.required,
      }),
    });
  }

  private setDialogDisableClose(): void {
    this.dialogRef.disableClose = this.data?.disableClose ?? true;
  }

  async onSubmit(): Promise<void> {
    if (this.workoutForm.invalid || this.isLoading) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    try {
      const session = this.appStore.session();
      if (!session?.user?.id) {
        throw new Error('User not authenticated');
      }

      const formValue = this.workoutForm.getRawValue();
      // Select a random image URL if none is selected
      let imageUrl = formValue.selectedImageUrl;
      if (!imageUrl && this.workoutImages.length > 0) {
        const randomIndex = Math.floor(Math.random() * this.workoutImages.length);
        imageUrl = this.workoutImages[randomIndex].url;
      }

      const newWorkout: Omit<IWorkout, 'id' | 'created_at'> = {
        name: formValue.name.trim(),
        image_url: imageUrl || '',
        is_public: formValue.isPublic,
        user_id: session.user.id,
        exercises: [],
      };

      // Close dialog with the created workout
      this.dialogRef.close(newWorkout);
    } catch (error) {
      console.error('Error creating workout:', error);
      this.errorMessage = error instanceof Error ? error.message : 'Failed to create workout. Please try again.';
    } finally {
      this.isLoading = false;
    }
  }

  async openExerciseFilter(): Promise<void> {
    // Logic to open the exercise filter dialog
    const selectedExercise = await this.modalService.openSelectExercise();
    if (selectedExercise) {
      const exercisesArray = this.workoutForm.get('exercises') as FormArray;
      const blankSets: ISetEntry[] = Array.from({ length: 3 }, () => ({
        reps: 10,
        weight: 0,
      }));
      exercisesArray.push(
        new FormGroup({
          exercise_id: new FormControl(selectedExercise.id, [Validators.required]),
          position: new FormControl(exercisesArray.length + 1, [Validators.required]),
          exercise: new FormControl(selectedExercise, [Validators.required]),
          sets: new FormArray(blankSets.map(set => this.createSetFormGroup(set))),
          rest: new FormControl(60, [Validators.required]),
          // Add other fields from IWorkoutExercise as needed
        })
      );
    }
  }

  private createSetFormGroup(set: ISetEntry): FormGroup {
    return new FormGroup({
      reps: new FormControl(set.reps, [Validators.required, Validators.min(1)]),
      weight: new FormControl(set.weight, [Validators.required, Validators.min(0)]),
    });
  }

  onCancel(): void {
    this.dialogRef.close(null);
  }

  dismissDialog(): void {
    this.dialogRef.close(null);
  }

  onImageSelect(imageUrl: string): void {
    // Store the original URL for the workout record
    this.workoutForm.patchValue({ selectedImageUrl: imageUrl });
  }

  isImageSelected(imageUrl: string): boolean {
    return this.workoutForm.get('selectedImageUrl')?.value === imageUrl;
  }

  onImageError(event: Event, image: { name: string; url: string; optimizedUrl: string }): void {
    // Fallback to original URL if optimized version fails to load
    const imgElement = event.target as HTMLImageElement;
    if (imgElement.src === image.optimizedUrl) {
      imgElement.src = image.url;
    }
  }
}
