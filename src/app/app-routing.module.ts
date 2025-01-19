import { SeravianBotComponent } from './component/seravian-bot/seravian-bot.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginsignupComponent } from './component/auth/login-sign-up/login-sign-up.component';
import { ForgetPasswordComponent } from './component/auth/forget-password/forget-password.component';
import { NewPasswordComponent } from './component/auth/new-password/new-password.component';
import { VerifyEmailComponent } from './component/auth/verify-email/verify-email.component';
import { PatientInfoComponent } from './component/auth/patient-info/patient-info.component';
import { DoctorInfoComponent } from './component/auth/doctor-info/doctor-info.component';
import { DoctorOrPatientComponent } from './component/auth/doctor-or-patient/doctor-or-patient.component';


const routes: Routes = [{
  path : '',
  component:LoginsignupComponent,
  },
  {
    path: 'auth',
    loadChildren: () => import('./component/auth/auth.module')
      .then(m => m.AuthModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./component/dashboard/dashboard.module')
      .then(m => m.DashboardModule),
  },
  {
    path: 'seravianbot', component: SeravianBotComponent
  },
  {
    path: 'forget-password', component: ForgetPasswordComponent
  },
  {
    path: 'new-password', component: NewPasswordComponent
  },
  {
    path: 'verify-email', component: VerifyEmailComponent
  },
  {
    path: 'patient-info', component: PatientInfoComponent
  },
  {
    path: 'doctor-info', component: DoctorInfoComponent
  },
  {
    path: 'doctor-or-patient', component: DoctorOrPatientComponent
  }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
