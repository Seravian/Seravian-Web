// import { CanActivateFn } from '@angular/router';

// export const verifyEmailGuard: CanActivateFn = (route, state) => {
//   return true;
// };

// import { Injectable } from '@angular/core';
// import { CanActivate, Router, UrlTree } from '@angular/router';

// @Injectable({
//   providedIn: 'root'
// })
// export class VerifyEmailGuard implements CanActivate {

//   constructor(private router: Router) {}

//   canActivate(): boolean | UrlTree {
//     const profileJson = localStorage.getItem('profile');

//     if (!profileJson) {
//       // Block navigation and stay on the current page
//       console.log('hi from verify email 1');
//       return this.router.parseUrl(this.router.url);
//     }

//     const profile = JSON.parse(profileJson);
//     const isEmailVerified = profile.isEmailVerified;

//     if (isEmailVerified === false) {
//       return true; // Allow access to /verify-email
//     }

//     // Redirect to current route to stay in place
//     console.log('hi from verify email 2');
//     return this.router.parseUrl(this.router.url);
//   }
// }

// verify-email.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class VerifyEmailGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    const profileJson = localStorage.getItem('profile');
    if (!profileJson) {
      this.router.navigate(['/']);
      return false;
    }

    const profile = JSON.parse(profileJson);
    const isEmailVerified = profile.isEmailVerified;

    if (isEmailVerified === false) {
      return true; // Allow access to /verify-email
    }

    // If already verified or malformed data, redirect
    this.router.navigate(['/']);
    return false;
  }
}



