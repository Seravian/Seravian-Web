import { Component } from '@angular/core';

interface Doctor {
  name: string;
  degree: string;
  experience: number;
  about: string;
  fee: number;
  address: string;
  available: boolean;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  doctor : Doctor = {
    name: 'Dr. Ahmed Hassan',
    degree: 'MBBS - General physician',
    experience: 4,
    about: 'Dr. Richard has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
    fee: 50,
    address: '24 Main Street\n10 Clause Road',
    available: true,
  };

  onSubmit() {
    // console.log('Doctor profile saved:', this.doctor);
    alert('Profile updated successfully!');
  }
}
