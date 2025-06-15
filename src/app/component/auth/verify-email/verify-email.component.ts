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
  successMessage: boolean = false;

  statusMessage: string = '';
  preventSpace(event: KeyboardEvent) {
    if (event.code === 'Space') {
      event.preventDefault();
    }
  }


  sanitizePaste(event: ClipboardEvent) {
    event.preventDefault();
    const clipboardData = event.clipboardData || (window as any).clipboardData;
    const pastedText = clipboardData.getData('text').replace(/\s/g, ''); // Remove all spaces
    this.otp?.setValue(pastedText.substring(0, 8)); // Also make sure it's not longer than 8
  }
  clearStatusMessageAfterDelay() {
    setTimeout(() => {
      this.statusMessage = '';
    }, 5000); // 5 seconds
  }

  constructor(private router: Router,private authService: AuthService) {
    this.otpForm = new FormGroup({
      otp: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
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
    this.statusMessage = '';
    this.successMessage = false;

    if (this.otpForm.valid) {
      const otp = this.otpForm.value.otp;
      this.email = sessionStorage.getItem('email');
      const email = this.email || '';

      this.authService.OtpVerfiy([email, otp]).subscribe({
        next: () => {
          this.statusMessage = 'OTP verification successful!';
          this.successMessage = true;

          // Wait 3 seconds, then navigate
          setTimeout(() => {
            this.router.navigate(['/']);
          }, 3000);
        },
        error: (err) => {
          this.successMessage = false;
          if (err.error?.errors) {
            const errors = err.error.errors;
            const allMessages = Object.values(errors).flat();
            this.statusMessage = String(allMessages[0]);
          } else {
            this.statusMessage = 'Unexpected error occurred. Please try again.';
          }
          // console.error('OTP verification failed:', err);
        }
      });
    } else {
      // console.log('Form is invalid');
      this.otpForm.markAllAsTouched();
    }
  }


  resendOTP() {
    this.submitted = false;
    this.statusMessage = '';
    this.email = sessionStorage.getItem('email');
    // console.log(this.email);
    const email = this.email || '';
    if (!email) {
      // console.error('No email found for resending OTP.');
      this.statusMessage = 'Email not found. Please try again.';
      this.clearStatusMessageAfterDelay();
      return;
    }

    this.authService.ResendOtpVerfiy([email]).subscribe({
      next: () => {
        this.statusMessage = 'Verification email has been resent!';
        this.successMessage = true;
        this.clearStatusMessageAfterDelay();
      },
      error: (err) => {
        this.successMessage = false;
        if (err.error?.errors) {
          const errors = err.error.errors;
          const allMessages = Object.values(errors).flat();
          this.statusMessage = String(allMessages[0]);
        } else {
          this.statusMessage = 'Failed to resend email. Please try again.';
        }
        // console.error('Resend OTP failed:', err);
        this.clearStatusMessageAfterDelay();
      }
    });
  }

}

