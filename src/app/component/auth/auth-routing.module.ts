import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginsignupComponent } from './login-sign-up/login-sign-up.component';

const routes: Routes = [
  {
    path: '',
    component:LoginsignupComponent
  },
  {
    path:'login-sign-up',
    component:LoginsignupComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
