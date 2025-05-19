import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VoiceService {
  private recognition: any;
  private isListening = false;
  private transcriptSubject = new BehaviorSubject<string | null>(null);

  public transcript$ = this.transcriptSubject.asObservable();

  // ***************************************************************
  private isVoiceModeActive: boolean = false;

  activateVoiceModeService() {
    this.isVoiceModeActive = true;
  }

  deactivateVoiceModeService() {
    this.isVoiceModeActive = false;
  }

  getVoiceModeStatus(): boolean {
    return this.isVoiceModeActive;
  }
// **********************************************************

  constructor(private zone: NgZone) {
    this.initRecognition();
  }

  private initRecognition() {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn('SpeechRecognition is not supported in this browser.');
      return;
    }

    this.recognition = new SpeechRecognition();
    this.recognition.lang = 'en-US';
    this.recognition.continuous = false;
    this.recognition.interimResults = false;

    this.recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      this.zone.run(() => {
        this.transcriptSubject.next(transcript);
        this.isListening = false;
      });
    };

    this.recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      this.zone.run(() => {
        this.transcriptSubject.next(null);
        this.isListening = false;
      });
    };

    this.recognition.onend = () => {
      this.zone.run(() => {
        this.isListening = false;
      });
    };
  }

  startListening() {
    if (!this.recognition) return;

    if (!this.isListening) {
      this.recognition.start();
      this.isListening = true;
    }
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  isCurrentlyListening(): boolean {
    return this.isListening;
  }
}
