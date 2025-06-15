import { Component } from '@angular/core';

interface Admin {
  name: string;
  email: string;
  username: string;
  contact: string;
  address: string;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  standalone:false,
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  admin: Admin = {
    name: 'Admin User',
    email: 'admin@example.com',
    username: 'admin123',
    contact: '123-456-7890',
    address: 'Admin Street, City, Country',
  };


  onSubmit() {
    // console.log('Admin profile saved:', this.admin);
    alert('Admin profile updated successfully!');
  }
}
