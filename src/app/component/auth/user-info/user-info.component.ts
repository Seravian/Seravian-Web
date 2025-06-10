import { Component, OnInit, ViewChild, ElementRef, OnDestroy} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ProfileRequest } from '../../../interfaces/profile-request';
import { el } from 'intl-tel-input/i18n';


@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrl: './user-info.component.css'
})

export class UserInfoComponent implements OnInit, OnDestroy{
  @ViewChild('phoneInput', { static: false }) phoneInput!: ElementRef; // Reference to the phone input element
  userForm: FormGroup;
  dateNotInFuture(control: any): { [key: string]: boolean } | null {
    const inputDate = new Date(control.value);
    const today = new Date();

    // Remove time for accurate comparison
    inputDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    if (control.value && inputDate > today) {
      return { futureDate: true };
    }
    return null;
  }

  constructor(private fb: FormBuilder, private router: Router,private authService: AuthService) {
    this.userForm = this.fb.group({
      fullName: ['', Validators.required],
      dob: ['', [Validators.required ,this.dateNotInFuture.bind(this)]],
      gender: ['', Validators.required],
    });
  }

  ngOnInit(): void {}


  onSubmit() {
    if (this.userForm.valid) {
      const role = this.authService.getTempRole();
      if (role === null) {
        alert('Role not set. Please go back and select your role.');
        this.router.navigate(['/doctor-or-patient']);
        return;
      }

      const userFormValues = this.userForm.value;

      // const email = this.authService.getTempEmail() ?? '';
      // const password = this.authService.getTempPass() ?? '';


      const profileData: ProfileRequest = {
        fullName: userFormValues.fullName,
        dateOfBirth: userFormValues.dob,
        gender: Number(userFormValues.gender),
        role: role
      };
      console.log(profileData)

      this.authService.completeProfile(profileData).subscribe({
        next: (response) => {
          // console.log(email,password);

          console.log("response after profile completion",response);

          // console.log('Login successful:', response);

          const profileTokens = {
            accessToken: this.authService.EncryptToken(response.tokens.accessToken!),
            refreshToken: this.authService.EncryptToken(response.tokens.refreshToken!),
            accessTokenExpirationUtc: response.tokens.accessTokenExpirationUtc
          }

          console.log("encrypted tokens after completing profile",profileTokens)

          localStorage.setItem('profileTokens', JSON.stringify(profileTokens));

          if (role === 0) {

            const patientProfile = {
              id: response.userId,
              fullName: response.fullName,
              email: response.email,
              dateOfBirth: response.dateOfBirth,
              gender: response.gender,
              role: response.role,
              isEmailVerified: response.isEmailVerified,
              isProfileSetupComplete: response.isProfileSetupComplete
            };
            console.log("patient profile data",patientProfile)

            localStorage.setItem('profile', JSON.stringify(patientProfile));

            if(!response.isEmailVerified){
              this.router.navigate(['verify-email']);

            }else if (!response.isProfileSetupComplete) {
              this.router.navigate(['doctor-or-patient']);

            }else {
              this.router.navigate(['dashboard']);
            }

          }else if (role === 1) {

            const doctorProfile = {
              id: response.userId,
              fullName: response.fullName,
              email: response.email,
              dateOfBirth: response.dateOfBirth,
              gender: response.gender,
              role: response.role,
              isDoctorVerified: response.isDoctorVerified,
              isEmailVerified: response.isEmailVerified,
              isProfileSetupComplete: response.isProfileSetupComplete
            };
            console.log("doctor profile data",doctorProfile)

            localStorage.setItem('profile', JSON.stringify(doctorProfile));

            if(!response.isEmailVerified){
              console.log("isEmailVerified :",response.isEmailVerified)
              this.router.navigate(['verify-email']);

            }else if (!response.isProfileSetupComplete) {
              console.log("isProfileSetupComplete :",response.isProfileSetupComplete)
              this.router.navigate(['doctor-or-patient']);

            }else if (!response.isDoctorVerified) {
              console.log("isDoctorVerified :",response.isDoctorVerified)
              this.router.navigate(['doctor-verification']);

            }else {
              this.router.navigate(['doctor-dashboard']);
            }

          }

        },
        error: (err) => {
          alert('Failed to complete profile. Try again.');
          console.error(err);
        }
      });


      // this.authService.login({email, password}).subscribe({
      //   next: (response) => {

      // },
      //   error: (err) => {
      //     alert('Login failed after profile completion. Try logging in manually.');
      //     console.error(err);
      //   }
      // });

    } else {
      this.markAllAsTouched(this.userForm);
    }
  }

  goBack() {
    this.router.navigate(['/doctor-or-patient']);
  }

  private markAllAsTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      if (control) {
        control.markAsTouched();
      }
    });
  }


  ngOnDestroy(): void {

  }

}
