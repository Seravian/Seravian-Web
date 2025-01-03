import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-doctor-or-patient',
  templateUrl: './doctor-or-patient.component.html',
  styleUrls: ['./doctor-or-patient.component.css']
})
export class DoctorOrPatientComponent {
  selectionForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {
    this.selectionForm = this.fb.group({
      role: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.selectionForm.valid) {

      const selectedRole = this.selectionForm.value.role;
      // console.log('Selected Role:', selectedRole);

      if (selectedRole === 'Patient') {
        this.router.navigate(['/patient-info']);

      } else {
        this.router.navigate(['/doctor-info']);
      }

    }
  }
}
