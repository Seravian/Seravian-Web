import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-doctor-or-patient',
  templateUrl: './doctor-or-patient.component.html',
  styleUrls: ['./doctor-or-patient.component.css']
})
export class DoctorOrPatientComponent {
  selectionForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router,private authService: AuthService) {
    this.selectionForm = this.fb.group({
      role: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.selectionForm.valid) {
      const selectedRole = this.selectionForm.value.role;
      const rolenumber2 = selectedRole === 'Doctor' ? 1 : 2;
      const roleNumber = selectedRole === 'Patient' ? 0 : rolenumber2;



      this.authService.setTempRole(roleNumber);

      // if (roleNumber === 0) {
      this.router.navigate(['/user-info']);
      // } else {
        // this.router.navigate(['/doctor-info']);
      // }
    }
  }

}
