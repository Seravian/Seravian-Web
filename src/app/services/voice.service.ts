
import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, Subscription, firstValueFrom } from 'rxjs';
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

  private isMicOpen: boolean = false;
  private isAiProcessing: boolean = false;
  private userStartedSpeaking = false;

  private aiAudioContext: AudioContext | null = null;
  private aiAudioSource: AudioBufferSourceNode | null = null;
  private aiUserStream: MediaStream | null = null;
  private playbackInterruptInterval: any = null;

  // private chatSubscription?: Subscription;

  // public transcriptSubject = new BehaviorSubject<string | null>(null);
  // public transcript$ = this.transcriptSubject.asObservable();

  public volumeLevelSubject = new BehaviorSubject<number>(0);
  public volumeLevel$ = this.volumeLevelSubject.asObservable();

  constructor(private zone: NgZone,private chatservice : ChatService) {

    this.chatservice['hubConnection'].on('notify-ai-audio-response-ready', (data: { aiAudioId: number; chatId: string }) => {
      console.log('Received AI audio response notification:', data);
      this.playAiAudio(+data.aiAudioId);
    });

  }

  playAiAudio(aiAudioId: number) {
    if (this.isVoiceModeActive) {
      this.isMicOpen = true;
      this.isAiProcessing = false;
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

  // ==============================

  async activateMicService() {
    // if (!this.mediaStream) {
    //   console.log('Mic Not Allowed.');
    //   return;
    // }
    const aiStatus = await this.isAiProcessingStatus();
    if (aiStatus) {
      this.isMicOpen = false;
      this.isAiProcessing = true;
      console.log('AI is still processing, please wait.');
      return;
    }
    this.isMicOpen = true;
    if (this.mediaStream) {
      this.mediaStream.getAudioTracks().forEach(track => track.enabled = true);
      console.log('Microphone unmuted.');
    }
    if(this.aiUserStream) {
      console.log('Resuming AI user stream...............................................');
      this.aiUserStream.getTracks().forEach(track => track.enabled = true); // Resume AI user stream if it exists
    }
  }

  deactivateMicService() {
    this.isMicOpen = false;
    if (this.mediaStream) {
      this.mediaStream.getAudioTracks().forEach(track => track.enabled = false);
      console.log('Microphone muted.');
    }
    if(this.aiUserStream) {
      console.log('Stopping AI user stream...............................................');
      this.aiUserStream.getTracks().forEach(track => track.enabled = false); // Stop AI user stream if it exists
      console.log('AI Microphone muted.');
    }
  }


  getMicStatus(): boolean {
    return this.isMicOpen;
  }

  getUserSpeakingStatus(): boolean {
    return this.userStartedSpeaking;
  }

  // ==============================

  activateAiProcessingService() {
    this.isAiProcessing = true;
  }

  deactivateAiProcessingService() {
    this.isAiProcessing = false;
  }

  getAiProcessingStatus(): boolean {
    return this.isAiProcessing;
  }

  // ==============================

  async isAiProcessingStatus(): Promise<boolean> {
    try {
      const chat = await firstValueFrom(this.chatservice.selectedChat$);
      const status = await firstValueFrom(this.chatservice.isAiProcessing(chat.id));
      return status;
    } catch (error) {
      console.error('Error fetching status:', error);
      return false;
    }
  }

  // ==============================


   async startListening() {
    console.log('startListening() called, isListening:', this.isListening);
    if (this.isListening) return;

    const aiStatus = await this.isAiProcessingStatus();
    if (aiStatus) {
      this.isMicOpen = false;
      this.isAiProcessing = true;
      console.log('AI is still processing, please wait.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      console.log('MediaStream obtained:', stream);
      this.mediaStream = stream;
      this.activateMicService(); // ✅ Activate mic service
      this.isListening = true;
      this.monitorVolume(stream);
      this.startRecording(stream);
      this.detectSilenceDuringRecording(stream);

    } catch (err: any) {
      console.log('Microphone access denied or error obtaining media stream:', err);
      // alert('Microphone access is required to use voice features. Please enable mic permissions in your browser settings.');
      this.isMicOpen = false;
    }
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


    this.stopPlayback(); // Stop any AI audio playback if active
    this.cleanupAudio(); // Clean up AI audio context and streams

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
    const silenceThreshold = 30;
    const silenceDelay = 2000;

    let silenceTimer: any = null;

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
        if (!this.userStartedSpeaking) {
          this.userStartedSpeaking = true;
        }

        if (silenceTimer) {
          clearTimeout(silenceTimer);
          silenceTimer = null;
        }
      } else if (this.userStartedSpeaking) {
        if (!silenceTimer) {
          silenceTimer = setTimeout(() => {
            this.isMicOpen = false;
            this.isAiProcessing = true;
            this.userStartedSpeaking = false;
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


  private async sendAudioToBackend(blob: Blob) {

    const chat = await firstValueFrom(this.chatservice.selectedChat$);
    const aiStatus = await this.isAiProcessingStatus();
    if (aiStatus) {
      console.log('AI is still processing, please wait.');
      return;
    }

    const file = new File([blob], 'recording.webm', { type: 'audio/webm' });

    this.chatservice.uploadVoice(file, chat.id).subscribe({
      next: (res) => {
        console.log('Voice uploaded successfully:', res);
      },
      error: (err) => {
        console.error('Error uploading voice:', err);
      }
    });
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

  private async playWithInterruptDetection(wavBlob: Blob): Promise<void> {
    this.aiAudioContext = new AudioContext();
    await this.aiAudioContext.resume(); // Ensures playback works on Safari/mobile

    const analyser = this.aiAudioContext.createAnalyser();
    analyser.fftSize = 2048;
    const threshold = 30;

    try {
      this.aiUserStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      const micSource = this.aiAudioContext.createMediaStreamSource(this.aiUserStream);
      micSource.connect(analyser);

      const arrayBuffer = await wavBlob.arrayBuffer();
      const audioBuffer = await this.aiAudioContext.decodeAudioData(arrayBuffer);
      this.aiAudioSource = this.aiAudioContext.createBufferSource();
      this.aiAudioSource.buffer = audioBuffer;
      this.aiAudioSource.connect(this.aiAudioContext.destination);
      this.aiAudioSource.start();

      return new Promise((resolve) => {
        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        this.playbackInterruptInterval = setInterval(() => {
          analyser.getByteFrequencyData(dataArray);
          const avg = dataArray.reduce((sum, val) => sum + val, 0) / dataArray.length;
          if (avg > threshold) {
            console.log('User speaking — interrupting playback');
            this.stopPlayback();
          }
        }, 100);

        this.aiAudioSource!.onended = () => {
          this.cleanupAudio();
          resolve();
        };

      });
    }catch (err) {
      console.error("Failed to access microphone or play audio:", err);
      this.cleanupAudio();
      return;
    }
  }


  public stopPlayback(): void {
    if (this.aiAudioSource) {
      try {
        this.aiAudioSource.stop();
      } catch (e) {
        console.warn('Playback already stopped:', e);
      }
    }
  }


  public cleanupAudio(): void {
    if (this.playbackInterruptInterval) {
      clearInterval(this.playbackInterruptInterval);
      this.playbackInterruptInterval = null;
    }

    if (this.aiUserStream) {
      this.aiUserStream.getTracks().forEach(track => track.stop());
      this.aiUserStream = null;
    }

    if (this.aiAudioContext) {
      this.aiAudioContext.close();
      this.aiAudioContext = null;
    }

    this.aiAudioSource = null;
  }







}
