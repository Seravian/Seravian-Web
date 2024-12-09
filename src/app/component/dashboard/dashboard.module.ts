import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { HomeComponent } from './home/home.component';
import { FooterComponent } from './footer/footer.component';
import { TestimonialSectionComponent } from './home/main-content/testimonial-section/testimonial-section.component';
import { AboutUsComponent } from './home/main-content/about-section/about-us/about-us.component';
import { TeamMemberComponent } from './home/main-content/about-section/team-member/team-member.component';
import { MainContentComponent } from './home/main-content/main-content.component';
import { HeaderComponent } from './header/header.component';


@NgModule({
  declarations: [
    HomeComponent,
    FooterComponent,
    HeaderComponent,
    TestimonialSectionComponent,
    AboutUsComponent,
    TeamMemberComponent,
    MainContentComponent,
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule
  ]
})
export class DashboardModule { }
