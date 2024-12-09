import { Component } from '@angular/core';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.css'
})
export class AboutUsComponent {
teamMembers = [
    {
      name: 'Dr. Michael Evans, MD',
      title: 'Board-Certified Psychiatrist',
      image: 'images/Mens-Mental-Health-The-Role-of-Male-Therapists-removebg-preview.png',
      socials: ['facebook-f', 'twitter', 'instagram']
    },
    {
      name: 'Dr. Amanda Collins, PhD',
      title: 'Clinical Psychologist',
      image: 'images/Male-Therapist-removebg-preview.png',
      socials: ['facebook-f', 'twitter', 'instagram']
    },
    {
      name: 'Dr. Amanda Collins, PhD',
      title: 'Clinical Psychologist',
      image: 'images/Mens-Mental-Health-The-Role-of-Male-Therapists-removebg-preview.png',
      socials: ['facebook-f', 'twitter', 'instagram']
    },
    {
      name: 'Dr. Michael Evans, MD',
      title: 'Board-Certified Psychiatrist',
      image: 'images/Male-Therapist-removebg-preview.png',
      socials: ['facebook-f', 'twitter', 'instagram']
    },
    {
      name: 'Dr. Michael Evans, MD',
      title: 'Board-Certified Psychiatrist',
      image: 'images/Mens-Mental-Health-The-Role-of-Male-Therapists-removebg-preview.png',
      socials: ['facebook-f', 'twitter', 'instagram']
    },
    {
      name: 'Dr. Amanda Collins, PhD',
      title: 'Clinical Psychologist',
      image: 'images/Male-Therapist-removebg-preview.png',
      socials: ['facebook-f', 'twitter', 'instagram']
    },
    {
      name: 'Dr. Michael Evans, MD',
      title: 'Board-Certified Psychiatrist',
      image: 'images/Mens-Mental-Health-The-Role-of-Male-Therapists-removebg-preview.png',
      socials: ['facebook-f', 'twitter', 'instagram']
    },
    {
      name: 'Dr. Amanda Collins, PhD',
      title: 'Clinical Psychologist',
      image: 'images/Male-Therapist-removebg-preview.png',
      socials: ['facebook-f', 'twitter', 'instagram']
    }
  ];
}
