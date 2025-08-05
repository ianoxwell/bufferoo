import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from '@env/environment';

export function getAnimationModule() {
  return getIsAnimationTestEnvironment() ? NoopAnimationsModule : BrowserAnimationsModule;
}

export function getIsAnimationTestEnvironment() {
  return environment.test;
}

export function getAnimationDuration(duration: number) {
  if (getIsAnimationTestEnvironment()) {
    return 0;
  }

  return duration;
}
