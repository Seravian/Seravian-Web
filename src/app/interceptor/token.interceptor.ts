// import { HttpInterceptorFn } from '@angular/common/http';

// export const tokenInterceptor: HttpInterceptorFn = (req, next) => {

//   const token = localStorage.getItem('token');
//   // console.log('Token:', token);
//   const newRequest = req.clone({
//     setHeaders: {
//       Authorization: `Bearer ${token}`,
//     },
//   });

//   return next(newRequest);
// };

import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service'; // adjust if needed
import { catchError, switchMap, throwError } from 'rxjs';
import { Router } from '@angular/router';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // const isPublicRequest = req.url.includes('/auth/register');
  // if (isPublicRequest) {
  //   return next(req); // Bypass token logic
  // }


  const token = authService.DecryptToken(JSON.parse(localStorage.getItem('profileTokens') || '{}').accessToken);
  let newRequest = req;

  if (token) {
    console.log('Token found in interceptor request:');
    newRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  if (!token) {console.log('Token not found in interceptor request');}

  return next(newRequest).pipe(
    catchError((error) => {
      // if(error.status === 400) {
      //   alert("looks like you are not logged in, please login again");
      //   router.navigate(['/']);
      //   return throwError(() => error);
      // }

      if (error.status === 401) {
        //  If token expired, try refreshing it
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
