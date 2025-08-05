import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { CanActivateFn, Router } from '@angular/router';
import { filter, first, map } from 'rxjs/operators';
import { AppStore } from '../app.store';

export const authGuard: CanActivateFn = () => {
  const appStore = inject(AppStore);
  const router = inject(Router);

  const isSessionLoaded$ = toObservable(appStore.isSessionLoaded);

  return isSessionLoaded$.pipe(
    filter(isLoaded => isLoaded),
    first(),
    map(() => {
      const session = appStore.session();
      console.log('AuthGuard checking session (after loaded):', session);
      if (session) {
        return true;
      }

      router.navigate(['/auth']);
      return false;
    })
  );
};
