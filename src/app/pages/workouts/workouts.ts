import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AppStore } from '@app/app.store';
import { WorkoutCardComponent } from '@app/components/workout-card/workout-card';
import { ModalService } from '@app/core/modal-service';
import { SupabaseService } from '@app/core/supabase.service';
import { exampleWorkout, IWorkout } from '@app/models/workout.model';

@Component({
  selector: 'app-workouts',
  imports: [MatButtonModule, WorkoutCardComponent, MatIconModule],
  templateUrl: './workouts.html',
  styleUrl: './workouts.scss',
})
export class WorkoutsComponent implements OnInit {
  readonly supabaseService = inject(SupabaseService);
  readonly appStore = inject(AppStore);
  readonly modalService = inject(ModalService);
  workouts: IWorkout[] = [];

  async ngOnInit() {
    // Fetch initial workouts or any other setup needed
    this.workouts = await this.supabaseService.getPublicWorkouts();
    console.log('Fetched workouts:', this.workouts);
  }

  async onAddExampleWorkout() {
    const session = this.appStore.session();
    console.log('Adding example workout for user:', session?.user);
    try {
      const { data, error } = await this.supabaseService.createWorkout(exampleWorkout, session?.user?.id);
      if (error) {
        console.error('Error adding example workout:', error);
        alert('Failed to add example workout. Please try again.');
      } else {
        console.log('Example workout added successfully:', data);
        this.workouts = await this.supabaseService.getPublicWorkouts();
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      alert('An unexpected error occurred. Please try again later.');
    }
  }

  async onAddWorkout() {
    try {
      const createdWorkout = await this.modalService.openCreateWorkout();
      const session = this.appStore.session();

      if (createdWorkout) {
        const { data, error } = await this.supabaseService.createWorkout(createdWorkout, session?.user?.id);

        if (error) {
          throw error;
        }
        console.log('New workout created successfully:', data);
        // Refresh the workouts list
        this.workouts = await this.supabaseService.getPublicWorkouts();
      }
    } catch (error) {
      console.error('Error in workout creation flow:', error);
      await this.modalService.alert('Error', 'An unexpected error occurred while creating the workout.');
    }
  }
}
