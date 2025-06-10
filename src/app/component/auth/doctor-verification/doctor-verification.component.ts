import { Component, OnInit,} from '@angular/core';
import { Router } from '@angular/router';
import { DoctorVerificationRequestResponseDto } from '../../../interfaces/doctor-verification-request-response-dto';
import { AuthService } from '../../../services/auth.service';
import { DoctorRequestStatus } from '../../../interfaces/doctor-request-status.enum';
import { th } from 'intl-tel-input/i18n';

@Component({
  selector: 'app-doctor-verification',
  templateUrl: './doctor-verification.component.html',
  styleUrl: './doctor-verification.component.css'
})

export class DoctorVerificationComponent implements OnInit {

  requests: DoctorVerificationRequestResponseDto[] = [];

  constructor(private router: Router,private authservice: AuthService) {}

  // ngOnInit(): void {
  //   this.authservice.getDoctorVerificationRequests().subscribe({
  //     next: (data:DoctorVerificationRequestResponseDto[]) => {
  //       console.log('Doctor verification requests:', data);
  //       console.log('time in local:',new Date(data[0].requestedAtUtc+'Z'))
  //       this.requests = data;
  //     }
  //     , error: (err) => {
  //       console.error('Error fetching doctor verification requests:', err);
  //     }
  //   });
  // }

  ngOnInit(): void {
  this.authservice.getDoctorVerificationRequests().subscribe({
    next: (data: DoctorVerificationRequestResponseDto[]) => {
      this.requests = data.map(item => ({
        ...item,
        requestedAtUtc: new Date(item.requestedAtUtc.endsWith('Z') || item.requestedAtUtc.includes('+')
        ? item.requestedAtUtc
        : item.requestedAtUtc + 'Z').toLocaleString(),
        deletedAtUtc: item.deletedAtUtc ? new Date(item.deletedAtUtc.endsWith('Z') || item.deletedAtUtc.includes('+')
        ? item.deletedAtUtc
        : item.deletedAtUtc + 'Z').toLocaleString() : undefined,
        reviewedAtUtc: item.reviewedAtUtc ? new Date(item.reviewedAtUtc.endsWith('Z') || item.reviewedAtUtc.includes('+')
        ? item.reviewedAtUtc
        : item.reviewedAtUtc + 'Z').toLocaleString() : undefined,
        rejectionNotes: item.rejectionNotes
      }));
    },
    error: (err) => {
      console.error('Error fetching doctor verification requests:', err);
    }
  });
}


  getStatusName(statusValue: number): string {
    return DoctorRequestStatus[statusValue];
  }

}
