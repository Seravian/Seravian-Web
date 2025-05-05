
import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  UrlTree
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private router: Router
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    if (this.authService.isLoggedIn()) {
      return of(true);
    } else {
      const refreshToken = this.authService.DecryptToken(JSON.parse(localStorage.getItem('profileTokens') || '{}').refreshToken);
      // const refreshToken = JSON.parse(localStorage.getItem('profileTokens') || '{}').refreshToken;
      if (!refreshToken) {
        console.log('1-no refresh token found!!!');
        return of(this.router.parseUrl(this.router.url));
      }

      return this.http
        .post<any>(`${environment.APIUrl}/refresh-token`, { refreshToken })
        .pipe(
          map((response) => {
            // Assume response contains: accessToken, refreshToken, accessTokenExpirationUtc
            localStorage.setItem('profileTokens', JSON.stringify(response));
            return true; // Retry navigation
          }),
          catchError(() => {
            // If refresh fails, redirect to login
            console.log('there was an error in auth guard');
            return of(this.router.parseUrl(this.router.url));
          })
        );
    }
  }
}

