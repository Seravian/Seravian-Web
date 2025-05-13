import { AuthResponse } from './../../../interfaces/auth-response';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Component, inject,ViewEncapsulation  } from '@angular/core';
import {  OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StrongPasswordRegx, StrongEmailRegx } from '../validation.utils';
import { AuthService } from '../../../services/auth.service';
import { register } from 'swiper/element';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { id } from 'intl-tel-input/i18n';

@Component({
  selector: 'app-login-sign-up',
  standalone:true,
  imports: [ReactiveFormsModule,CommonModule,FormsModule],
  templateUrl: './login-sign-up.component.html',
  styleUrl: './login-sign-up.component.css',
  encapsulation: ViewEncapsulation.Emulated
})


export class LoginsignupComponent  {

  isRegisterButtonDisabled: boolean = false;
  registerButtonText: string = "Sign Up";
  errorMessage: string = '';
  toggleSignIn() {
    this.isSignDivVisiable = false;
    this.statusMessage = ''; // Clear the status message when switching to Sign In
  }

  toggleSignUp() {
    this.isSignDivVisiable = true;
    this.statusMessage = ''; // Clear the status message when switching to Sign Up
  }
  passwordsMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    return password && confirmPassword && password.value !== confirmPassword.value
      ? { passwordMismatch: true }
      : null;
  }
  // auth = inject(Auth);


  private router = inject(Router)

  isSignDivVisiable: boolean  = true;
  signUpForm: FormGroup;
  loginForm: FormGroup;  isFormSubmitted: boolean = false;
  isLogin: boolean = true;
  statusMessage: string = "";

  constructor(private authService: AuthService) {   this.signUpForm = new FormGroup({
    email: new FormControl("", [Validators.required, Validators.pattern(StrongEmailRegx)]),
    password: new FormControl("", [Validators.required, Validators.pattern(StrongPasswordRegx)]),
    confirmPassword: new FormControl("", [Validators.required])
  }, { validators: this.passwordsMatchValidator }); // <-- form-level validator

  this.loginForm = new FormGroup({
    email: new FormControl("", [Validators.required, Validators.pattern(StrongEmailRegx)]),
    password: new FormControl("", [Validators.required, Validators.pattern(StrongPasswordRegx)])
  });
}

  onRegister() {
    this.authService
    this.isFormSubmitted = true;
    this.isRegisterButtonDisabled = true;
    this.registerButtonText = "Sign Up";


    if (this.signUpForm.valid) {
      this.registerButtonText = "Processing...";

      this.authService.register(this.signUpForm.value).subscribe({
        next:(response)=>{

          // const profile = {
          //   id: response.userId,
          //   fullName: response.fullName,
          //   email: response.email,
          //   dateOfBirth: response.dateOfBirth,
          //   gender: response.gender,
          //   role: response.role,
          //   isEmailVerified: response.isEmailVerified
          // };

          // localStorage.setItem('profile', JSON.stringify(profile));

          // const profileTokens = {
          //   accessToken: response.tokens.accessToken,
          //   refreshToken: response.tokens.refreshToken,
          //   accessTokenExpirationUtc: response.tokens.accessTokenExpirationUtc
          // }


          // localStorage.setItem('profileTokens', JSON.stringify(profileTokens));


          this.statusMessage = "Registration successful! Redirecting...";
          sessionStorage.setItem('email', response.email);
          this.router.navigate(['/verify-email']);
        },
        error:(err:HttpErrorResponse)=>{
          if(err!.status === 400){
            console.log("validation");
            this.statusMessage = "Email is used";
          }
          this.isRegisterButtonDisabled = false;
          this.registerButtonText = "Sign Up";
        },
          complete:() => {
            console.log('register'),
            this.isRegisterButtonDisabled = false;
            this.registerButtonText = "Sign Up";
          }
      });
    } else {
      this.statusMessage = "Please complete all fields correctly.";
      this.isRegisterButtonDisabled = false; // re-enable the button if the form is invalid
      this.registerButtonText = "Sign Up";
    }

  }


  IsUserValid : boolean = false;
  onLogin() {
    this.isFormSubmitted = true;
    this.statusMessage = '';

    if (!this.loginForm.valid) {
      this.statusMessage = "Please complete all fields correctly.";
      return;
    }
    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        console.log(response);


        const profile = {
          id: response.userId,
          fullName: response.fullName,
          email: response.email,
          dateOfBirth: response.dateOfBirth,
          gender: response.gender,
          role: response.role,
          isEmailVerified: response.isEmailVerified,
          isProfileSetupComplete: response.isProfileSetupComplete
        };
        console.log("hi",profile)

        localStorage.setItem('profile', JSON.stringify(profile));


        const profileTokens = {
          accessToken: this.authService.EncryptToken(response.tokens.accessToken!),
          refreshToken: this.authService.EncryptToken(response.tokens.refreshToken!),
          accessTokenExpirationUtc: response.tokens.accessTokenExpirationUtc
        }

        console.log("encrypted tokens after signing in",profileTokens)

        localStorage.setItem('profileTokens', JSON.stringify(profileTokens));

        console.log('Login successful:', response);
        if(!response.isEmailVerified){
          this.router.navigate(['verify-email']);
        }
        else if (!response.isProfileSetupComplete) {
          this.router.navigate(['doctor-or-patient']);
        } else {
          this.router.navigate(['dashboard']);
        } // Or wherever you want to redirect
      },
      error: (error) => {
        if (error.error?.errors) {
          const errors = error.error.errors;
          const allMessages = Object.values(errors).flat();
          this.statusMessage = String(allMessages[0]);
        } else {
          console.log('Login error:', error);
          this.statusMessage = 'Unexpected error occurred. Please try again.';

        }
      }
    })
  }


  Forget(){
    this.router.navigate(['/forget-password']);
  }
  redirectToDashboardPage() {
    this.router.navigate(['/dashboard']);
  }
  redirectToInfo(){
    this.router.navigate(['/info']);
  }
}
export class SignUpModel  {
  name: string;
  email: string;
  password: string;

  constructor() {
    this.email = "";
    this.name = "";
    this.password= ""
  }
}

export class LoginModel  {
  email: string;
  password: string;

  constructor() {
    this.email = "";
    this.password= ""
  }
}

