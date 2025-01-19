import { AfterViewInit, Component, OnInit, Renderer2, ViewChild, ElementRef } from '@angular/core';
import intlTelInput from 'intl-tel-input';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-doctor-info',
  templateUrl: './doctor-info.component.html',
  styleUrl: './doctor-info.component.css'
})
export class DoctorInfoComponent implements OnInit, AfterViewInit {
  @ViewChild('phoneInput', { static: false }) phoneInput!: ElementRef; // Reference to the phone input element
  doctorForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private renderer: Renderer2) {
    this.doctorForm = this.fb.group({
      fullName: ['', Validators.required],
      phoneNumber: ['', [Validators.pattern(/^[0-9 ()+-]*$/)]],
      // phoneNumber: ['', Validators.required],
      dob: ['', Validators.required],
      gender: ['', Validators.required],
      speciallity:['', Validators.required],
    });
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    if (this.phoneInput) {
      intlTelInput(this.phoneInput.nativeElement, {
        initialCountry: 'us',
        separateDialCode: true,
        utilsScript: 'https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js',
      } as any);

      // Attach validation for the phone number
      this.phoneInput.nativeElement.addEventListener('blur', () => {
        const intlTelInstance = this.phoneInput.nativeElement.intlTelInput;
        const isValid = intlTelInstance?.('isValidNumber');
        if (!isValid) {
          this.doctorForm.controls['phoneNumber'].setErrors({ invalid: true });
        } else {
          const phoneNumber = intlTelInstance?.('getNumber');
          this.doctorForm.controls['phoneNumber'].setValue(phoneNumber);
        }
      });
    }
  }

  onSubmit() {
    if (this.doctorForm.valid) {

      // const formData = this.patientForm.value;
      // console.log('Patient Information Submitted:', formData);

      this.router.navigate(['/dashboard']);
    } else {
      this.markAllAsTouched(this.doctorForm);
      return;
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

}
