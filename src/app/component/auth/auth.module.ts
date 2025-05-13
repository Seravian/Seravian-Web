import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms'; // Import this module

import { AuthRoutingModule } from './auth-routing.module';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { NewPasswordComponent } from './new-password/new-password.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { PatientInfoComponent } from './patient-info/patient-info.component';
import { DoctorInfoComponent } from './doctor-info/doctor-info.component';
import { DoctorOrPatientComponent } from './doctor-or-patient/doctor-or-patient.component';
import { WaitingLandingComponent } from './waiting-landing/waiting-landing.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';


@NgModule({
  declarations: [
    ForgetPasswordComponent,
    NewPasswordComponent,
    VerifyEmailComponent,
    PatientInfoComponent,
    DoctorInfoComponent,
    DoctorOrPatientComponent,
    WaitingLandingComponent
  ],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    AuthRoutingModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    NgxMaterialTimepickerModule,
  ]
})
export class AuthModule { }
