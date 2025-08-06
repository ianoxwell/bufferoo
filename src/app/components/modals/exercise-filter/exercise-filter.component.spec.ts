import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExerciseFilterComponent } from './exercise-filter.component';
import { AppStore } from '@app/app.store';
import { MatDialogRef } from '@angular/material/dialog';
import { signal } from '@angular/core';

describe('ExerciseFilterComponent', () => {
  let component: ExerciseFilterComponent;
  let fixture: ComponentFixture<ExerciseFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExerciseFilterComponent],
      providers: [
        { provide: AppStore, useValue: { exercises: signal([]), exerciseFilter: signal(null), setExerciseFilter: () => undefined } },
        { provide: MatDialogRef, useValue: { close: () => undefined } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ExerciseFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
