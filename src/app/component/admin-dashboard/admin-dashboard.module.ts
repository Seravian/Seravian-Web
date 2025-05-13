import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminDashboardRoutingModule } from './admin-dashboard-routing.module';
import { AdminFooterComponent } from './footer/admin_footer.component';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { MainContentComponent } from '../admin-dashboard/home/main-content/main-content.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { AppointmentsComponent } from '../admin-dashboard/home/appointments/appointments.component';
import { ProfileComponent } from './home/profile/profile.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AdminFooterComponent,
    HomeComponent,
    HeaderComponent,
    MainContentComponent,
    SidebarComponent,
    AppointmentsComponent,
    ProfileComponent
  ],
  imports: [
    CommonModule,
    AdminDashboardRoutingModule,
    FormsModule
  ]
})
export class AdminDashboardModule { }
