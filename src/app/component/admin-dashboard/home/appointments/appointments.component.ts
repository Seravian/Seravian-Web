import { Component,OnInit } from '@angular/core';

interface TherapistRequest {
  id: number;
  name: string;
  qualification: string;
  experience: number;
  age: number;
  avatar: string;
  licenseImage: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

@Component({
  selector: 'app-appointments',
  standalone:false,
  templateUrl: './appointments.component.html',
  styleUrl: './appointments.component.css'
})
export class AppointmentsComponent implements OnInit {

  requests: TherapistRequest[] = [
    {
      id: 0,
      name: 'Dr. Sarah Ahmed',
      qualification: 'Master of Psychotherapy',
      experience: 5,
      age: 35,
      avatar: 'images/Male-Therapist.jpg',
      licenseImage: 'images/Male-Therapist.jpg',
      status: 'Pending'
    },
    {
      id: 1,
      name: 'Dr. Mohammed Abdullah',
      qualification: 'PhD in Psychology',
      experience: 10,
      age: 42,
      avatar: 'images/Male-Therapist.jpg',
      licenseImage: 'images/Male-Therapist.jpg',
      status: 'Approved'
    }
  ];
  approveRequest(request: TherapistRequest): void {
  request.status = 'Approved';
}
selectedLicenseImage: string = '';  // To hold the selected image URL for the modal
isModalOpen: boolean = false;  // Flag to show/hide the modal

openLicenseImage(image: string): void {
  this.selectedLicenseImage = image;  // Set the clicked license image to be displayed in the modal
  this.isModalOpen = true;  // Open the modal
}

closeModal(): void {
  this.isModalOpen = false;  // Close the modal when clicked outside
}

rejectRequest(request: TherapistRequest): void {
  request.status = 'Rejected';
}

  constructor() { }

  ngOnInit(): void {
    // Add any initialization logic here
  }

  onLogout(): void {
    // Implement logout logic
    console.log('Logout clicked');
  }

}
