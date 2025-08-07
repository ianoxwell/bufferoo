import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { IWorkout } from '@models/workout.model';

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
  
  readonly data = inject<DialogMessageData<IDialogText>>(MAT_DIALOG_DATA);

  workoutForm!: FormGroup;
  isLoading = false;
  errorMessage = '';
  workoutImages: { name: string; url: string; optimizedUrl: string }[] = [];

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
      workout_exercises: [],
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
