import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { HomeComponent } from './home/home.component';
import { FooterComponent } from './footer/footer.component';
import { HomeBodyComponent } from './home-body/home-body.component';
import { TeamMemberComponent } from './team-member/team-member.component';


@NgModule({
  declarations: [
    HomeComponent,
    FooterComponent,
    HomeBodyComponent,
    TeamMemberComponent,

  ],
  imports: [
    CommonModule,
    DashboardRoutingModule
  ]
})
export class DashboardModule { }
