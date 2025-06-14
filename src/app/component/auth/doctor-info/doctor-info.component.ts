import { Component, OnInit,} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';

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
      dob: ['', Validators.required],
      gender: ['', Validators.required],
      speciallity:['', Validators.required],
      license: [null, Validators.required],
      availableFrom: ['', ],  // Add the control here
      availableTo: ['', ]
    });
  }

  ngOnInit(): void {}

  onLicenseChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.doctorForm.controls['license'].setValue(file);
    }
  }

  onSubmit() {
    if (this.doctorForm.valid) {

      // const formData = this.patientForm.value;
      // console.log('Patient Information Submitted:', formData);

      this.router.navigate(['/doctor-dashboard/main-content']);
    } else {
      this.markAllAsTouched(this.doctorForm);
      return;
    }
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
