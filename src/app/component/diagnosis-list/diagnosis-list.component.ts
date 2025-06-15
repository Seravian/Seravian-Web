import { Component, Input, Output, EventEmitter, OnInit, ChangeDetectorRef } from '@angular/core';
import { ChatDiagnosisDto } from '../../interfaces/chat-diagnosis-dto';
import { filter, first, firstValueFrom, Subscription } from 'rxjs';
import { ChatService } from '../../services/chat.service';
import { Router } from '@angular/router';
import { NotifyChatDiagnosisReadyDto } from '../../interfaces/notify-chat-diagnosis-ready-dto';
import { ChatDiagnosisDetailsDto } from '../../interfaces/chat-diagnosis-details-dto';

@Component({
  selector: 'app-diagnosis-list',
  templateUrl: './diagnosis-list.component.html',
  styleUrls: ['./diagnosis-list.component.css']
})
export class DiagnosisListComponent implements OnInit {

  constructor(
    private chatService: ChatService,
    private cdr: ChangeDetectorRef,
    private router : Router
  ) {}

  // @Input() chatId: string = '';
  diagnoses: ChatDiagnosisDto[] = [];
  diagnosisDetails:ChatDiagnosisDetailsDto|null=null;

  pendingCount: number = 0;
  completeCount: number = 0;

  showDignosisConfirmModal:boolean = false;
  showDignosesConfirmModal:boolean = false;
  diagnosisToDelete:number = 0;

  ngOnInit() {
    this.loadChatDiagnoses();
    this.chatService['hubConnection'].on('notify-chat-diagnosis-ready', (data: NotifyChatDiagnosisReadyDto) => {
      // console.log('Diagnosis ready for chat', data);
      this.loadChatDiagnoses();
    });
  }

  ngOnChanges() {
    this.loadChatDiagnoses();
    this.updateCounts();
  }

  async loadChatDiagnoses():Promise<void>{
    const chat = await firstValueFrom(
      this.chatService.selectedChat$.pipe(
        filter(chat => !!chat), // skip null or undefined
        first()
      )
    );
    this.chatService.getChatDiagnoses(chat.id).subscribe({
      next: (data: ChatDiagnosisDto[]) => {
        this.diagnoses = data.map(item => ({
          ...item,
          requestedAtUtc: new Date(item.requestedAtUtc).toLocaleString(),
          completedAtUtc: item.completedAtUtc ? new Date(item.completedAtUtc).toLocaleString() : undefined,
        }));
        this.updateCounts();
        // console.log('chat diagnoses:', this.diagnoses);
      },
      error: (err) => {
        // console.error('Error getting diagnoses: ', err);
      }
    })
  }

  private updateCounts() {
    this.pendingCount = this.diagnoses.filter(d => d.completedAtUtc === undefined).length;
    this.completeCount = (this.diagnoses.length)-(this.pendingCount);
  }

  async viewDiagnosisDetails(id : number) {


    this.router.navigate(['/view-diagnosis', id]); // <-- pass id in path
  }

  getStatusBadgeClass(completedAt: string|undefined):string{

    if (!completedAt) {
      return 'pending';
    }else{
      return 'complete';
    }
  }

  isStatusPending(completedAt: string|undefined):boolean{

    if (!completedAt) {
      return true;
    }else{
      return false;
    }
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

  formatTime(date: string | undefined): string {
    if (!date) return 'Not available';

    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    }).format(new Date(date));
  }

  isDiagnosesEmpty():boolean{
    return this.diagnoses.length === 0;
  }

  cancelDelete():void{
    this.showDignosisConfirmModal = false;
    this.showDignosesConfirmModal = false;
  }

  promptDiagnosisDelete(id:number):void {
    this.showDignosisConfirmModal = true;
    this.diagnosisToDelete = id;
  }

  async deleteDiagnosis(){
    await firstValueFrom(
      this.chatService.deleteCompletedChatDiagnosis(this.diagnosisToDelete)
    );
    this.showDignosisConfirmModal = false;
    this.loadChatDiagnoses(); // refresh list
  }

  promptDiagnosesDelete():void {
    this.showDignosesConfirmModal = true;
  }

  async deleteDiagnoses(){

    const chat = await firstValueFrom(
      this.chatService.selectedChat$.pipe(
        filter(chat => !!chat), // skip null or undefined
        first()
      )
    );

    await firstValueFrom(
      this.chatService.deleteCompletedChatDiagnoses(chat.id)
    );
    this.showDignosesConfirmModal = false;
    this.loadChatDiagnoses(); // refresh list
  }

}
