import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../admin-dashboard/home/home.component';
import { AppointmentsComponent } from '../admin-dashboard/home/appointments/appointments.component';
import { ProfileComponent } from '../admin-dashboard/home/profile/profile.component';

const routes: Routes = [
  {
    path: "",component: HomeComponent
  },
  {
    path:'main-content', component: HomeComponent
  },
  {
    path: 'doctor-requests', component: AppointmentsComponent
  },
  {
    path: 'profile', component: ProfileComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminDashboardRoutingModule { }
