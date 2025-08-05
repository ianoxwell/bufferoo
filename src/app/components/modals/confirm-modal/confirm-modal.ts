import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { SafeHtmlPipe } from '@core/safe-html-pipe';
import { DialogMessageData, IDialogText } from '@models/dialog.model';

@Component({
  selector: 'app-confirm-modal',
  imports: [CommonModule, MatButtonModule, MatDialogModule, MatIconModule, SafeHtmlPipe],
  templateUrl: './confirm-modal.html',
  styleUrl: './confirm-modal.scss',
})
export class ConfirmModalComponent implements OnInit {
  // This component can be used to display a confirmation modal.
  // It can be extended with properties and methods as needed.
  // For example, you might want to add inputs for title, message, and buttons.
  // You can also handle the confirmation logic here.
  disableClose = true;
  private readonly oneSecond = 1000;
  public dialogRef = inject(MatDialogRef<ConfirmModalComponent>);
  public data = inject<DialogMessageData<IDialogText>>(MAT_DIALOG_DATA);

  ngOnInit(): void {
    this.setDialogDisableClose();
  }

  /** Triggered by button in dom, closes the dialog with positive or negative result. */
  onConfirmationSelected(result: boolean | undefined): void {
    this.dialogRef.close(result);
  }

  /** Closes dialog without result - triggered from close button in the DOM. */
  dismissDialog(): void {
    this.dialogRef.close(undefined);
  }

  /**
   * Determine if the modal can be dismissed via backdrop and close button in the DOM.
   * This is disabled by default as guest action is required unless specified.
   */
  setDialogDisableClose(): void {
    this.dialogRef.disableClose = this.disableClose =
      typeof this.data?.disableClose === 'boolean' ? this.data.disableClose : true;
  }
}
