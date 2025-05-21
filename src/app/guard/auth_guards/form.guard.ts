import { CanDeactivateFn } from '@angular/router';

export const formGuard: CanDeactivateFn<unknown> = (component, currentRoute, currentState, nextState) => {
  return true;
};
