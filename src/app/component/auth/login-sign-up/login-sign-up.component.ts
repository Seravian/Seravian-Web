// import { CommonModule } from '@angular/common';
// import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
// import { Component, inject } from '@angular/core';
// import { Router } from '@angular/router';
// import { StrongPasswordRegx, StrongEmailRegx } from '../validation.utils';
// import { Auth, AuthErrorCodes, GoogleAuthProvider, signInWithEmailAndPassword,
// createUserWithEmailAndPassword,AuthProvider,sendEmailVerification  } from '@angular/fire/auth';
// import { FacebookAuthProvider, getAuth, GithubAuthProvider } from "firebase/auth";
// import { signInWithPopup } from '@firebase/auth';

// @Component({
//   selector: 'app-login-sign-up',
//   standalone:true,
//   imports: [ReactiveFormsModule,CommonModule,FormsModule],
//   templateUrl: './login-sign-up.component.html',
//   styleUrl: './login-sign-up.component.css'
// })


// export class LoginsignupComponent  {
//   auth = inject(Auth);
//   private router = inject(Router)

//   // Firebase Provider
//   githubProvider = new GithubAuthProvider();
//   googleAuthProvider = new GoogleAuthProvider();
//   facebookAuthProvider = new FacebookAuthProvider();

//   isRegisterButtonDisabled: boolean = false;
//   registerButtonText: string = "Sign Up";
//   errorMessage: string = '';

//   isSignDivVisiable: boolean  = true;

//   signUpObj: SignUpModel  = new SignUpModel();
//   loginObj: LoginModel  = new LoginModel();
//   userForm: FormGroup;
//   isFormSubmitted: boolean = false;
//   // isLogin: boolean = true;
//   statusMessage: string = "";

//   constructor() {
//       this.userForm = new FormGroup({
//       name: new FormControl("",[Validators.required,Validators.minLength(3)]),
//       email: new FormControl("",[Validators.required,Validators.pattern(StrongEmailRegx)]),
//       password: new FormControl("",[Validators.required,Validators.pattern(StrongPasswordRegx)])
//     })
//   }


//   onRegister() {
//     this.isFormSubmitted = true;
//     this.isRegisterButtonDisabled = true;

//     if (this.userForm.valid) {
//       this.registerButtonText = "Processing...";
//       const newUser = this.userForm.value;
//       const localUser = localStorage.getItem("angular17users");
//       const users = localUser ? JSON.parse(localUser) : [];
//       users.push(newUser);

//       localStorage.setItem("angular17users", JSON.stringify(users));
//       this.statusMessage = "Registration Successful!";
//       createUserWithEmailAndPassword(this.auth, this.userForm.value.email, this.userForm.value.password)
//         .then((response) => {
//           console.log(response);
//           sendEmailVerification(response.user)
//                     .then(() => {
//                         console.log("Verification email sent.");
//                         this.statusMessage = "Registration successful! Please verify your email.";

//                         // Update button text to "Verifying"
//                         this.registerButtonText = "Verifying...";

//                         // Periodically check if the email is verified
//                         const checkVerification = setInterval(() => {
//                             response.user.reload().then(() => {
//                                 if (response.user.emailVerified) {
//                                     clearInterval(checkVerification);
//                                     this.isRegisterButtonDisabled = false;
//                                     this.registerButtonText = "Sign Up";
//                                     this.redirectToDashboardPage();
//                                 }
//                             });
//                         }, 3000); // Check every 3 seconds
//                     })
//                     .catch((verificationError) => {
//                         console.error("Error sending verification email:", verificationError);
//                         this.errorMessage = "Failed to send verification email. Please try again.";
//                         this.isRegisterButtonDisabled = false;
//                         this.registerButtonText = "Sign Up";
//                     });
//             })
//         .catch(error => {
//           console.log(error)
//           this.isFormSubmitted = false;
//           this.isRegisterButtonDisabled = false;
//           this.registerButtonText = "Sign Up";
//           console.error('error:', error);
//           if (error instanceof Error) {
//             if (error.message.includes(AuthErrorCodes.INVALID_EMAIL)) {
//               this.errorMessage = "Email is not valid";
//             }
//             else if (error.message.includes('auth/invalid-credential')) {
//               this.errorMessage = 'Invalid Email/Passowrd';
//             }
//             else if (error.message.includes(AuthErrorCodes.WEAK_PASSWORD)) {
//               this.errorMessage = 'Please enter a stronger password';
//             }
//             else if (error.message.includes(AuthErrorCodes.EMAIL_EXISTS)) {
//               this.errorMessage = 'The email is already used for another account';
//             }
//             else {
//               this.errorMessage = 'Something went wrong, please try again.';
//             }
//           }
//         })
//     } else {
//       this.statusMessage = "Please complete all fields correctly.";
//     }
//   }

//   onLogin() {
//     this.isFormSubmitted = true;
//     this.statusMessage = '';

//     if (this.userForm.controls['email'].valid && this.userForm.controls['password'].valid) {
//         const email = this.userForm.value.email;
//         const password = this.userForm.value.password;

//         // Use Firebase signInWithEmailAndPassword
//         signInWithEmailAndPassword(this.auth, email, password)
//             .then((response) => {
//                 // Check if the user's email is verified
//                 if (response.user.emailVerified) {
//                     console.log("Login successful:", response);
//                     this.statusMessage = "Login successful!";
//                     localStorage.setItem('loggedUser', JSON.stringify(response.user));
//                     this.router.navigateByUrl('/dashboard');
//                 } else {
//                     this.statusMessage = "This account not exist";
//                 }
//             })
//             .catch((error) => {
//                 console.error("Login error:", error);
//                 if (error.code === 'auth/user-not-found') {
//                     this.statusMessage = "User not found. Please check your email.";
//                 } else if (error.code === 'auth/wrong-password') {
//                     this.statusMessage = "Incorrect password. Please try again.";
//                 } else {
//                     this.statusMessage = "Something went wrong. Please try again later.";
//                 }
//             });
//     } else {
//         this.statusMessage = "Please complete all fields correctly.";
//     }
// }



// onSignInWithGoogle() {
//   signInWithPopup(this.auth, this.googleAuthProvider)
//     .then(response => {
//       const user = response.user;
//       if (user.metadata.creationTime === user.metadata.lastSignInTime) {
//         this.router.navigate(['/info']);
//       } else {
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

//   redirectToDashboardPage() {
//     this.router.navigate(['/dashboard']);
//   }
//   redirectToInfo(){
//     this.router.navigate(['/info']);
//   }
// }
// export class SignUpModel  {
//   name: string;
//   email: string;
//   password: string;

//   constructor() {
//     this.email = "";
//     this.name = "";
//     this.password= ""
//   }
// }

// export class LoginModel  {
//   email: string;
//   password: string;

//   constructor() {
//     this.email = "";
//     this.password= ""
//   }
// }


import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { StrongPasswordRegx, StrongEmailRegx } from '../validation.utils';
import { Auth, AuthErrorCodes, createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword } from '@angular/fire/auth';
import { FacebookAuthProvider, GithubAuthProvider, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

@Component({
  selector: 'app-login-sign-up',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './login-sign-up.component.html',
  styleUrl: './login-sign-up.component.css'
})
export class LoginsignupComponent {
  private auth = inject(Auth);
  private router = inject(Router);

  // Firebase Providers
  private providers = {
    google: new GoogleAuthProvider(),
    facebook: new FacebookAuthProvider(),
    github: new GithubAuthProvider()
  };

  userForm: FormGroup;
  isSignDivVisiable: boolean  = true;
  isRegisterButtonDisabled = false;
  registerButtonText = "Sign Up";
  errorMessage = '';
  statusMessage = '';
  isFormSubmitted = false;
  signUpObj: SignUpModel  = new SignUpModel();
  loginObj: LoginModel  = new LoginModel();

  constructor() {
    this.userForm = new FormGroup({
      name: new FormControl("", [Validators.required, Validators.minLength(3)]),
      email: new FormControl("", [Validators.required, Validators.pattern(StrongEmailRegx)]),
      password: new FormControl("", [Validators.required, Validators.pattern(StrongPasswordRegx)])
    });
  }

  // Helper function for handling provider-based sign-in
  private handleProviderSignIn(provider: GoogleAuthProvider | FacebookAuthProvider | GithubAuthProvider) {
    signInWithPopup(this.auth, provider)
      .then(response => {
        const isNewUser = response.user.metadata.creationTime === response.user.metadata.lastSignInTime;
        this.router.navigate([isNewUser ? '/info' : '/dashboard']);
      })
      .catch(error => this.handleError(error, "sign-in"));
  }

  // Unified error handling
  private handleError(error: any, context: string) {
    console.error(`${context} error:`, error);

    const errorMapping: Record<string, string> = {
      'auth/user-not-found': "User not found. Please check your email.",
      'auth/wrong-password': "Incorrect password. Please try again.",
      'auth/email-already-in-use': "The email is already used for another account.",
      'auth/invalid-email': "Invalid email format.",
      'auth/weak-password': "Password is too weak. Please enter a stronger password."
    };

    this.errorMessage = errorMapping[error.code] || "Something went wrong. Please try again.";
  }

  // User registration
  onRegister() {
    this.isFormSubmitted = true;
    if (this.userForm.invalid) {
      this.statusMessage = "Please complete all fields correctly.";
      return;
    }

    this.isRegisterButtonDisabled = true;
    this.registerButtonText = "Processing...";
    const { email, password } = this.userForm.value;

    createUserWithEmailAndPassword(this.auth, email, password)
      .then(response => this.handleEmailVerification(response.user))
      .catch(error => {
        this.handleError(error, "registration");
        console.log(error)
        this.resetRegisterButton();
      });
  }

  // Email verification handling
  private handleEmailVerification(user: any) {
    sendEmailVerification(user)
      .then(() => {
        this.statusMessage = "Registration successful! Please verify your email.";
        this.checkEmailVerification(user);
      })
      .catch(error => {
        this.handleError(error, "email verification");
        this.resetRegisterButton();
      });
  }

  private checkEmailVerification(user: any) {
    const interval = setInterval(() => {
      user.reload().then(() => {
        if (user.emailVerified) {
          clearInterval(interval);
          this.resetRegisterButton();
          this.redirectTo('/dashboard');
        }
      });
    }, 3000); // Check every 3 seconds
  }

  private resetRegisterButton() {
    this.isRegisterButtonDisabled = false;
    this.registerButtonText = "Sign Up";
  }

  // User login
  onLogin() {
    this.isFormSubmitted = true;

    if (this.userForm.controls['email'].invalid && this.userForm.controls['password'].invalid) {
      this.statusMessage = "Please complete all fields correctly.";
      console.log(this.errorMessage)
      return;
    }

    const { email, password } = this.userForm.value;

    signInWithEmailAndPassword(this.auth, email, password)
      .then(response => {
        if (response.user.emailVerified) {
          this.statusMessage = "Login successful!";
          localStorage.setItem('loggedUser', JSON.stringify(response.user));
          this.redirectTo('/dashboard');
        } else {
          this.statusMessage = "Please verify your email.";
        }
      })
      .catch(error => this.handleError(error, "login"));
  }

  // Social sign-in methods
  onSignInWithGoogle() {
    this.handleProviderSignIn(this.providers.google);
  }

  onSignInWithFacebook() {
    this.handleProviderSignIn(this.providers.facebook);
  }

  onSignInWithGithub() {
    this.handleProviderSignIn(this.providers.github);
  }

  // Navigation helpers
  private redirectTo(route: string) {
    this.router.navigate([route]);
  }
}

// Models for SignUp and Login
export class SignUpModel {
  name = '';
  email = '';
  password = '';
}

export class LoginModel {
  email = '';
  password = '';
}
