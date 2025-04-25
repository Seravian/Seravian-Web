import { AfterViewInit, Component, OnInit, Renderer2, ViewChild, ElementRef, OnDestroy} from '@angular/core';
import intlTelInput from 'intl-tel-input';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ProfileRequest } from '../../../interfaces/profile-request';


@Component({
  selector: 'app-patient-info',
  templateUrl: './patient-info.component.html',
  styleUrl: './patient-info.component.css'
})
export class PatientInfoComponent implements OnInit, AfterViewInit, OnDestroy{
  @ViewChild('phoneInput', { static: false }) phoneInput!: ElementRef; // Reference to the phone input element
  patientForm: FormGroup;
  intlTelInstance: any;

  constructor(private fb: FormBuilder, private router: Router, private renderer: Renderer2,private authService: AuthService) {
    this.patientForm = this.fb.group({
      fullName: ['', Validators.required],
      // phoneNumber: ['', Validators.required],
      dob: ['', Validators.required],
      gender: ['', Validators.required],
    });
  }

  ngOnInit(): void {}


  ngAfterViewInit(): void {
    if (this.phoneInput) {
      console.log('Phone input element:', this.phoneInput.nativeElement);

      this.intlTelInstance = intlTelInput(this.phoneInput.nativeElement, {
        initialCountry: 'eg',
        separateDialCode: true,
        utilsScript: 'https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js',
        allowDropdown: true,
      }as any);

      console.log('IntlTelInstance:', this.intlTelInstance);

      this.intlTelInstance.promise
        .then(() => {
          console.log('Utils script loaded successfully.');

          // this.phoneInput.nativeElement.addEventListener('blur', this.validatePhoneNumber.bind(this));
        })
        .catch((error : unknown) => {
          console.error('Utils script load error:', error);
        });






      // Attach validation for the phone number
      // this.phoneInput.nativeElement.addEventListener('blur', () => {
      //   const intlTelInstance = this.phoneInput.nativeElement.intlTelInput;
      //   const isValid = intlTelInstance?.('isValidNumber');
      //   if (!isValid) {
      //     this.patientForm.controls['phoneNumber'].setErrors({ invalid: true });
      //   } else {
      //     const phoneNumber = intlTelInstance?.('getNumber');
      //     this.patientForm.controls['phoneNumber'].setValue(phoneNumber);
      //   }
      // });

      // .................................................................................................

      // this.phoneInput.nativeElement.addEventListener('blur', () => {
      //   const intlTelInstance = this.phoneInput.nativeElement.intlTelInput;
      //   console.log('IntlTelInstance:', intlTelInstance);

      //   if (intlTelInstance) {
      //     const isValid = intlTelInstance.isValidNumber();
      //     console.log('IsValid:', isValid);

      //     if (!isValid) {
      //       this.patientForm.controls['phoneNumber'].setErrors({ invalid: true });
      //     } else {
      //       const phoneNumber = intlTelInstance.getNumber();
      //       console.log('PhoneNumber:', phoneNumber);
      //       this.patientForm.controls['phoneNumber'].setValue(phoneNumber);
      //     }
      //   }
      // });



    }
  }


  // validatePhoneNumber(): void {
  //   if (this.intlTelInstance) {
  //     const isValid = this.intlTelInstance.isValidNumber();
  //     console.log('Validation result:', isValid);

  //     if (isValid === false) {
  //       console.log('Phone number is invalid.');
  //     } else if (isValid === true) {
  //       const phoneNumber = this.intlTelInstance.getNumber();
  //       console.log('Valid phone number:', phoneNumber);
  //     } else {
  //       console.error('Unexpected null validation result.');
  //       const phoneNumber = this.intlTelInstance.getNumber();
  //       console.log('Valid phone number:', phoneNumber);
  //     }
  //   } else {
  //     console.error('IntlTelInstance is not defined.');
  //   }
  // }



  onSubmit() {
    if (this.patientForm.valid) {
      const role = this.authService.getTempRole();
      if (role === null) {
        alert('Role not set. Please go back and select your role.');
        return;
      }

      const formValues = this.patientForm.value;
      const formattedDOB = `${formValues.dob} 00:00:00`;

      const profileData: ProfileRequest = {
        fullName: formValues.fullName,
        dateOfBirth: `${formValues.dob} 00:00:00`,
        gender: Number(formValues.gender),
        role: role
      };
      console.log(profileData)

      this.authService.completeProfile(profileData).subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          alert('Failed to complete profile. Try again.');
          console.error(err);
        }
      });
    } else {
      this.markAllAsTouched(this.patientForm);
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
    if (this.phoneInput) {
      // this.phoneInput.nativeElement.removeEventListener('blur', this.validatePhoneNumber.bind(this));
    }
  }

}
