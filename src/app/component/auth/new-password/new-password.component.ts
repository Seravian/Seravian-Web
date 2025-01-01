import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
export class NewPasswordComponent {
  userForm: FormGroup;

  constructor() {    this.userForm = new FormGroup({
    password: new FormControl("",[Validators.required,Validators.pattern(StrongPasswordRegx)])
  })
}

  ngOnInit(): void {}

  get email() {
    return this.userForm.get('password');
  }

  onSubmit() {
    const auth = getAuth();
    if (this.userForm.valid) {
      const password = this.userForm.value.password;
      sendPasswordResetEmail(auth, password)
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
