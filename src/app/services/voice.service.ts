// import { Injectable, NgZone } from '@angular/core';
// import { th } from 'intl-tel-input/i18n';
// import { BehaviorSubject } from 'rxjs';

// @Injectable({
//   providedIn: 'root',
// })
// export class VoiceService {
//   private isVoiceModeActive: boolean = false;
//   private mediaRecorder!: MediaRecorder;
//   private audioContext: AudioContext | null = null;
//   private analyser!: AnalyserNode;
//   private source!: MediaStreamAudioSourceNode;
//   private volumeInterval: any;
//   private stream!: MediaStream;
//   private activeChunk: Blob[] = [];
//   private chunksQueue: Blob[][] = [];
//   private isBuffering = false;
//   private silenceTimer: any = null;
//   private readonly silenceThreshold = 20;
//   private readonly silenceDelay = 1500;

//   public volumeLevelSubject = new BehaviorSubject<number>(0);
//   public volumeLevel$ = this.volumeLevelSubject.asObservable();

//   constructor(private zone: NgZone) {}

//   activateVoiceModeService() {
//     this.isVoiceModeActive = true;
//     this.startRecordingAndMonitoring();
//   }

//   deactivateVoiceModeService() {
//     this.isVoiceModeActive = false;
//     this.cleanup();
//   }

//   getVoiceModeStatus(): boolean {
//     return this.isVoiceModeActive;
//   }

//   private async startRecordingAndMonitoring() {
//     console.log('Starting Recording And Monitoring...');
//     this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//     this.setupVolumeMonitor(this.stream);
//     this.setupMediaRecorder(this.stream);
//     console.log('MediaRecorder stream:', this.stream);
//     this.mediaRecorder.start();
//   }

//   private setupVolumeMonitor(stream: MediaStream) {
//     console.log('Setting up volume monitor...');
//     this.audioContext = new AudioContext();
//     this.analyser = this.audioContext.createAnalyser();
//     this.source = this.audioContext.createMediaStreamSource(stream);
//     this.source.connect(this.analyser);
//     const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
//     console.log('source:', this.source);
//     console.log('analyser:', this.analyser);

//     this.volumeInterval = setInterval(() => {
//       this.analyser.getByteFrequencyData(dataArray);
//       const avg = dataArray.reduce((sum, val) => sum + val, 0) / dataArray.length;
//       console.log('Average volume level:', avg);

//       this.zone.run(() => {
//         this.volumeLevelSubject.next(avg);
//       });

//       if (avg > this.silenceThreshold) {
//         if (!this.isBuffering) {
//           this.startBuffering();
//         }
//         if (this.silenceTimer) {
//           clearTimeout(this.silenceTimer);
//           this.silenceTimer = null;
//         }
//       } else {
//         if (this.isBuffering && !this.silenceTimer) {
//           this.silenceTimer = setTimeout(() => {
//             this.stopBuffering();
//           }, this.silenceDelay);
//         }
//       }
//     }, 100);
//     console.log('Volume interval :', this.volumeInterval);
//   }

//   private setupMediaRecorder(stream: MediaStream) {
//     console.log('Setting up media recorder...');
//     this.mediaRecorder = new MediaRecorder(stream);
//     this.mediaRecorder.ondataavailable = (e) => {
//       if (this.isBuffering) {
//         console.log('Data available:', e.data);
//         this.activeChunk.push(e.data);
//       }
//     };
//   }

//   private startBuffering() {
//     this.activeChunk = [];
//     this.chunksQueue.push(this.activeChunk);
//     console.log('activeChunk:', this.activeChunk);
//     console.log('chunksQueue:', this.chunksQueue);
//     this.isBuffering = true;
//   }

//   private stopBuffering() {
//     console.log('Stopping buffering...');
//     if (this.activeChunk.length > 0) {
//       const chunk = [...this.activeChunk];
//       this.checkForSpeech(chunk);
//     }
//     this.activeChunk = [];
//     this.isBuffering = false;
//   }

//   private checkForSpeech(blobParts: Blob[]) {
//     console.log('Checking for speech...');
//     const blob = new Blob(blobParts, { type: 'audio/webm' });
//     const recognition = new (window as any).webkitSpeechRecognition() || (window as any).SpeechRecognition;

//     if (!recognition) {
//       console.warn('SpeechRecognition not supported');
//       return;
//     }

//     const reader = new FileReader();
//     reader.readAsDataURL(blob);
//     reader.onloadend = () => {
//       const audioUrl = reader.result as string;
//       const audio = new Audio(audioUrl);

//       audio.oncanplaythrough = () => {
//         const rec = new recognition.constructor();
//         rec.lang = 'en-US';
//         rec.onresult = (event: any) => {
//           const transcript = event.results[0][0].transcript;
//           if (transcript && transcript.trim().length > 0) {
//             // this.sendAudioToBackend(blob);
//             this.downloadRecordedAudio(blob);
//           }
//         };
//         rec.onerror = (e: any) => {
//           console.warn('SpeechRecognition error on audio chunk', e.error);
//         };
//         rec.start();
//       };
//     };
//   }

//   private cleanup() {
//     console.log('Cleaning up...');
//     if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
//       this.mediaRecorder.stop();
//     }
//     clearInterval(this.volumeInterval);
//     this.audioContext?.close();
//     this.volumeLevelSubject.next(0);
//     this.activeChunk = [];
//     this.chunksQueue = [];
//   }

//   private sendAudioToBackend(blob: Blob) {
//     console.log('Sending audio to backend...');
//     const formData = new FormData();
//     formData.append('audio', blob, 'recording.webm');

//     fetch('https://your-backend-endpoint/api/audio', {
//       method: 'POST',
//       body: formData
//     })
//     .then(response => console.log('Audio uploaded', response))
//     .catch(error => console.error('Upload error', error));

//   }

//   public downloadRecordedAudio(blob: Blob) {
//     console.log('Downloading recorded audio...');
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = `recorded-speech-${Date.now()}.webm`;
//     document.body.appendChild(a);
//     a.click();
//     document.body.removeChild(a);
//     URL.revokeObjectURL(url);
//   }
// }

import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ChatService } from './chat.service';

@Injectable({
  providedIn: 'root',
})
export class VoiceService {
  private isVoiceModeActive: boolean = false;
  private isListening = false;
  private mediaStream: MediaStream | null = null;
  private recognition: any;
  private audioChunks: Blob[] = [];
  private mediaRecorder!: MediaRecorder;
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private microphone: MediaStreamAudioSourceNode | null = null;
  private volumeInterval: any;
  private hasSpeech = false;
  private speechRecognitionStarted = false;
  private silenceInterval: any = null;
  private silenceAudioContext: AudioContext | null = null;


  public transcriptSubject = new BehaviorSubject<string | null>(null);
  public transcript$ = this.transcriptSubject.asObservable();

  public volumeLevelSubject = new BehaviorSubject<number>(0);
  public volumeLevel$ = this.volumeLevelSubject.asObservable();

  constructor(private zone: NgZone,private chatservice : ChatService) {
    this.initRecognition();
  }

  // ==============================
  activateVoiceModeService() {
    this.isVoiceModeActive = true;
  }

  deactivateVoiceModeService() {
    this.isVoiceModeActive = false;
  }

  getVoiceModeStatus(): boolean {
    return this.isVoiceModeActive;
  }

  isCurrentlyListening(): boolean {
    return this.isListening;
  }

  // ==============================
  private initRecognition() {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn('SpeechRecognition is not supported in this browser.');
      return;
    }

    this.recognition = new SpeechRecognition();
    this.recognition.lang = 'en-US';
    this.recognition.continuous = true;
    this.recognition.interimResults = false;

    this.recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript.trim();
      if (transcript.length > 0) {
        this.hasSpeech = true;
        this.zone.run(() => this.transcriptSubject.next(transcript));
      }
    };

    this.recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
    };

    this.recognition.onend = () => {
      this.speechRecognitionStarted = false;
    };
  }

  startListening() {
    if (this.isListening) return;

    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
      this.mediaStream = stream; // ✅ store it
      this.isListening = true;
      this.hasSpeech = false;
      this.speechRecognitionStarted = false;
      this.monitorVolume(stream); // for circle animation only
      this.startRecording(stream); // real recording
      this.detectSilenceDuringRecording(stream); // silence logic + speechRecognition
    });
  }

  stopListening() {
    if (!this.isListening) return;

    if (this.recognition && this.speechRecognitionStarted) {
      this.recognition.stop();
    }

    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop(); // triggers onstop
    }

    // ✅ Stop the silence interval and audio context
    if (this.silenceInterval) {
      clearInterval(this.silenceInterval);
      this.silenceInterval = null;
    }

    if (this.silenceAudioContext) {
      this.silenceAudioContext.close();
      this.silenceAudioContext = null;
    }

    // Stop the microphone stream
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop()); // ✅ stops the mic
      this.mediaStream = null;
    }

    clearInterval(this.volumeInterval);
    this.volumeLevelSubject.next(0);
    this.audioContext?.close();
    this.audioContext = null;

    this.isListening = false;
  }

  private startRecording(stream: MediaStream) {
    this.audioChunks = [];
    this.mediaRecorder = new MediaRecorder(stream);

    this.mediaRecorder.ondataavailable = (e) => this.audioChunks.push(e.data);

    this.mediaRecorder.onstop = () => {
      if (!this.hasSpeech) {
        console.log('Recording stopped — no speech detected. Skipping upload.');
        return;
      }

      const audioBlob = new Blob(this.audioChunks);
      this.sendAudioToBackend(audioBlob);
      // this.downloadRecordedAudio(audioBlob);
    };

    this.mediaRecorder.start();
  }

  private detectSilenceDuringRecording(stream: MediaStream) {
    const silenceThreshold = 20;
    const silenceDelay = 2000;

    let silenceTimer: any = null;
    let userStartedSpeaking = false;

    this.silenceAudioContext = new AudioContext();
    const analyser = this.silenceAudioContext.createAnalyser();
    const source = this.silenceAudioContext.createMediaStreamSource(stream);
    analyser.fftSize = 2048;
    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    source.connect(analyser);

    this.silenceInterval = setInterval(() => {
      analyser.getByteFrequencyData(dataArray);
      const avg = dataArray.reduce((sum, val) => sum + val, 0) / dataArray.length;
      console.log('Average volume level:', avg);

      if (avg > silenceThreshold) {
        if (!userStartedSpeaking) {
          userStartedSpeaking = true;
          if (this.recognition && !this.speechRecognitionStarted) {
            this.recognition.start();
            this.speechRecognitionStarted = true;
          }
        }

        if (silenceTimer) {
          clearTimeout(silenceTimer);
          silenceTimer = null;
        }
      } else if (userStartedSpeaking) {
        if (!silenceTimer) {
          silenceTimer = setTimeout(() => {
            this.stopListening(); // triggers onstop
          }, silenceDelay);
        }
      }
    }, 100);
  }

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
    }, 100);
  }

  private chatSubscription?: Subscription;

  private sendAudioToBackend(blob: Blob) {
    // Clean up previous subscription
    this.chatSubscription?.unsubscribe();

    this.chatSubscription = this.chatservice.selectedChat$.subscribe(chat => {
      if (!chat?.id) {console.log('select chat to send audio'); return;}

      const file = new File([blob], 'recording.webm', { type: 'audio/webm' });

      this.chatservice.uploadVoice(file, chat.id).subscribe({
        next: (res) => {
          console.log('Voice uploaded successfully:', res);
        },
        error: (err) => {
          console.error('Error uploading voice:', err);
        }
      });
    });
  }


}
