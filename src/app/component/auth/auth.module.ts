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


@NgModule({
  declarations: [
    ForgetPasswordComponent,
    NewPasswordComponent,
    VerifyEmailComponent,
    PatientInfoComponent,
    DoctorInfoComponent,
    DoctorOrPatientComponent
  ],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    AuthRoutingModule
  ]
})
export class AuthModule { }
