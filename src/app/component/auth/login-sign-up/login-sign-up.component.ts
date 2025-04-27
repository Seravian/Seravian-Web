import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Component, inject,ViewEncapsulation  } from '@angular/core';
import {  OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StrongPasswordRegx, StrongEmailRegx } from '../validation.utils';
// import { Auth, AuthErrorCodes, GoogleAuthProvider, signInWithEmailAndPassword,
// createUserWithEmailAndPassword,AuthProvider,sendEmailVerification  } from '@angular/fire/auth';
// import { FacebookAuthProvider, getAuth, GithubAuthProvider } from "firebase/auth";
// import { signInWithPopup } from '@firebase/auth';
import { AuthService } from '../../../services/auth.service';
import { register } from 'swiper/element';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login-sign-up',
  standalone:true,
  imports: [ReactiveFormsModule,CommonModule,FormsModule],
  templateUrl: './login-sign-up.component.html',
  styleUrl: './login-sign-up.component.css',
  encapsulation: ViewEncapsulation.Emulated
})


export class LoginsignupComponent  {

  // githubProvider = new GithubAuthProvider();
  // googleAuthProvider = new GoogleAuthProvider();

  // facebookAuthProvider = new FacebookAuthProvider();
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

  // auth = inject(Auth);


  private router = inject(Router)

  isSignDivVisiable: boolean  = true;

  signUpObj: SignUpModel  = new SignUpModel();
  loginObj: LoginModel  = new LoginModel();
  userForm: FormGroup;
  isFormSubmitted: boolean = false;
  isLogin: boolean = true;
  statusMessage: string = "";
  // private router: Router, private authService: SocialAuthService
  constructor(private authService: AuthService) {    this.userForm = new FormGroup({
      // name: new FormControl("",[Validators.required,Validators.minLength(3)]),
      email: new FormControl("",[Validators.required,Validators.pattern(StrongEmailRegx)]),
      password: new FormControl("",[Validators.required,Validators.pattern(StrongPasswordRegx)])
    })
  }

  onRegister() {
    this.authService
    this.isFormSubmitted = true;
    this.isRegisterButtonDisabled = true;
    this.registerButtonText = "Sign Up";


    if (this.userForm.valid) {
      this.registerButtonText = "Processing...";

      this.authService.register(this.userForm.value).subscribe({
        next:(response)=>{
          console.log(response);
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

    if (this.userForm.controls['email'].valid && this.userForm.controls['password'].valid) {
        const email = this.userForm.value.email;
        const password = this.userForm.value.password;

        // Use Firebase signInWithEmailAndPassword
        // signInWithEmailAndPassword(this.auth, email, password)
        //     .then((response) => {
        //         // Check if the user's email is verified
        //         if (response.user.emailVerified) {
        //             console.log("Login successful:", response);
        //             this.statusMessage = "Login successful!";
        //             localStorage.setItem('loggedUser', JSON.stringify(response.user));
        //             this.router.navigateByUrl('/dashboard');
        //         } else {
        //             this.statusMessage = "This account not exist";
        //         }
        //     })
        //     .catch((error) => {
        //         console.error("Login error:", error);
        //         if (error.code === 'auth/user-not-found') {
        //             this.statusMessage = "User not found. Please check your email.";
        //         } else if (error.code === 'auth/wrong-password') {
        //             this.statusMessage = "Incorrect password. Please try again.";
        //         } else {
        //             this.statusMessage = "Something went wrong. Please try again later.";
        //         }
        //     });
    } else {
        this.statusMessage = "Please complete all fields correctly.";
    }
    this.authService.login(this.userForm.value).subscribe({
      next: (response) => {
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
          this.statusMessage = 'Unexpected error occurred. Please try again.';
        }
      }
    })
}



// onSignInWithGoogle() {
//   signInWithPopup(this.auth, this.googleAuthProvider)
//     .then(response => {
//       const user = response.user;

//       // Check if the user is new based on metadata
//       if (user.metadata.creationTime === user.metadata.lastSignInTime) {
//         // New user - navigate to the info page
//         this.router.navigate(['/info']);
//       } else {
//         // Existing user - navigate to the dashboard
//         this.router.navigate(['/dashboard']);
//       }
//     })
//     .catch(error => {
//       console.error('Error during Google sign-in:', error);
//       this.errorMessage = 'Something went wrong, please try again.';
//     });
// }

//   onSignInWithFacebook() {
//     const auth = getAuth();
//     const facebookAuthProvider = new FacebookAuthProvider();
//     this.facebookAuthProvider = facebookAuthProvider;


//     signInWithPopup(auth, facebookAuthProvider)
//       .then((response) => {
//         // The signed-in user info.
//         const user = response.user;

//       // Check if the user is new
//       if (user.metadata.creationTime === user.metadata.lastSignInTime) {
//         this.router.navigate(['/info']);
//       } else {
//         this.redirectToDashboardPage();
//       }
//     })
//       .catch((error) => {
//         // Log and handle the error
//         console.error("Facebook sign-in error:", error);

//         const errorCode = error.code;
//         const errorMessage = error.message;
//         const email = error.customData?.email || "Unknown email";
//         const credential = FacebookAuthProvider.credentialFromError(error);

//         console.error(`Error Code: ${errorCode}, Message: ${errorMessage}, Email: ${email}`);
//       });
//   }

//   onSignInWithGithub() {
//     const auth = getAuth();
//     const githubProvider = new GithubAuthProvider();
//     this.githubProvider = githubProvider;
//     signInWithPopup(auth, githubProvider)
//       .then((response) => {
//         const user = response.user;

//       // Check if the user is new
//       if (user.metadata.creationTime === user.metadata.lastSignInTime) {
//         this.router.navigate(['/info']);
//       } else {
//         this.redirectToDashboardPage();
//       }
//     }).catch((error) => {
//         console.error("Facebook sign-in error:", error);

//         const errorCode = error.code;
//         const errorMessage = error.message;
//         const email = error.customData?.email || "Unknown email";
//         const credential = FacebookAuthProvider.credentialFromError(error);

//         console.error(`Error Code: ${errorCode}, Message: ${errorMessage}, Email: ${email}`);
//       });
//   }
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

