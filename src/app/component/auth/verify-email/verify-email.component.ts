import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class VerifyEmailComponent implements OnInit {
  otpForm: FormGroup;
  email: string = 'example@domain.com'; // email example
  submitted: boolean = false;

  constructor(private router: Router) {
    this.otpForm = new FormGroup({
      otp: new FormControl('', [
        Validators.required,
        Validators.pattern(/^\d{6}$/), // Only 6-digit numbers
      ]),
    });
  }

  ngOnInit(): void {}

  get otp() {
    return this.otpForm.get('otp');
  }

  onSubmit() {
    this.submitted = true;
    if (this.otpForm.valid) {
      const otp = this.otpForm.value.otp;
      console.log('OTP submitted: ', otp);
      this.router.navigate(['/doctor-or-patient']);
    } else {
      console.log('Form is invalid');
      this.otpForm.markAllAsTouched();
    }
  }

  resendOTP() {
    console.log('Resend OTP clicked');
  }
}

