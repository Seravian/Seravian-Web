import { Component, OnInit,} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'send-verification-request-info',
  templateUrl: './send-verification-request.component.html',
  styleUrl: './send-verification-request.component.css'
})
export class SendVerificationRequestComponent implements OnInit {
  doctorRequestForm: FormGroup;
  count : number = 3;
  fileAttachmentInputFields : number[] = [];
  attachmentFields: File[] = [];
  attachmentError: string = '';

  doctorTitles = [
    { value: 0, label: 'Psychiatrist' },
    { value: 1, label: 'Psychologist' },
    { value: 2, label: 'Therapist' }
  ];

  constructor(private fb: FormBuilder, private router: Router, private authservice: AuthService) {
    this.doctorRequestForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      sessionPrice: ['', [Validators.required, Validators.max(10000)]],
    });
  }

  ngOnInit(): void {
    // Initialize with 2 attachment slots
    this.fileAttachmentInputFields = [1, 2];

  }

  addAttachment(): void {
    if (this.attachmentFields.length < 10) {
      this.fileAttachmentInputFields.push(this.count++);
    }
  }

  onAttachmentChange(event: Event, index: number): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files[0]) {
      const file = fileInput.files[0];
      this.attachmentFields[index] = file;

      if(this.validateAttachmentSize()){
        this.attachmentError = 'Total attachment size cannot exceed 15MB.';
      }else{
        this.attachmentError = '';
      }
    }
  }

  validateAttachmentSize(): boolean {
    const totalSize = this.attachmentFields
      .filter(f => f)
      .reduce((acc, file) => acc + file.size, 0);

    if (totalSize > 15 * 1024 * 1024) {
      return true;
    } else {
      return false;
    }
  }

  markAllAsTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => control.markAsTouched());
  }

  onSubmit() {

    if(this.validateAttachmentSize()){
      this.attachmentError = 'Total attachment size cannot exceed 15MB.';
      return;
    }else{
      this.attachmentError = '';
    }

    // Filter out null values from attachments
    const validAttachments = this.attachmentFields.filter((file): file is File => file !== null);

    if (this.doctorRequestForm.invalid) {
      this.markAllAsTouched(this.doctorRequestForm);
      return;
    }

    if (validAttachments.length === 0) {
      this.attachmentError = 'At least one attachment is required.';
      return;
    }

    const formDataRaw = this.doctorRequestForm.value;

    const formData = new FormData();
    formData.append('title', formDataRaw.title);
    formData.append('description', formDataRaw.description);
    formData.append('sessionPrice', formDataRaw.sessionPrice);

    validAttachments.forEach((file, index) => {
      formData.append(`attachments`, file); // backend should expect IFormFile[] named "attachments"
    });

    this.authservice.sendDoctorVerificationRequest(formData).subscribe({
      next: (res) => {
        console.log('Doctor verification request sent successfully', res);
        alert('Doctor verification request sent successfully');
        this.router.navigate(['/doctor-verification'])
      },
      error: (error) => {
        console.error('Error sending doctor verification request:', error);
      }
    });

  }



}
