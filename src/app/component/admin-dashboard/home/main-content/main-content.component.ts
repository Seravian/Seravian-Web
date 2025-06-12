import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../services/auth.service';
import { AdminDoctorVerificationRequestResponseDto } from '../../../../interfaces/admin-doctor-verification-request-response-dto';
import { DoctorRequestStatus } from '../../../../interfaces/doctor-request-status.enum';


@Component({
  selector: 'app-main-content',
  standalone: false,
  templateUrl: './main-content.component.html',
  styleUrl: './main-content.component.css'
})
export class MainContentComponent implements OnInit {

  // Stats
  totalRequests: number = 5;
  pendingRequests: number = 2;
  doctors: number = 2;

  verificationRequests : AdminDoctorVerificationRequestResponseDto[] = [];

  latestrequests: AdminDoctorVerificationRequestResponseDto[] = []

  constructor(private authservice: AuthService) { }

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests(){
    this.authservice.getAdminDoctorVerificationRequests().subscribe({
      next: (data: AdminDoctorVerificationRequestResponseDto[]) => {
        // this.verificationRequests = data.map(item => ({
        //   ...item,
        //   requestedAtUtc: new Date(item.requestedAtUtc).toLocaleString(),
        //   deletedAtUtc: item.deletedAtUtc ? new Date(item.deletedAtUtc).toLocaleString() : undefined,
        //   reviewedAtUtc: item.reviewedAtUtc ? new Date(item.reviewedAtUtc).toLocaleString() : undefined,
        // }));
        console.log('Doctor verification requests:', data);
      },
      error: (err) => {
        console.error('Error fetching doctor verification requests:', err);
      }
    });
  }

  getStatusName(statusValue: number): string {
    return DoctorRequestStatus[statusValue];
  }

  isTimeExpired(time: string): boolean {
    return Date.now() > new Date(time).getTime() + 60 * 60 * 1000;
  }

  signOut(): void {
    this.authservice.logout();
  }

}
