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
  email: string = 'example@domain.com'; // email example
  submitted: boolean = false;

  constructor(private router: Router,private authService: AuthService) {
    this.otpForm = new FormGroup({
      otp: new FormControl('', [
        Validators.required,
        // Validators.pattern(/^\d{6}$/), // Only 6-digit numbers
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
      this.authService.OtpVerfiy(
        [ otp
        ]

      ).subscribe(res => {
      if (res == 'Failure'){
        alert('login unsuc');
      }else{

        alert('login suc');
      };
      });
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

