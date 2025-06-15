import { Component,OnInit } from '@angular/core';
import { DoctorRequestStatus } from '../../../../interfaces/doctor-request-status.enum';
import { AdminDoctorVerificationRequestResponseDto } from '../../../../interfaces/admin-doctor-verification-request-response-dto';
import { AuthService } from '../../../../services/auth.service';
import { DocotorTitle } from '../../../../interfaces/doctor-title.enum';


@Component({
  selector: 'app-appointments',
  standalone:false,
  templateUrl: './appointments.component.html',
  styleUrl: './appointments.component.css'
})
export class AppointmentsComponent implements OnInit {

  verificationRequests : AdminDoctorVerificationRequestResponseDto[] = [];

  constructor(private authservice: AuthService) { }

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests(){
    this.authservice.getAdminDoctorVerificationRequests().subscribe({
      next: (data: AdminDoctorVerificationRequestResponseDto[]) => {

        this.verificationRequests = data.map(item => ({
          ...item,
          doctorImageUrl: item.doctorImageUrl + '?t=' + new Date().getTime(),
          requestedAtUtc: new Date(item.requestedAtUtc).toLocaleString(),
          deletedAtUtc: item.deletedAtUtc ? new Date(item.deletedAtUtc).toLocaleString() : undefined,
          reviewedAtUtc: item.reviewedAtUtc ? new Date(item.reviewedAtUtc).toLocaleString() : undefined,
        }));

        // console.log('Doctor verification requests:', data);

      },
      error: (err) => {
        // console.error('Error fetching doctor verification requests:', err);
      }
    });
  }

  getStatusName(statusValue: number): string {
    return DoctorRequestStatus[statusValue];
  }

  getTitleName(titleValue: number): string {
    return DocotorTitle[titleValue];
  }

  isTimeExpired(time: string): boolean {
    return Date.now() > new Date(time).getTime() + 60 * 60 * 1000;
  }

  calculateAgeFromDob(dobString: string): number {
    const dob = new Date(dobString);

    if (isNaN(dob.getTime())) {
      throw new Error("Invalid date format");
    }

    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();

    // Adjust if birthday hasn't occurred yet this year
    const hasBirthdayPassedThisYear =
      today.getMonth() > dob.getMonth() ||
      (today.getMonth() === dob.getMonth() && today.getDate() >= dob.getDate());

    if (!hasBirthdayPassedThisYear) {
      age--;
    }

    return age;
  }


  signOut(): void {
    this.authservice.logout();
  }

}
