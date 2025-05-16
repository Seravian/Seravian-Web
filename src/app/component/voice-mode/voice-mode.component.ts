import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { VoiceService } from '../../services/voice.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-voice-mode',
  templateUrl: './voice-mode.component.html',
  styleUrls: ['./voice-mode.component.css']
})
export class VoiceModeComponent implements OnInit, OnDestroy {
  isListening = false;
  transcript: string = '';
  private transcriptSub!: Subscription;

  constructor(private voiceService: VoiceService, private router: Router) {}

  ngOnInit(): void {
    this.voiceService.startListening();
    this.isListening = true;

    this.transcriptSub = this.voiceService.transcript$.subscribe(text => {
      if (text) {
        this.transcript = text;
        this.downloadTranscript(text); // or send to backend
        this.isListening = false;
      }
    });
  }


  ngOnDestroy(): void {
    this.transcriptSub.unsubscribe();
  }

  toggleVoiceMode() {
    if (this.voiceService.isCurrentlyListening()) {
      this.voiceService.stopListening();
      this.isListening = false;
    } else {
      this.voiceService.startListening();
      this.isListening = true;
    }
  }

  private downloadTranscript(text: string) {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'voice-transcript.txt';
    anchor.click();
    window.URL.revokeObjectURL(url);
  }

  backToChat() {
  this.voiceService.stopListening();
  this.router.navigate(['/chatbot']);
}

}
