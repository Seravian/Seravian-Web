import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class VerifyEmailComponent implements OnInit {
  otpForm: FormGroup;
  email: string | null = null;
  submitted: boolean = false;

  constructor(private router: Router,private authService: AuthService) {
    this.otpForm = new FormGroup({
      otp: new FormControl('', [
        Validators.required,
        // Validators.pattern(/^\d{6}$/), // Only 6-digit numbers
      ]),
    });
  }

  ngOnInit(): void {
    this.email = sessionStorage.getItem('email');
    if (!this.email) {
      // this.router.navigate(['/info']);  // Redirect if no email is found
    }
  }

  get otp() {
    return this.otpForm.get('otp');
  }

  onSubmit() {
    this.submitted = true;
    if (this.otpForm.valid) {
      const otp = this.otpForm.value.otp;
      this.email = sessionStorage.getItem('email');
      const email = this.email || '';
      console.log(email);
      console.log(otp)
        // Ensure email is a string, even if null

        this.authService.OtpVerfiy([email, otp]).subscribe({
          next: () => {
            // Only gets here if tap() ran successfully and no error occurred
            alert('OTP verification successful!');
            this.router.navigate(['/']);
          },
          error: () => {
            // You can optionally still handle unexpected errors here
            alert('OTP verification failed. Please try again.');
          }
        });
        // this.authService.Otpverify([email, otp]).subscribe({
        //   next: () => {
        //     alert('OTP verification successful!');
        //     this.router.navigate(['/doctor-or-patient']);
        //   },
        //   error: (err) => {
        //     if (err.error?.errors) {
        //       const errors = err.error.errors;
        //       const allMessages = Object.values(errors).flat(); // Flatten nested arrays
        //       alert(allMessages[0]); // Show the first error message
        //     } else {
        //       alert('An unexpected error occurred.');
        //     }
        //     console.error('Error verifying OTP:', err);
        //   }
        // });
    } else {
      console.log('Form is invalid');
      this.otpForm.markAllAsTouched();
    }
  }


  resendOTP() {
    console.log('Resend OTP clicked');
  }
}

