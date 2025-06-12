import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  standalone:false,
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {


  getAdminName():string{
    const adminProfile:string = JSON.parse(localStorage.getItem('profile') || '{}').fullName;
    return adminProfile;
  }

}
