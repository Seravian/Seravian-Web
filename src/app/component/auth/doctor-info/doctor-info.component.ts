import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-doctor-info',
  templateUrl: './doctor-info.component.html',
  styleUrl: './doctor-info.component.css'
})
export class DoctorInfoComponent implements OnInit {

  doctorForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {
    this.doctorForm = this.fb.group({
      fullName: ['', Validators.required],
      // phoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9 ()+-]*$/)]],
      phoneNumber: ['', [Validators.pattern(/^[0-9 ()+-]*$/)]],
      dob: ['', Validators.required],
      gender: ['', Validators.required],
      speciallity:['', Validators.required],
    });
  }

  ngOnInit(): void {}

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
