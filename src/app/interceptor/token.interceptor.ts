import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service'; // adjust if needed
import { catchError, switchMap, throwError } from 'rxjs';
import { Router } from '@angular/router';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const token = authService.DecryptToken(JSON.parse(localStorage.getItem('profileTokens') || '{}').accessToken);
  let newRequest = req;

  if (token) {
    // console.log('Token found in interceptor request:');
    newRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  if (!token) {console.log('Token not found in interceptor request');}

  return next(newRequest).pipe(
    catchError((error) => {

      if (error.status === 401) {
        //  If token expired, try refreshing it
        const refreshToken = JSON.parse(localStorage.getItem('profileTokens') || '{}').refreshToken;
        const accessToken = JSON.parse(localStorage.getItem('profileTokens') || '{}').accessToken;
        if (!refreshToken && accessToken) {
          console.error('Refresh token not found');
          alert("timeout, please login again");
          router.navigate(['/']);
        }
        if (!refreshToken && !accessToken) {
          console.log('user is not logged in');
          // return;
        }
        return authService.refreshTokens().pipe(
          switchMap((tokens) => {
            //  Retry original request with new access token
            const retryRequest = req.clone({
              setHeaders: {
                Authorization: `Bearer ${tokens.accessToken}`,
              },
            });

            return next(retryRequest);
          }),
          catchError((refreshError) => {
            //  Refresh token failed (maybe refresh token expired too)
            console.error('Refresh token failed', refreshError);
            // TODO: Maybe redirect to login page here
            return throwError(() => refreshError);
          })
        );
      }

      // If it's a different error, just throw it
      return throwError(() => error);
    })
  );
};
