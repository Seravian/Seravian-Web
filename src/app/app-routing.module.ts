import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginsignupComponent } from './component/auth/login-sign-up/login-sign-up.component';
import { InfoComponent } from './component/auth/info/info.component';
import { ForgetPasswordComponent } from './component/auth/forget-password/forget-password.component';
import { NewPasswordComponent } from './component/auth/new-password/new-password.component';
const routes: Routes = [{
  path : '',
  component:LoginsignupComponent,
  },
  {
    path: 'auth',
    loadChildren: () => import('./component/auth/auth.module')
      .then(m => m.AuthModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./component/dashboard/dashboard.module')
      .then(m => m.DashboardModule),
  },
  {
  path: 'info', component: InfoComponent
  },
  {
    path: 'forget-password', component: ForgetPasswordComponent
  },
  {
    path: 'new-password', component: NewPasswordComponent
  }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
