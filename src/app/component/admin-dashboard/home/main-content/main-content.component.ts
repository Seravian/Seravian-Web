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
  totalRequests: number = 0;
  pendingRequests: number = 0;
  doctors: number = 0;

  verificationRequests : AdminDoctorVerificationRequestResponseDto[] = [];

  constructor(private authservice: AuthService) { }

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests(){
    this.authservice.getAdminDoctorVerificationRequests().subscribe({
      next: (data: AdminDoctorVerificationRequestResponseDto[]) => {

        // 1. Sort by requestId descending and take top 4
        const top4Requests = [...data]
          .sort((a, b) => b.id - a.id)
          .slice(0, 4);

        // 2. Format and store the top 4
        this.verificationRequests = top4Requests.map(item => ({
          ...item,
          doctorImageUrl: item.doctorImageUrl + '?t=' + new Date().getTime(),
          requestedAtUtc: new Date(item.requestedAtUtc).toLocaleString(),
          deletedAtUtc: item.deletedAtUtc ? new Date(item.deletedAtUtc).toLocaleString() : undefined,
          reviewedAtUtc: item.reviewedAtUtc ? new Date(item.reviewedAtUtc).toLocaleString() : undefined,
        }));

        // console.log('Doctor verification requests:', data);
        this.totalRequests = data.length;
        this.pendingRequests = data.filter(response => response.status === DoctorRequestStatus.Pending).length;
        const uniqueDoctorIds = new Set<string>(
          data.map(response => response.doctorId)
        );
        this.doctors = uniqueDoctorIds.size;
      },
      error: (err) => {
        // console.error('Error fetching doctor verification requests:', err);
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
