import { MessageType } from '../interfaces/message-type.enum';

import { Chat } from './../interfaces/chat';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, map, Observable } from 'rxjs';
import * as signalR from '@microsoft/signalr';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment.development';
import { ConfirmClientRequestDto } from '../interfaces/confirm-client-request-dto';
import { ChatMessage } from '../interfaces/chat-message';

@Injectable({
  providedIn: 'root'
})
export class ChatService {


  HubUrl: string = environment.HubUrl;
  ChatUrl: string = environment.ChatUrl;

  // Add to top of the class
  private messagesSubject = new BehaviorSubject<any[]>([]);
  messages$ = this.messagesSubject.asObservable();

  // Helper to add messages
  addMessage(message: any) {
    if (message == null) {console.log('selected chat changed, cleaning Messages');}
    console.log('Adding message:', message);
    const current = this.messagesSubject.value;
    this.messagesSubject.next([...current, message]);
  }


  // combine sidebar with messages


  private missedMessagesSource = new BehaviorSubject<any[]>([]);
  missedMessages$ = this.missedMessagesSource.asObservable();

  setMissedMessages(messages: ChatMessage[] | null) {
  if (!Array.isArray(messages)) {
    console.warn('Expected an array in setMissedMessages, received:', messages);
    return;
  }
  this.missedMessagesSource.next(messages);
}


  private connectionEstablishedSource = new BehaviorSubject<boolean>(false);
  public connectionEstablished$ = this.connectionEstablishedSource.asObservable();

  // ***********************************************************************************

  // signalR logic
  private hubConnection: signalR.HubConnection;
  constructor(private authservice: AuthService, private http: HttpClient) {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(this.HubUrl, {
        accessTokenFactory: () => this.authservice.getTokenForSignalR() || '',
        withCredentials: false })
      .withAutomaticReconnect()
      .build();

    this.hubConnection.on('receive-client-request', (data) => {
      console.log('Received other user message', data);
      this.addMessage({
        id: data.id,
        content: data.message,
        timestampUtc: new Date(data.timestampUtc).toLocaleString(),
        isAI: false,
        messageType: data.messageType
      });
    });


    this.hubConnection.on('receive-ai-response', (data) => {
      console.log('AI responded', data);
      this.addMessage({
        id: data.id,
        content: data.message,
        timestampUtc: new Date(data.timestampUtc).toLocaleString(),
        isAI: true,
        messageType: data.messageType
      });
    });


    this.hubConnection.on('confirm-client-request', (data:ConfirmClientRequestDto) => {
      console.log('Confirmed client message', data);
    });

    this.hubConnection.on('notify-ai-audio-response-ready', (data: { aiAudioId: number; chatId: string }) => {
      console.log('Notification AI audio response ready:', data);

      console.log('ID of the AI audio:', data.aiAudioId);

      this.downloadAIAudio(+data.aiAudioId).subscribe({
        next: (blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `ai-response-${data.aiAudioId}.wav`;
          a.click();
          window.URL.revokeObjectURL(url);
        },
        error: (err) => {
          console.error('Error downloading AI audio', err);
        }
      });

    });


    this.hubConnection.onreconnected(async(connectionId) => {
      console.log('Reconnected to SignalR server');
      const selectedChat = this.selectedChatSource.value;

      if (selectedChat) {

        const delayEnabled = sessionStorage.getItem('delayReconnection') === 'true';

        if (delayEnabled) {
          console.log('25 seconds delay started before joining chat');
          await new Promise(res => setTimeout(res, 25000));
          console.log('25 seconds delay ended');
        }

        this.joinChat(selectedChat.id);

        // Get the timestamp of the last known message (optional null check)
        const messages = this.messagesSubject.value;
        const lastMessage = messages[messages.length - 1];
        console.log('Last message in chat service:', lastMessage);
        const lastTimestamp = lastMessage?.timestampUtc || new Date(0).toString();
        console.log('Last timestamp in chat service:', lastTimestamp);

        if (messages.length==0||lastMessage==null){
          console.log('not today no last message')
        }else{
          this.syncMessages(selectedChat.id, lastTimestamp).subscribe({
            next:(missedMessages) => {
              console.log('Synced missed messages:', missedMessages);
              // missedMessages.forEach((msg) => this.setMissedMessages(msg)); //one at a time
              this.setMissedMessages(missedMessages); //all at once
            },
            error:(error) => {
              console.error('Error syncing messages:', error);
            }
          });
        }

      }
    });


    this.hubConnection.start()
      .then(() => {
        console.log('Connection started');
        this.connectionEstablishedSource.next(true); // Mark as connected
      })
      .catch(err => {
        console.error('Error while starting connection: ' + err)
        console.log('Retrying connection...');
        // this.hubConnection.start()
        this.hubConnection.start().then(() => this.connectionEstablishedSource.next(true));
      });

    this.setChats();
  }

  // ────────────────────────────────────────────────
  // SIGNALR methods (ChatHub methods)
  // ────────────────────────────────────────────────

  joinChat(chatId: string): Promise<void> {
    return this.hubConnection.invoke('join-chat', { chatId });
  }


  sendClientRequest(message: string, messageClientId: string): Promise<void> {
    console.log('Sending client request:', message, messageClientId);
    return this.hubConnection.invoke('send-client-request', {
      message,
      messageClientId
    });
  }



  syncMessages(chatId: string, lastMessageTimestampUtc: string): Observable<any[]> {
    const params = new HttpParams()
      .set('chatId', chatId)
      .set('lastMessageTimestampUtc', lastMessageTimestampUtc);

    return this.http
      .get<any[]>(`${this.ChatUrl}/sync-messages`, { params })
      .pipe(map((response) => response));
  }

  // ***********************************************************************************

  createChat(title: string): Observable<any> {
    return this.http.post<any>(`${this.ChatUrl}/create`, { title }).pipe(
      map((response) => response)
    );
  }

  updateChat(chatId: string, title: string): Observable<any> {
    return this.http
      .put<any>(`${this.ChatUrl}/update`, { id: chatId, title })
      .pipe(map((response) => response));
  }

  deleteChat(chatId: string): Observable<void> {
    return this.http.delete<void>(`${this.ChatUrl}/delete`, {
      body: { id: chatId },
    });
  };


  getChats(): Observable<any[]> {
    return this.http.get<any[]>(`${this.ChatUrl}/get-chats`).pipe(
      map((response) => response)
    );
  }

  getChatMessages(chatId: string): Observable<any> {
    const params = new HttpParams().set('id', chatId);
    return this.http
      .get<any>(`${this.ChatUrl}/get-chat-messages`, { params })
      .pipe(map((response) => response));
  }

  uploadVoice(voiceFile: File, chatId: string): Observable<any> {
    const formData = new FormData();
    formData.append('voiceFile', voiceFile);
    formData.append('chatId', chatId);

    return this.http.post<any>(`${this.ChatUrl}/voice-mode-upload-user-voice`, formData).pipe(
      map((response) => response)
    );
  }

  downloadAIAudio(aIaudioId: number): Observable<Blob> {
    const params = new HttpParams().set('aIAudioId', aIaudioId);
    const url = `${this.ChatUrl}/voice-mode-download-ai-voice`;

    return this.http.get(url, { params, responseType: 'blob' });
  }



// **********************************************************************************

  private chats: Chat[] = [];


  setChats():void{
    this.getChats().subscribe({
      next: (chats) => {
        this.chats = chats;
        this.setSelectedChat();
      },
      error: (err) => {
        console.error('Failed to load chats:', err);
      }
    });
  }

  private selectedChatSource = new BehaviorSubject<any>(null);
  selectedChat$ = this.selectedChatSource.asObservable();

  setSelectedChat() {
    const chatId = sessionStorage.getItem('chatId');

    if (chatId) {
      this.getChatMessages(chatId).subscribe({
        next: (chatMessages:Chat) => {
          const selectedChat = this.chats.find(chat => chat.id === chatId);
          if (selectedChat) {
            console.log('Loged Messages:', chatMessages.messages??[]);
            selectedChat.messages = chatMessages.messages??[];
            this.selectedChatSource.next(selectedChat);
          }
        },
        error: (err) => {
          console.error('Failed to load chat messages:', err);
        }
      });
    }else{
      console.log('No chat selected yet to set selected chat');
    }
  }


}






