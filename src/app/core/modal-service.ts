import { inject, Injectable, signal } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { ConfirmModalComponent } from '@components/modals/confirm-modal/confirm-modal';
import { ExerciseFilterComponent } from '@components/modals/exercise-filter/exercise-filter.component';
import { EMessageStatus, ICreateDialogInput, IDialogText } from '@models/dialog.model';
import { IExerciseFilter } from '@models/exercise-filter.model';
import { Observable, switchMap, take, tap, timer, firstValueFrom } from 'rxjs';
import { getAnimationDuration } from './animation';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private readonly dialog = inject(MatDialog);

  // Convert to signal for reactive state
  private readonly _isDialogOpen = signal(false);
  readonly isDialogOpen = this._isDialogOpen.asReadonly();

  private readonly animationTotalDelay: number;
  private readonly animationInLength: number;
  private readonly animationOutLength: number;
  constructor() {
    this.animationTotalDelay = getAnimationDuration(400);
    this.animationInLength = getAnimationDuration(300);
    this.animationOutLength = getAnimationDuration(200);
  }

  /**
   * Opens Material UI dialog boxes with given parameters
   * @template {T} T The return type.
   * @template {DT} DT the data type for the dialog component.
   * @returns a Promise with the dialog result.
   */
  async createDialog<T, DT>(dialogDetails: ICreateDialogInput<DT>): Promise<T> {
    const options: MatDialogConfig = this.createDialogOptions<DT>(dialogDetails);
    const dialogRef = this.dialog.open(dialogDetails.component, options);

    // Update signal when dialog opens
    await firstValueFrom(dialogRef.afterOpened());
    this._isDialogOpen.set(this.isDialogCurrentlyOpen());

    // Wait for dialog to close and get result
    const result = await firstValueFrom(dialogRef.afterClosed());

    // Delay before updating signal to account for animations
    this.delayDialogOpenCheck();

    return result;
  }

  /**
   * Legacy Observable version for backward compatibility
   * @deprecated Use createDialog (Promise version) instead
   */
  createDialogObservable<T, DT>(dialogDetails: ICreateDialogInput<DT>): Observable<T> {
    const options: MatDialogConfig = this.createDialogOptions<DT>(dialogDetails);
    const dialogRef = this.dialog.open(dialogDetails.component, options);

    return dialogRef.afterOpened().pipe(
      take(1),
      switchMap(() => {
        this._isDialogOpen.set(this.isDialogCurrentlyOpen());
        return dialogRef.afterClosed();
      }),
      take(1),
      tap(() => {
        this.delayDialogOpenCheck();
      })
    );
  }

  private createDialogOptions<T>(dialogDetails: ICreateDialogInput<T>): MatDialogConfig {
    const options: MatDialogConfig = {
      id: dialogDetails.id,
      data: dialogDetails.data,
      ariaLabel: dialogDetails.data.title,
      role: dialogDetails.data.isAlert ? 'alertdialog' : 'dialog',
      width: dialogDetails.width || '60%',
      height: dialogDetails.height || '85vh',
      maxHeight: dialogDetails.maxHeight || '100%',
      maxWidth: dialogDetails.maxWidth || '100%',
      panelClass: dialogDetails.panelClass || 'bufferoo-dialog',
      disableClose: dialogDetails.data.disableClose || false,
    };

    if (dialogDetails.top) {
      options.position = { top: dialogDetails.top };
    }

    if (dialogDetails.bottom) {
      options.position = { ...options.position, bottom: dialogDetails.bottom };
    }

    return options;
  }

  delayDialogOpenCheck(): void {
    timer(this.animationTotalDelay)
      .pipe(tap(() => this._isDialogOpen.set(this.isDialogCurrentlyOpen())))
      .subscribe();
  }

  /** Check if any dialog is currently open. */
  isDialogCurrentlyOpen(): boolean {
    return !!this.dialog.openDialogs.length;
  }

  /**
   * Get dialog open state as signal (reactive)
   * @returns ReadonlySignal<boolean>
   */
  getIsDialogOpenSignal() {
    return this.isDialogOpen;
  }

  /**
   * @deprecated Use getIsDialogOpenSignal() instead for reactive state
   */
  getIsDialogOpen(): Observable<boolean> {
    // Simple implementation - just emit current value and complete
    return new Observable((subscriber) => {
      subscriber.next(this.isDialogOpen());
      subscriber.complete();
    });
  }

  /** Closes all open dialogs. */
  closeAllOpenDialogs(): void {
    this.dialog.closeAll();
  }

  /**
   * Filters the open dialogs by the id and closes with false or whatever object is passed in.
   * If no dialog by that id - then nothing happens.
   */
  closeDialogById(id: string, data?: unknown): void {
    this.dialog.openDialogs
      .filter((dialogRef: MatDialogRef<unknown, unknown>) => dialogRef.id === id)
      .forEach((dialogRef: MatDialogRef<unknown, unknown>) => dialogRef.close(data || false));
  }

  /** Opens a confirm dialog */
  async confirm(
    status: EMessageStatus,
    title: string,
    message: string,
    isAlert = false,
    buttonText = 'Confirm'
  ): Promise<boolean> {
    const data = { status, title, message, buttonText, isAlert };
    const options: ICreateDialogInput<IDialogText> = {
      id: 'confirmationDialog',
      data,
      component: ConfirmModalComponent,
      maxWidth: '60rem',
    };
    return this.createDialog<boolean, IDialogText>(options);
  }

  /** Opens an alert dialog */
  alert(title: string, err: string | HttpErrorResponse, confirmButton = 'Okay'): Promise<void> {
    // if error message if of type HttpErrorResponse then it will have a message
    const message =
      typeof err === 'string' ? err : Object.hasOwn(err, 'message') ? err.message : 'Oops and unknown error occurred';
    const data = { status: EMessageStatus.Error, title, message, confirmButton, isAlert: true };
    const options: ICreateDialogInput<IDialogText> = {
      id: 'confirmationDialog',
      data,
      component: ConfirmModalComponent,
      maxWidth: '60rem',
    };
    return this.createDialog<void, IDialogText>(options);
  }

  /** Opens the exercise filter dialog */
  async openExerciseFilter(): Promise<IExerciseFilter | null> {
    const options: ICreateDialogInput<null> = {
      id: 'exerciseFilterDialog',
      data: {status: EMessageStatus.Information, title: 'Filter Exercises', isAlert: false},
      component: ExerciseFilterComponent,
      width: '100vw',
      height: '100vh',
      maxWidth: '100vw',
      maxHeight: '100vh',
      panelClass: 'full-screen-dialog',
    };
    return this.createDialog<IExerciseFilter | null, null>(options);
  }
}
