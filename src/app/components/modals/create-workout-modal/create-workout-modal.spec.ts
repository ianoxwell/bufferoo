import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CreateWorkoutModalComponent } from './create-workout-modal';

describe('CreateWorkoutModalComponent', () => {
  let component: CreateWorkoutModalComponent;
  let fixture: ComponentFixture<CreateWorkoutModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateWorkoutModalComponent, NoopAnimationsModule],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: { title: 'Test' } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateWorkoutModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
