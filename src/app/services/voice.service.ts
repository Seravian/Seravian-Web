import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VoiceService {

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
  // ***************************************************************

  private recognition: any;
  private isListening = false;
  public transcriptSubject = new BehaviorSubject<string | null>(null);

  public transcript$ = this.transcriptSubject.asObservable();

  // audio levels *****************************************************
  public volumeLevelSubject = new BehaviorSubject<number>(0);
  public volumeLevel$ = this.volumeLevelSubject.asObservable();

  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private microphone: MediaStreamAudioSourceNode | null = null;
  private volumeInterval: any;
  // ******************************************************************

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
      navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
        this.monitorVolume(stream);
        this.recognition.start();
        this.isListening = true;
      });
      this.isListening = true;
    }



  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
      clearInterval(this.volumeInterval);
      this.volumeLevelSubject.next(0);
      this.audioContext?.close();
    }
  }

  isCurrentlyListening(): boolean {
    return this.isListening;
  }

  // audio levels *****************************************************

  private monitorVolume(stream: MediaStream) {
    this.audioContext = new AudioContext();
    this.analyser = this.audioContext.createAnalyser();
    this.microphone = this.audioContext.createMediaStreamSource(stream);
    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    this.microphone.connect(this.analyser);

    this.volumeInterval = setInterval(() => {
      this.analyser!.getByteFrequencyData(dataArray);
      let values = 0;
      for (let i = 0; i < dataArray.length; i++) {
        values += dataArray[i];
      }
      const average = values / dataArray.length;
      this.zone.run(() => {
        this.volumeLevelSubject.next(average);
      });
    }, 100); // ~10fps for realism
  }



}
