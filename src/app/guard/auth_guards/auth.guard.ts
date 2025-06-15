
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
      // const refreshToken = this.authService.DecryptToken(JSON.parse(localStorage.getItem('profileTokens') || '{}').refreshToken);
      const refreshToken = JSON.parse(localStorage.getItem('profileTokens') || '{}').refreshToken;
      // console.log('refresh token:', refreshToken);
      if (!refreshToken) {
        // console.log('1-no refresh token found!!!');
        return of(this.router.parseUrl(this.router.url));
      }

      // return of(this.router.parseUrl(this.router.url));

      try {
        return this.authService.refreshTokens().pipe(
          map(() => true),
          catchError((error) => {
            // console.error('Token refresh failed in AuthGuard:', error);
            return of(this.router.parseUrl(this.router.url));
          })
        );
      } catch (err) {
        // console.error('Caught error before refresh call (e.g., missing token):', err);
        return of(this.router.parseUrl(this.router.url));
      }
    }
  }
}

