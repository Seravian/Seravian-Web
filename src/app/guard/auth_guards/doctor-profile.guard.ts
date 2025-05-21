import { CanActivateFn } from '@angular/router';

export const doctorProfileGuard: CanActivateFn = (route, state) => {
  return true;
};
