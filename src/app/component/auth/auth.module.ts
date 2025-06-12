import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms'; // Import this module

import { AuthRoutingModule } from './auth-routing.module';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { NewPasswordComponent } from './new-password/new-password.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { UserInfoComponent } from './user-info/user-info.component';
import { DoctorInfoComponent } from './doctor-info/doctor-info.component';
import { DoctorOrPatientComponent } from './doctor-or-patient/doctor-or-patient.component';
import { WaitingLandingComponent } from './waiting-landing/waiting-landing.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { DoctorVerificationComponent } from './doctor-verification/doctor-verification.component';
import { SendVerificationRequestComponent } from './send-verification-request/send-verification-request.component';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';





@NgModule({
  declarations: [
    ForgetPasswordComponent,
    NewPasswordComponent,
    VerifyEmailComponent,

    UserInfoComponent,
    DoctorInfoComponent,
    DoctorOrPatientComponent,
    WaitingLandingComponent,
    DoctorVerificationComponent,
    SendVerificationRequestComponent
  ],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    AuthRoutingModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatOptionModule,
    BrowserAnimationsModule,
    NgxMaterialTimepickerModule,
  ]
})
export class AuthModule { }
