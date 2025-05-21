import { ChatSidebarComponent } from './component/chat_layout/chat-sidebar/chat-sidebar.component';
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
import { AuthGuard } from './guard/auth_guards/auth.guard';
import { VerifyEmailGuard } from './guard/auth_guards/verify-email.guard';
import { ChatComponent } from './component/chat_layout/chat/chat.component';

const routes: Routes = [{
  path : '',
  component:LoginsignupComponent,
  },
  {
  path : 'chatbot',
  component:ChatComponent, canActivate: [AuthGuard]
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
    canActivate: [AuthGuard]
  },
  {
    path: 'doctor-dashboard',
    loadChildren: () => import('./component/doctor-dashboard/doctor-dashboard.module')
      .then(m => m.DoctorDashboardModule),
  },
  {
    path: 'admin-dashboard',
    loadChildren: () => import('./component/admin-dashboard/admin-dashboard.module')
      .then(m => m.AdminDashboardModule),
  },
  {
    path: 'user-profile',
    loadChildren: () => import('./component/dashboard/home/user-profile/user-profile.module')
      .then(m => m.UserProfileModule), canActivate: [AuthGuard]
  },
  {
    path: 'forget-password', component: ForgetPasswordComponent
  },
  {
    path: 'new-password', component: NewPasswordComponent
  },
  {
    path: 'verify-email', component: VerifyEmailComponent,
  },
  {
    path: 'patient-info', component: PatientInfoComponent , canActivate: [VerifyEmailGuard]
  },
  {
    path: 'doctor-info', component: DoctorInfoComponent ,
  },
  {
    path: 'doctor-or-patient', component: DoctorOrPatientComponent , canActivate: [VerifyEmailGuard]
  }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
