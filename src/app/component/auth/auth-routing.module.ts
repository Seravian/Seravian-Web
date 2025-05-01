import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginsignupComponent } from './login-sign-up/login-sign-up.component';
import { AuthGuard } from '../../guard/auth_guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component:LoginsignupComponent,
    canActivate: [AuthGuard],
  },
  {
    path:'login-sign-up',
    component:LoginsignupComponent,
    canActivate: [AuthGuard],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
