import { CommonModule } from '@angular/common';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Component, inject,ViewEncapsulation  } from '@angular/core';
import {  OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { StrongPasswordRegx, StrongEmailRegx } from '../validation.utils';
import { Auth, AuthErrorCodes, GoogleAuthProvider, signInWithEmailAndPassword,
createUserWithEmailAndPassword,AuthProvider,sendEmailVerification ,sendPasswordResetEmail } from '@angular/fire/auth';
import { FacebookAuthProvider, getAuth, GithubAuthProvider } from "firebase/auth";
@Component({
  selector: 'app-new-password',
  templateUrl: './new-password.component.html',
  styleUrl: './new-password.component.css'
})
export class NewPasswordComponent implements OnInit {
  userForm: FormGroup;
  private router = inject(Router)

  constructor() {
    this.userForm = new FormGroup({
      password: new FormControl("", [
        Validators.required,
        Validators.pattern(StrongPasswordRegx)
      ]),
      confirmPassword: new FormControl("", [
        Validators.required
      ])
    }, { validators: this.passwordsMatchValidator });
  }
  ngOnInit(): void {}

  get password() {
    return this.userForm.get('password');
  }

  get confirmPassword() {
    return this.userForm.get('confirmPassword');
  }

  passwordsMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    return password && confirmPassword && password.value !== confirmPassword.value
      ? { passwordMismatch: true }
      : null;
  }


  onSubmit() {
    if (this.userForm.valid) {
      const password = this.userForm.value.password;
      this.router.navigate(['/auth']);
    } else {
      console.log("Form is invalid");
    }
  }
}
