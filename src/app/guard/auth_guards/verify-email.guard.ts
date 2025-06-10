
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
    const isProfileSetupComplete = profile.isProfileSetupComplete;

    if (isEmailVerified === false || isEmailVerified === undefined) {
      return true; // Allow access to /verify-email
    }

    if (isProfileSetupComplete === false ) {
      return true;
    }

    // If already verified or malformed data, redirect
    console.log('hi from verify email 2');
    this.router.navigate(['/']);
    return false;
  }
}



