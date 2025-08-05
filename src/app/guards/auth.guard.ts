import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SupabaseService } from '@app/supabase.service';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, map, first } from 'rxjs/operators';

export const authGuard: CanActivateFn = () => {
  const supabase = inject(SupabaseService);
  const router = inject(Router);

  const isSessionLoaded$ = toObservable(supabase.isSessionLoaded);

  return isSessionLoaded$.pipe(
    filter(isLoaded => isLoaded),
    first(),
    map(() => {
      const session = supabase.session();
      console.log('AuthGuard checking session (after loaded):', session);
      if (session) {
        return true;
      }

      router.navigate(['/auth']);
      return false;
    })
  );
};
