import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { map, take } from 'rxjs/operators';


import { firstValueFrom } from 'rxjs';

export const authGuard: CanActivateFn = async (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  const user = await firstValueFrom(authService.currentUser);
  if (user) {
    return true;
  }
  router.navigate(['/login']);
  return false;
};

export const publicGuard: CanActivateFn = async (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  const user = await firstValueFrom(authService.currentUser);
  if (!user) {
    return true;
  }
  router.navigate(['/home']);
  return false;
};