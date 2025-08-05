import { ComponentType } from '@angular/cdk/overlay';


export interface IDialogText {
  title: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  isTimerVisible?: boolean;
  isCancelVisible?: boolean;
  disableClose?: boolean;
}
/** The message data to pass to the dialog component with extra data as type T. */
export interface DialogMessageData<T> extends IDialogText {
  status: EMessageStatus;
  isMobile?: boolean;
  isAlert: boolean;
  data?: T;
}

/** Create Dialog input data of type T for any additional data to pass in. */
export interface ICreateDialogInput<T> {
  id: string;
  /** Add additional data types here | newDialogMessageData */
  data: DialogMessageData<T>;
  component: ComponentType<unknown>;
  width?: string;
  maxWidth?: string;
  top?: string;
  bottom?: string;
  height?: string;
  maxHeight?: string;
  panelClass?: string;
}


/** A representation of the status types */
export enum EMessageStatus {
  None = '',
  Success = 'success',
  Error = 'error',
  Warning = 'warning',
  Information = 'information',
  Critical = 'critical',
  Alert = 'alert'
}