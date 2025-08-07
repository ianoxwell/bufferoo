import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { environment } from '@env/environment';
import { IExercise } from '@models/exercise.model';

@Component({
  selector: 'app-exercise-card',
  templateUrl: './exercise-card.component.html',
  styleUrls: ['./exercise-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatCardModule,
    MatChipsModule,
    MatIconModule,
    NgOptimizedImage,
  ],
})
export class ExerciseCardComponent {
  @Input({ required: true }) exercise!: IExercise;
  @Input() isSelected = false;
  @Input() showSelection = true;
  @Input() compactMode = false;
  @Output() exerciseSelected = new EventEmitter<IExercise>();
  @Output() exerciseClicked = new EventEmitter<IExercise>();

  onCardClick() {
    this.exerciseClicked.emit(this.exercise);
    if (this.showSelection) {
      this.exerciseSelected.emit(this.exercise);
    }
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.onCardClick();
    }
  }

  getOptimizedExerciseImageUrl(imageName: string): string {
    if (!imageName) return '';
    
    // Create optimized URL with Supabase image transformation
    // Using 240x240 for exercise cards (square for consistent layout)
    return `${environment.exerciseBucket}${imageName}?width=240&height=240&resize=cover&quality=85`;
  }

  getForceIcon(force: string): string {
    switch (force.toLowerCase()) {
      case 'push': return 'trending_up';
      case 'pull': return 'trending_down';
      case 'static': return 'pause';
      default: return 'help_outline';
    }
  }

  getLevelIcon(level: string): string {
    switch (level.toLowerCase()) {
      case 'beginner': return 'star_border';
      case 'intermediate': return 'star_half';
      case 'expert': return 'star';
      default: return 'help_outline';
    }
  }
}
