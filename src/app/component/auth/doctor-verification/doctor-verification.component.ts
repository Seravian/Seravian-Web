import { Component, OnInit,} from '@angular/core';
import { Router } from '@angular/router';
import { DoctorVerificationRequestResponseDto } from '../../../interfaces/doctor-verification-request-response-dto';
import { AuthService } from '../../../services/auth.service';
import { DoctorRequestStatus } from '../../../interfaces/doctor-request-status.enum';
import { fa, th } from 'intl-tel-input/i18n';

@Component({
  selector: 'app-doctor-verification',
  templateUrl: './doctor-verification.component.html',
  styleUrl: './doctor-verification.component.css'
})

export class DoctorVerificationComponent implements OnInit {

  requests: DoctorVerificationRequestResponseDto[] = [];
  status = DoctorRequestStatus;
  ispending:boolean = false;
  showConfirmModal = false;
  requestToDelete:number = 0;
  requestToDeleteTime:string = '';
  requestToDeleteStatus:number = 0;

  constructor(private router: Router,private authservice: AuthService) {}

  ngOnInit(): void {
    this.loadRequests()
  }

  loadRequests(){
    this.authservice.getDoctorVerificationRequests().subscribe({
      next: (data: DoctorVerificationRequestResponseDto[]) => {
        this.requests = data.map(item => ({
          ...item,
          requestedAtUtc: new Date(item.requestedAtUtc).toLocaleString(),
          deletedAtUtc: item.deletedAtUtc ? new Date(item.deletedAtUtc).toLocaleString() : undefined,
          reviewedAtUtc: item.reviewedAtUtc ? new Date(item.reviewedAtUtc).toLocaleString() : undefined,
        }));
        // console.log('Doctor verification requests:', this.requests);
        this.ispending = data.some(response => response.status === DoctorRequestStatus.Pending);
      },
      error: (err) => {
        // console.error('Error fetching doctor verification requests:', err);
      }
    });
  }

  promptDelete(RequestID:number,RequestAT:string,RequestSTATUS:number):void {
    this.showConfirmModal = true;
    this.requestToDelete = RequestID;
    this.requestToDeleteTime = RequestAT;
    this.requestToDeleteStatus = RequestSTATUS;
  }

  cancelDelete():void{
    this.showConfirmModal = false;
    this.requestToDelete = 0;
    this.requestToDeleteTime = '';
    this.requestToDeleteStatus = 0;
  }

  deleteRequest():void{

    if (!this.isTimeExpired(this.requestToDeleteTime) && this.requestToDeleteStatus===this.status.Pending){

      this.authservice.deleteDoctorVerificationRequest(this.requestToDelete).subscribe({
        next:()=>{
          window.alert("request deleted successfully");
        },
        error:(err)=>{
          // console.error('Error deleting doctor verification request:', err);
        }
      })

      this.cancelDelete();
      this.loadRequests();

    }else{
      alert("can't delete request as 1 hour has passed since requested");
      return;
    }



  }

  getStatusName(statusValue: number): string {
    return DoctorRequestStatus[statusValue];
  }

  isTimeExpired(time: string): boolean {
    return Date.now() > new Date(time).getTime() + 60 * 60 * 1000;
  }

  addRequest() {
    if (this.ispending) {
      alert('You can only add a new request if there are no pending requests.');
      return;
    }
    this.router.navigate(['send-request']);
  }

}
