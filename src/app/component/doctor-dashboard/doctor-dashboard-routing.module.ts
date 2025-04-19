import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AppointmentsComponent } from './home/appointments/appointments.component';
import { ProfileComponent } from './home/profile/profile.component';

const routes: Routes = [{
    path:'main-content', component: HomeComponent
  },
  {
    path: 'appointments', component: AppointmentsComponent
  },
  {
    path: 'profile', component: ProfileComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DoctorDashboardRoutingModule { }
