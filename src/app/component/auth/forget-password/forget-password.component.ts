import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Component, inject,ViewEncapsulation  } from '@angular/core';
import {  OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { StrongPasswordRegx, StrongEmailRegx } from '../validation.utils';
import { Auth, AuthErrorCodes, GoogleAuthProvider, signInWithEmailAndPassword,
createUserWithEmailAndPassword,AuthProvider,sendEmailVerification ,sendPasswordResetEmail } from '@angular/fire/auth';
import { FacebookAuthProvider, getAuth, GithubAuthProvider } from "firebase/auth";
import { signInWithPopup } from '@firebase/auth';
@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.css'
})
export class ForgetPasswordComponent {
  userForm: FormGroup;

  constructor() {
    this.userForm = new FormGroup({
      email: new FormControl("", [Validators.required, Validators.pattern(StrongEmailRegx)]),
    });
  }

  ngOnInit(): void {}

  get email() {
    return this.userForm.get('email');
  }

  onSubmit() {
    const auth = getAuth();
    if (this.userForm.valid) {
      const email = this.userForm.value.email;
      sendPasswordResetEmail(auth, email)
  .then(() => {
    alert("email sent")
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    alert(errorMessage)
  });
    } else {
      console.log("Form is invalid");
    }
  }
}

