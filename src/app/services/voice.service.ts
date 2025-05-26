
// import { Injectable, NgZone } from '@angular/core';
// import { BehaviorSubject, Subscription } from 'rxjs';
// import { ChatService } from './chat.service';

// @Injectable({
//   providedIn: 'root',
// })
// export class VoiceService {
//   private isVoiceModeActive: boolean = false;
//   private isListening = false;
//   private mediaStream: MediaStream | null = null;
//   // private recognition: any;
//   private audioChunks: Blob[] = [];
//   private mediaRecorder!: MediaRecorder;
//   private audioContext: AudioContext | null = null;
//   private analyser: AnalyserNode | null = null;
//   private microphone: MediaStreamAudioSourceNode | null = null;
//   private volumeInterval: any;
//   // private hasSpeech = false;
//   // private speechRecognitionStarted = false;
//   private silenceInterval: any = null;
//   private silenceAudioContext: AudioContext | null = null;


//   public transcriptSubject = new BehaviorSubject<string | null>(null);
//   public transcript$ = this.transcriptSubject.asObservable();

//   public volumeLevelSubject = new BehaviorSubject<number>(0);
//   public volumeLevel$ = this.volumeLevelSubject.asObservable();

//   constructor(private zone: NgZone,private chatservice : ChatService) {
//     // this.initRecognition();
//   }

//   // ==============================
//   activateVoiceModeService() {
//     this.isVoiceModeActive = true;
//   }

//   deactivateVoiceModeService() {
//     this.isVoiceModeActive = false;
//   }

//   getVoiceModeStatus(): boolean {
//     return this.isVoiceModeActive;
//   }

//   isCurrentlyListening(): boolean {
//     return this.isListening;
//   }

//   // ==============================
//   // private initRecognition() {
//   //   const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

//   //   if (!SpeechRecognition) {
//   //     console.warn('SpeechRecognition is not supported in this browser.');
//   //     return;
//   //   }

//   //   this.recognition = new SpeechRecognition();
//   //   this.recognition.lang = 'en-US';
//   //   this.recognition.continuous = true;
//   //   this.recognition.interimResults = false;

//   //   this.recognition.onresult = (event: any) => {
//   //     const transcript = event.results[0][0].transcript.trim();
//   //     if (transcript.length > 0) {
//   //       this.hasSpeech = true;
//   //       this.zone.run(() => this.transcriptSubject.next(transcript));
//   //     }
//   //   };

//   //   this.recognition.onerror = (event: any) => {
//   //     console.error('Speech recognition error:', event.error);
//   //   };

//   //   this.recognition.onend = () => {
//   //     this.speechRecognitionStarted = false;
//   //   };
//   // }

//   startListening() {
//     if (this.isListening) return;

//     navigator.mediaDevices.getUserMedia({ audio: {
//       echoCancellation:true,
//       noiseSuppression: true, // helps reduce background noise
//       autoGainControl: true // helps normalize volume levels
//     } }).then(stream => {
//       this.mediaStream = stream; // ✅ store it
//       this.isListening = true;
//       // this.hasSpeech = false;
//       // this.speechRecognitionStarted = false;
//       this.monitorVolume(stream); // for circle animation only
//       this.startRecording(stream); // real recording
//       this.detectSilenceDuringRecording(stream); // silence logic + speechRecognition
//     });
//   }

//   stopListening() {
//     if (!this.isListening) return;

//     // if (this.recognition && this.speechRecognitionStarted) {
//     //   this.recognition.stop();
//     //   console.log('Speech recognition stopped.');
//     // }

//     if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
//       this.mediaRecorder.stop(); // triggers onstop
//       console.log('MediaRecorder stopped.');
//     }

//     // ✅ Stop the silence interval and audio context
//     if (this.silenceInterval) {
//       clearInterval(this.silenceInterval);
//       this.silenceInterval = null;
//     }

//     if (this.silenceAudioContext) {
//       this.silenceAudioContext.close();
//       this.silenceAudioContext = null;
//     }

//     // Stop the microphone stream
//     if (this.mediaStream) {
//       this.mediaStream.getTracks().forEach(track => track.stop()); // ✅ stops the mic
//       this.mediaStream = null;
//     }

//     clearInterval(this.volumeInterval);
//     this.volumeLevelSubject.next(0);
//     this.audioContext?.close();
//     this.audioContext = null;

//     this.isListening = false;
//   }

//   private startRecording(stream: MediaStream) {
//     this.audioChunks = [];
//     this.mediaRecorder = new MediaRecorder(stream);

//     this.mediaRecorder.ondataavailable = (e) => this.audioChunks.push(e.data);

//     this.mediaRecorder.onstop = () => {
//       // if (!this.hasSpeech) {
//       //   console.log('Recording stopped — no speech detected. Skipping upload.');
//       //   return;
//       // }
//       if (this.isVoiceModeActive) {
//         const audioBlob = new Blob(this.audioChunks);
//         console.log('going to send audio to backend...');
//         this.sendAudioToBackend(audioBlob);
//         // this.downloadRecordedAudio(audioBlob);
//         this.audioChunks = []; // Clear chunks after sending
//         this.audioChunks.pop(); // Remove the last empty chunk if any
//       }
//     };

//     this.mediaRecorder.start();
//   }


//   private detectSilenceDuringRecording(stream: MediaStream) {
//     const silenceThreshold = 20;
//     const silenceDelay = 2000;

//     let silenceTimer: any = null;
//     let userStartedSpeaking = false;

//     this.silenceAudioContext = new AudioContext();
//     const analyser = this.silenceAudioContext.createAnalyser();
//     const source = this.silenceAudioContext.createMediaStreamSource(stream);
//     analyser.fftSize = 2048;
//     const dataArray = new Uint8Array(analyser.frequencyBinCount);
//     source.connect(analyser);

//     this.silenceInterval = setInterval(() => {
//       analyser.getByteFrequencyData(dataArray);
//       const avg = dataArray.reduce((sum, val) => sum + val, 0) / dataArray.length;
//       console.log('Average volume level:', avg);

//       if (avg > silenceThreshold) {
//         if (!userStartedSpeaking) {
//           userStartedSpeaking = true;
//           // if (this.recognition && !this.speechRecognitionStarted) {
//           //   this.recognition.start();
//           //   this.speechRecognitionStarted = true;
//           // }
//         }

//         if (silenceTimer) {
//           clearTimeout(silenceTimer);
//           silenceTimer = null;
//         }
//       } else if (userStartedSpeaking) {
//         if (!silenceTimer) {
//           silenceTimer = setTimeout(() => {
//             this.stopListening(); // triggers onstop
//           }, silenceDelay);
//         }
//       }
//     }, 100);
//   }

//   private monitorVolume(stream: MediaStream) {
//     this.audioContext = new AudioContext();
//     this.analyser = this.audioContext.createAnalyser();
//     this.microphone = this.audioContext.createMediaStreamSource(stream);
//     const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
//     this.microphone.connect(this.analyser);

//     this.volumeInterval = setInterval(() => {
//       this.analyser!.getByteFrequencyData(dataArray);
//       let values = 0;
//       for (let i = 0; i < dataArray.length; i++) {
//         values += dataArray[i];
//       }
//       const average = values / dataArray.length;
//       this.zone.run(() => {
//         this.volumeLevelSubject.next(average);
//       });
//     }, 100);
//   }


//   private chatSubscription?: Subscription;

//   private sendAudioToBackend(blob: Blob) {
//     // Clean up previous subscription
//     this.chatSubscription?.unsubscribe();

//     this.chatSubscription = this.chatservice.selectedChat$.subscribe(chat => {
//       if (!chat?.id) {console.log('select chat to send audio'); return;}

//       const file = new File([blob], 'recording.webm', { type: 'audio/webm' });

//       this.chatservice.uploadVoice(file, chat.id).subscribe({
//         next: (res) => {
//           console.log('Voice uploaded successfully:', res);
//         },
//         error: (err) => {
//           console.error('Error uploading voice:', err);
//         }
//       });
//     });
//     this.chatSubscription?.unsubscribe();
//   }

//   // downloadRecordedAudio(blob: Blob) {
//   //   // Clean up previous subscription
//   //   this.chatSubscription?.unsubscribe();

//   //   console.log('isVoiceModeActive:', this.isVoiceModeActive);
//   //   if(this.isVoiceModeActive) {
//   //     this.chatSubscription = this.chatservice.selectedChat$.subscribe(chat => {
//   //       if (!chat?.id) {console.log('select chat to send audio'); return;}

//   //       if (!blob) {
//   //         console.warn('No blob provided for download.');
//   //         return;
//   //       }

//   //       console.log('blob:', blob);

//   //       const url = URL.createObjectURL(blob);
//   //       const a = document.createElement('a');
//   //       a.href = url;
//   //       a.download = 'recorded-voice.webm';
//   //       document.body.appendChild(a);
//   //       a.click();

//   //       // Clean up
//   //       document.body.removeChild(a);
//   //       URL.revokeObjectURL(url);
//   //     });
//   //     this.chatSubscription?.unsubscribe();
//   //   }
//   // }

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
  private audioChunks: Blob[] = [];
  private mediaRecorder!: MediaRecorder;
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private microphone: MediaStreamAudioSourceNode | null = null;
  private volumeInterval: any;
  private silenceInterval: any = null;
  private silenceAudioContext: AudioContext | null = null;
  // private isAllowedToSendVoice = false;


  public transcriptSubject = new BehaviorSubject<string | null>(null);
  public transcript$ = this.transcriptSubject.asObservable();

  public volumeLevelSubject = new BehaviorSubject<number>(0);
  public volumeLevel$ = this.volumeLevelSubject.asObservable();

  constructor(private zone: NgZone,private chatservice : ChatService) {
    this.chatservice['hubConnection'].on('notify-ai-audio-response-ready', (data: { aiAudioId: number; chatId: string }) => {

      this.playAiAudio(+data.aiAudioId);
      
    });

  }

  playAiAudio(aiAudioId: number) {
    if (this.isVoiceModeActive) {
      // this.isAllowedToSendVoice = true;
      this.isListening = false;
      this.startListening();

      this.chatservice.downloadAIAudio(aiAudioId).subscribe({
        next: async (blob) => {
          try {
            const wavBlob = await this.pcmToWav(blob);
            await this.playWithInterruptDetection(wavBlob);
          } catch (err) {
            console.error('Error playing AI audio:', err);
          }
        },
        error: (err) => {
          console.error('Error downloading AI audio:', err);
        }
      });
    }
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


  startListening() {
    console.log('startListening() called, isListening:', this.isListening);
    if (this.isListening) return;

    navigator.mediaDevices.getUserMedia({ audio: {
      echoCancellation:true,
      noiseSuppression: true, // helps reduce background noise
      autoGainControl: true // helps normalize volume levels
    } }).then(stream => {
      console.log('MediaStream obtained:', stream);
      this.mediaStream = stream; // ✅ store it
      this.isListening = true;
      this.monitorVolume(stream); // for circle animation only
      this.startRecording(stream); // real recording
      this.detectSilenceDuringRecording(stream); // silence logic + speechRecognition
    });
  }

  stopListening() {
    if (!this.isListening) return;

    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop(); // triggers onstop
      console.log('MediaRecorder stopped.');
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

      if (this.isVoiceModeActive) {
        const audioBlob = new Blob(this.audioChunks);
        console.log('going to send audio to backend...');
        this.sendAudioToBackend(audioBlob);
        this.audioChunks = []; // Clear chunks after sending
        this.audioChunks.pop(); // Remove the last empty chunk if any

      }
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
    this.chatSubscription?.unsubscribe();
  }


  // playing AI audio response logic

  private async pcmToWav(blob: Blob): Promise<Blob> {
    const arrayBuffer = await blob.arrayBuffer();
    const pcmData = new DataView(arrayBuffer);
    const numOfChannels = 1;
    const sampleRate = 24000;
    const bytesPerSample = 2;
    const blockAlign = numOfChannels * bytesPerSample;
    const byteRate = sampleRate * blockAlign;
    const wavBuffer = new ArrayBuffer(44 + pcmData.byteLength);
    const view = new DataView(wavBuffer);
    // RIFF chunk descriptor
    this.writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + pcmData.byteLength, true);
    this.writeString(view, 8, 'WAVE');
    // fmt sub-chunk
    this.writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true); // SubChunk1Size
    view.setUint16(20, 1, true); // AudioFormat (PCM)
    view.setUint16(22, numOfChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, byteRate, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, bytesPerSample * 8, true);
    // data sub-chunk
    this.writeString(view, 36, 'data');
    view.setUint32(40, pcmData.byteLength, true);
    // Write PCM samples
    for (let i = 0; i < pcmData.byteLength; i++) {
      view.setInt8(44 + i, pcmData.getInt8(i));
    }
    return new Blob([view], { type: 'audio/wav' });
  }

  private writeString(view: DataView, offset: number, str: string) {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  }

  // private async playWavWithAudioContext(wavBlob: Blob): Promise<void> {
  //   const arrayBuffer = await wavBlob.arrayBuffer();

  //   const audioContext = new AudioContext();
  //   const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  //   const source = audioContext.createBufferSource();
  //   source.buffer = audioBuffer;
  //   source.connect(audioContext.destination);
  //   source.start();

  //   return new Promise((resolve) => {
  //     source.onended = () => {
  //       audioContext.close();
  //       resolve();
  //     };
  //   });
  // }


  // private monitorUserInterruptDuringPlayback(stream: MediaStream, source: AudioBufferSourceNode) {
  //   const context = new AudioContext();
  //   const analyser = context.createAnalyser();
  //   const micSource = context.createMediaStreamSource(stream);
  //   analyser.fftSize = 2048;
  //   const dataArray = new Uint8Array(analyser.frequencyBinCount);
  //   micSource.connect(analyser);

  //   const threshold = 20;
  //   const interval = setInterval(() => {
  //     analyser.getByteFrequencyData(dataArray);
  //     const avg = dataArray.reduce((sum, val) => sum + val, 0) / dataArray.length;
  //     if (avg > threshold) {
  //       source.stop();
  //       clearInterval(interval);
  //       context.close();
  //       console.log('Playback interrupted due to user speaking');
  //     }
  //   }, 100);
  // }

  // private async playWithInterruptDetection(wavBlob: Blob): Promise<void> {
  //   const audioContext = new AudioContext();
  //   const analyser = audioContext.createAnalyser();
  //   analyser.fftSize = 2048;
  //   const threshold = 20;

  //   const userStream = await navigator.mediaDevices.getUserMedia({ audio: true });
  //   const micSource = audioContext.createMediaStreamSource(userStream);
  //   micSource.connect(analyser);

  //   const arrayBuffer = await wavBlob.arrayBuffer();
  //   const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  //   const source = audioContext.createBufferSource();
  //   source.buffer = audioBuffer;
  //   source.connect(audioContext.destination);
  //   source.start();

  //   return new Promise((resolve) => {
  //     const dataArray = new Uint8Array(analyser.frequencyBinCount);
  //     const interval = setInterval(() => {
  //       analyser.getByteFrequencyData(dataArray);
  //       const avg = dataArray.reduce((sum, val) => sum + val, 0) / dataArray.length;
  //       if (avg > threshold) {
  //         console.log('User speaking — interrupting playback');
  //         source.stop();
  //       }
  //     }, 100);

  //     source.onended = () => {
  //       clearInterval(interval);
  //       userStream.getTracks().forEach(track => track.stop());
  //       audioContext.close();
  //       resolve();
  //     };
  //   });
  // }

  private async playWithInterruptDetection(wavBlob: Blob): Promise<void> {
    const audioContext = new AudioContext();
    await audioContext.resume(); // Ensures playback works on Safari/mobile

    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 2048;
    const threshold = 20;

    try {
      const userStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const micSource = audioContext.createMediaStreamSource(userStream);
      micSource.connect(analyser);

      const arrayBuffer = await wavBlob.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);
      source.start();

      return new Promise((resolve) => {
        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        const interval = setInterval(() => {
          analyser.getByteFrequencyData(dataArray);
          const avg = dataArray.reduce((sum, val) => sum + val, 0) / dataArray.length;
          if (avg > threshold) {
            console.log('User speaking — interrupting playback');
            source.stop();
          }
        }, 100);

        source.onended = () => {
          clearInterval(interval);
          userStream.getTracks().forEach(track => track.stop());
          audioContext.close();
          resolve();
        };
      });
    } catch (err) {
      console.error("Failed to access microphone or play audio:", err);
      audioContext.close();
      return;
    }
  }





}
