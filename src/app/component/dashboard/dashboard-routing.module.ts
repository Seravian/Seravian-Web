import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';

const routes: Routes = [{
  path:'',
  component: HomeComponent,
  children: [
    {
      path: 'user-profile',
      loadChildren: () => import('./home/user-profile/user-profile.module')
        .then(m => m.UserProfileModule),
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
