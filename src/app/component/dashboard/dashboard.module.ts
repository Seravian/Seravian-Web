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
import { HomeLandingSectionComponent } from './home/main-content/home-landing-section/home-landing-section.component';
import { ExperienceDifferenceSectionComponent } from './home/main-content/experience-difference-section/experience-difference-section.component';
import { MobileAppSectionComponent } from './home/main-content/mobile-app-section/mobile-app-section.component';
import { FindYourPathSectionComponent } from './home/main-content/find-your-path-section/find-your-path-section.component';
import { OurOfferSectionComponent } from './home/main-content/our-offer-section/our-offer-section.component';
import { StartNowSectionComponent } from './home/main-content/start-now-section/start-now-section.component';


@NgModule({
  declarations: [
    HomeComponent,
    FooterComponent,
    HeaderComponent,
    TestimonialSectionComponent,
    AboutUsComponent,
    TeamMemberComponent,
    MainContentComponent,
    HomeLandingSectionComponent,
    ExperienceDifferenceSectionComponent,
    MobileAppSectionComponent,
    FindYourPathSectionComponent,
    OurOfferSectionComponent,
    StartNowSectionComponent,
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule
  ]
})
export class DashboardModule { }
