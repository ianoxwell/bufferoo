import { inject, Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { ConfirmModalComponent } from '@components/modals/confirm-modal/confirm-modal';
import { EMessageStatus, ICreateDialogInput, IDialogText } from '@models/dialog.model';
import { BehaviorSubject, Observable, switchMap, take, tap, timer } from 'rxjs';
import { getAnimationDuration } from './animation';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private readonly dialog = inject(MatDialog);
  private isDialogOpen$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private readonly animationTotalDelay: number;
  private readonly animationInLength: number;
  private readonly animationOutLength: number;
  constructor() {
    this.animationTotalDelay = getAnimationDuration(400);
    this.animationInLength = getAnimationDuration(300);
    this.animationOutLength = getAnimationDuration(200);
  }

  /**
   * Opens Material UI dialog boxes with given parameters, second type
   * @template {T} T The return type.
   * @template {DT} DT the data type for the dialog component.
   * @returns a generic observable of input T.
   */
  createDialog<T, DT>(dialogDetails: ICreateDialogInput<DT>): Observable<T> {
    const options: MatDialogConfig = this.createDialogOptions<DT>(dialogDetails);
    const dialogRef = this.dialog.open(dialogDetails.component, options);

    return dialogRef.afterOpened().pipe(
      take(1),
      switchMap(() => {
        this.isDialogOpen$.next(this.isDialogCurrentlyOpen());
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
      .pipe(tap(() => this.isDialogOpen$.next(this.isDialogCurrentlyOpen())))
      .subscribe();
  }

  /** Check if any dialog is currently open. */
  isDialogCurrentlyOpen(): boolean {
    return !!this.dialog.openDialogs.length;
  }

  getIsDialogOpen(): Observable<boolean> {
    return this.isDialogOpen$.asObservable();
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
  confirm(
    status: EMessageStatus,
    title: string,
    message: string,
    isAlert = false,
    buttonText = 'Confirm'
  ): Observable<boolean> {
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
  // alert(heading: string, err: any, confirmButton = 'Okay'): Observable<void> {
  //   // if error message if of type HttpErrorResponse then it will have a message
  //   const message = !!err.message ? err.message : err;
  //   const data = { status: MessageStatus.Error, heading, message, confirmButton };
  //   return this.createDialog<void>(data, ConfirmDialogComponent);
  // }
}
