import { Component ,OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../../../services/auth.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.css'
})
export class EditProfileComponent implements OnInit {
  activeSection: string = 'profile';
  // profileForm: FormGroup;
  // passwordForm: FormGroup;
  profileData = JSON.parse(localStorage.getItem('profile') || '{}');
  userProfile = {
    name: this.profileData.fullName,
    email: this.profileData.email,
    DOB: this.profileData.dateOfBirth,
    gender : this.profileData.gender,
    profilePhoto: 'images/user.png'
  };

  constructor(private fb: FormBuilder) {
    // this.profileForm = this.fb.group({
    //   name: ['', Validators.required],
    //   email: ['', [Validators.required, Validators.email]],
    //   phone: ['', Validators.required],
    // });

    // this.passwordForm = this.fb.group({
    //   currentPassword: ['', Validators.required],
    //   newPassword: ['', [Validators.required, Validators.minLength(8)]],
    //   confirmPassword: ['', Validators.required]
    // }, { validator: this.passwordMatchValidator });
  }

  ngOnInit() {
    // this.profileForm.patchValue(this.userProfile);
  }

  // passwordMatchValidator(g: FormGroup) {
  //   return g.get('newPassword')?.value === g.get('confirmPassword')?.value
  //     ? null : { 'mismatch': true };
  // }

  onSectionChange(section: string) {
    this.activeSection = section;
  }

  getGender():string{
    const gender = this.userProfile.gender;
    if (gender===0) {
      return 'male';
    } else {
      return 'female';
    }
  }

  getDOB(): string {
    const dob = this.userProfile.DOB;
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(dob));
  }

  // onProfileSubmit() {
  //   if (this.profileForm.valid) {
  //     // console.log('Profile updated:', this.profileForm.value);
  //     // Implement your API call here
  //   }
  // }

  // onPasswordSubmit() {
  //   if (this.passwordForm.valid) {
  //     // console.log('Password updated:', this.passwordForm.value);
  //     // Implement your API call here
  //   }
  // }

  // onFileSelected(event: any) {
  //   const file = event.target.files[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onload = (e: any) => {
  //       this.userProfile.profilePhoto = e.target.result;
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // }
}
