// import { CanActivateFn } from '@angular/router';

// export const patientProfileGuard: CanActivateFn = (route, state) => {
//   return true;
// };

// import { Injectable } from '@angular/core';
// import { CanActivate, Router, UrlTree } from '@angular/router';
// import { Observable } from 'rxjs';
// import { AuthService } from '../../services/auth.service';

// @Injectable({
//   providedIn: 'root'
// })
// export class PatientProfileGuard implements CanActivate {

//   constructor(private router: Router) {}

//   // | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree>

//   canActivate(): boolean  {
//     const profileData = JSON.parse(localStorage.getItem('profileTokens') || '{}');


//     if (!profileData) {
//       this.router.navigate(['/']);
//       return false;
//     }

//     const isEmailVerified = profileData.isEmailVerified;

//     if (isEmailVerified === false) {
//       return true; // Allow access
//     }

//     // If already verified or malformed data, redirect
//     this.router.navigate(['/']);
//     return false;
//   }
// }
