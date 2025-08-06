import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { IWorkout } from '@app/models/workout.model';

@Component({
  selector: 'app-workout-card',
  templateUrl: './workout-card.html',
  styleUrls: ['./workout-card.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class WorkoutCardComponent {
  @Input() workout!: IWorkout;
}
