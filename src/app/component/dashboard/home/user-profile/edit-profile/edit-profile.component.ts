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
  profileForm: FormGroup;
  passwordForm: FormGroup;
  userProfile = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1234567890',
    profilePhoto: 'images/happy_3.jpg'
  };

  constructor(private fb: FormBuilder) {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  ngOnInit() {
    this.profileForm.patchValue(this.userProfile);
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('newPassword')?.value === g.get('confirmPassword')?.value
      ? null : { 'mismatch': true };
  }

  onSectionChange(section: string) {
    this.activeSection = section;
  }

  onProfileSubmit() {
    if (this.profileForm.valid) {
      console.log('Profile updated:', this.profileForm.value);
      // Implement your API call here
    }
  }

  onPasswordSubmit() {
    if (this.passwordForm.valid) {
      console.log('Password updated:', this.passwordForm.value);
      // Implement your API call here
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.userProfile.profilePhoto = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }
}
