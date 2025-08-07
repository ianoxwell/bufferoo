import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { IWorkout } from '@app/models/workout.model';

@Component({
  selector: 'app-workout-card',
  templateUrl: './workout-card.html',
  styleUrls: ['./workout-card.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgOptimizedImage],
})
export class WorkoutCardComponent {
  @Input() workout!: IWorkout;

  getOptimizedImageUrl(originalUrl: string): string {
    if (!originalUrl) return '';
    
    // If it's already a Supabase URL with transformations, return as-is
    if (originalUrl.includes('?width=')) {
      return originalUrl;
    }
    
    // Add Supabase image transformation for workout card display
    // Using 400x300 for good quality on various card sizes
    return `${originalUrl}?width=400&height=300&resize=cover&quality=85`;
  }
}
