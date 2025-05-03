import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { DoctorDashboardRoutingModule } from './doctor-dashboard-routing.module';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { MainContentComponent } from './home/main-content/main-content.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { AppointmentsComponent } from './home/appointments/appointments.component';
import { ProfileComponent } from './home/profile/profile.component';


@NgModule({
  declarations: [
    FooterComponent,
    HomeComponent,
    HeaderComponent,
    MainContentComponent,
    SidebarComponent,
    AppointmentsComponent,
    ProfileComponent
  ],
  imports: [
    CommonModule,
    DoctorDashboardRoutingModule,
    // BrowserModule,
    FormsModule
  ]
})
export class DoctorDashboardModule { }
