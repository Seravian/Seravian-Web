import { Component,OnInit } from '@angular/core';

interface Booking {
  id: number;
  name: string;
  date: Date;
  status: 'Completed' | 'Cancelled' | 'Pending';
  avatar: string;
}

@Component({
  selector: 'app-main-content',
  standalone:false,
  templateUrl: './main-content.component.html',
  styleUrl: './main-content.component.css'
})
export class MainContentComponent implements OnInit {

  // Stats
  earnings: number = 80;
  appointments: number = 4;
  patients: number = 2;

  // Latest Bookings
  latestBookings: Booking[] = [
    {
      id: 1,
      name: 'Avinash Kr',
      date: new Date('2024-10-05'),
      status: 'Pending',
      avatar: 'images/happy_1.jpg'
    },
    {
      id: 2,
      name: 'GreatStack',
      date: new Date('2024-09-26'),
      status: 'Cancelled',
      avatar: 'images/happy_2.jpg'
    },
    {
      id: 3,
      name: 'GreatStack',
      date: new Date('2024-09-25'),
      status: 'Completed',
      avatar: 'images/happy_3.jpg'
    },
    {
      id: 4,
      name: 'GreatStack',
      date: new Date('2024-09-23'),
      status: 'Completed',
      avatar: 'images/happy_1.jpg'
    }
  ];

  constructor() { }

  ngOnInit(): void {
    // Add any initialization logic here
  }

  onLogout(): void {
    // Implement logout logic
    console.log('Logout clicked');
  }

}
