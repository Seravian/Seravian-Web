import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ChatDiagnosisDetailsDto } from '../../interfaces/chat-diagnosis-details-dto';
import { ChatService } from '../../services/chat.service';
import { firstValueFrom } from 'rxjs';

// interface Recommendation {
//   title: string;
//   description: string;
//   type: string;
// }

@Component({
  selector: 'app-view-diagnosis',
  templateUrl: './view-diagnosis.component.html',
  styleUrls: ['./view-diagnosis.component.css']
})
export class ViewDiagnosisComponent implements OnInit,OnDestroy {
  @Input() diagnosis: ChatDiagnosisDetailsDto | null = null;

  diagnosisId: number|null = null;

  showDignosisConfirmModal:boolean = false;

  defaultRecommendations: string[] = [
    'no recommendations'
  ];

  constructor(
    private chatService: ChatService,
    private location: Location,
    private route: ActivatedRoute,
    private router : Router
  ) {}

  ngOnInit() {
    // If no diagnosis is passed as input, you might want to load it based on route params
      if (this.diagnosisId === null) {
      const param = this.route.snapshot.paramMap.get('id');
      if (param) {
        this.diagnosisId = Number(param); // convert string to number
        this.loadDiagnosis(this.diagnosisId);
      }
    }
  }

  private loadDiagnosis(id: number) {
    // This would typically call a service to load the diagnosis
    // For now, we'll create a sample diagnosis
    this.chatService.getChatDiagnosisDetails(id).subscribe({
      next: (data: ChatDiagnosisDetailsDto) => {
        this.diagnosis = {
          ...data,
          requestedAtUtc: new Date(data.requestedAtUtc).toLocaleString(),
          completedAtUtc: data.completedAtUtc
            ? new Date(data.completedAtUtc).toLocaleString()
            : undefined,
        };
        // console.log('Viewing diagnosis:', data);
      },
      error: (err) => {
        // console.error('Error getting diagnosis detais:', err);
      }
    })
  }

  goBack() {
    this.location.back();
  }

  formatTime(date: string | undefined): string {
    if (!date) return 'Not available';

    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(new Date(date));
  }

    getDiagnosisStatusBadge(diagnosedProblem: string|undefined):string{

    if (diagnosedProblem) {
      return 'diagnosis success';
    }else{
      return 'diagnosis failure';
    }
  }

  getDiagnosisStatus(diagnosedProblem: string|undefined):string{

    if (diagnosedProblem) {
      return 'success';
    }else{
      return 'failure';
    }
  }

  isDiagnosisStatusFailure(diagnosedProblem: string|undefined):boolean{

    if (!diagnosedProblem) {
      return true;
    }else{
      return false;
    }
  }

  cancelDelete():void{
    this.showDignosisConfirmModal = false;
  }

  promptDiagnosisDelete():void {
    this.showDignosisConfirmModal = true;
  }

  async deleteDiagnosis(){
    await firstValueFrom(
      this.chatService.deleteCompletedChatDiagnosis(this.diagnosis?.id)
    );
    this.showDignosisConfirmModal = false;
    this.router.navigate(['/diagnosis-list'])
  }

  ngOnDestroy(): void {
    this.diagnosis = null;
    this.diagnosisId = null;

  }

}
