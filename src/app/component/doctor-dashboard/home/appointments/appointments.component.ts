import { Component,OnInit } from '@angular/core';

interface Appointment {
  id: number;
  patient: string;
  payment: string;
  age: number;
  dateTime: string;
  fees: string;
  status: 'Completed' | 'Cancelled' | 'Pending';
  avatar: string;
}

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrl: './appointments.component.css'
})
export class AppointmentsComponent implements OnInit {

  appointments: Appointment[] = [
    {
      id: 0,
      patient: 'Avinash Kr',
      payment: 'CASH',
      age: 31,
      dateTime: '5 Oct 2024, 12:00 PM',
      fees: '$50',
      status: 'Pending',
      avatar: 'images/happy_1.jpg'
    },
    {
      id: 1,
      patient: 'GreatStack',
      payment: 'ONLINE',
      age: 24,
      dateTime: '26 Sep 2024, 11:00 AM',
      fees: '$40',
      status: 'Cancelled',
      avatar: 'images/happy_2.jpg'
    },
    {
      id: 2,
      patient: 'GreatStack',
      payment: 'CASH',
      age: 24,
      dateTime: '25 Sep 2024, 02:00 PM',
      fees: '$40',
      status: 'Completed',
      avatar: 'images/happy_3.jpg'
    },
    {
      id: 3,
      patient: 'GreatStack',
      payment: 'CASH',
      age: 24,
      dateTime: '23 Sep 2024, 11:00 AM',
      fees: '$40',
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
