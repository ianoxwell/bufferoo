import { Component, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  template: ''
})
export class ComponentBase implements OnDestroy {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ngUnsubscribe: Subject<any> = new Subject<any>();

  ngOnDestroy(): void {
    this.destroySubscriptions();
  }

  destroySubscriptions(): void {
    this.ngUnsubscribe.next(undefined);
    this.ngUnsubscribe.complete();
  }
}
