import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { DashboardModule } from '../../dashboard.module';
import { UserProfileRoutingModule } from './user-profile-routing.module';
import { EditProfileComponent } from './edit-profile/edit-profile.component';


@NgModule({
  declarations: [
    EditProfileComponent
  ],
  imports: [
    CommonModule,
    UserProfileRoutingModule,
    FormsModule,
    DashboardModule,
    ReactiveFormsModule
  ]
})
export class UserProfileModule { }
