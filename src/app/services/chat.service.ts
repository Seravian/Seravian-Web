import { MessageType } from '../interfaces/message-type.enum';

import { Chat } from './../interfaces/chat';
import { Injectable, Injector } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, map, Observable } from 'rxjs';
import * as signalR from '@microsoft/signalr';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment.development';
import { ConfirmClientRequestDto } from '../interfaces/confirm-client-request-dto';
import { ChatMessage } from '../interfaces/chat-message';
import { VoiceService } from './voice.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {


  HubUrl: string = environment.HubUrl;
  ChatUrl: string = environment.ChatUrl;

  private voiceServiceInstance?: VoiceService;
  private messageType = MessageType;

  private isChatDeleted = false; // Flag to track if the chat is deleted

  deleteChatFlag(): void {
    this.isChatDeleted = true;
    console.log('Chat deleted flag set to true');
    this.selectedChatSource.next(null);
  }

  unDeleteChatFlag(): void {
    this.isChatDeleted = false;
    console.log('Chat deleted flag set to false');
  }

  isChatDeletedFlag(): boolean {
    return this.isChatDeleted;
  }

  // Add to top of the class
  private messagesSubject = new BehaviorSubject<any[]>([]);
  messages$ = this.messagesSubject.asObservable();

  // Helper to add messages
  addMessage(message: ChatMessage) {

    const current = this.messagesSubject.value;

    if (this.messagesSubject.value.length < 10) {
      console.log('Adding message:', message);
      console.log('Old messages:', current);
      this.messagesSubject.next([...current, message]);
      console.log('Updated messages:', this.messagesSubject.value);
    }else{
    console.log('Adding message:', message);
    console.log('Old messages:', current);
    this.messagesSubject.next([message]);
    console.log('Updated messages:', this.messagesSubject.value);
    }
  }


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
  constructor(
    private authservice: AuthService,
    private http: HttpClient,
    private injector: Injector
  ) {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(this.HubUrl, {
        accessTokenFactory: () => this.authservice.getTokenForSignalR() || '',
        withCredentials: false })
      .withAutomaticReconnect()
      .build();

    // this.hubConnection.on('notify-ai-audio-response-ready', (data: { aiAudioId: number; chatId: string }) => {
    //   console.log('Notification AI audio response ready:', data);

    //   console.log('ID of the AI audio:', data.aiAudioId);

    //   this.downloadAIAudio(+data.aiAudioId).subscribe({
    //     next: (blob) => {
    //       const url = window.URL.createObjectURL(blob);
    //       const a = document.createElement('a');
    //       a.href = url;
    //       a.download = `ai-response-${data.aiAudioId}.wav`;
    //       a.click();
    //       window.URL.revokeObjectURL(url);
    //     },
    //     error: (err) => {
    //       console.error('Error downloading AI audio', err);
    //     }
    //   });

    // });


    this.hubConnection.onreconnected(async(connectionId) => {
      console.log('Reconnected to SignalR server');
      const selectedChat = this.selectedChatSource.value;

      if (selectedChat) {

        const delayEnabled = sessionStorage.getItem('delayReconnection') === 'true';

        if (delayEnabled) {
          console.log('30 seconds delay started before joining chat');
          await new Promise(res => setTimeout(res, 30000));
          console.log('30 seconds delay ended');
        }

        this.joinChat(selectedChat.id);

        const messages = this.messagesSubject.value;
        console.log('all Messages in chat service:', messages);
        const lastMessage = messages[messages.length - 1];
        console.log('Last message in chat service:', lastMessage);
        const lastMessageId = lastMessage?.id || null;
        console.log('Last message ID in chat service:', lastMessageId);


        this.syncMessages(selectedChat.id, lastMessageId).subscribe({
          next:(missedMessages:ChatMessage[]) => {
            console.log('Synced missed messages in onreconnected:', missedMessages);

            const existingIds = this.messagesSubject.value.map(msg => msg?.id);
            console.log('Existing message IDs:', existingIds);
            const newMessages = missedMessages.filter(msg => !existingIds.includes(msg.id));

            this.setMissedMessages(newMessages); //all at once
            newMessages.forEach((msg) => this.addMessage(msg)); //add one by one

            const lastMissedMessage = missedMessages[missedMessages.length - 1];
            const lastMissedMessageType = lastMissedMessage?.messageType;

            if (this.voiceService.getVoiceModeStatus()&& lastMissedMessage && lastMissedMessageType === this.messageType.VoiceModeText) {
              // this.downloadAIAudio(lastMissedMessage.id).subscribe({
              //   next: (blob) => {
              //     const url = window.URL.createObjectURL(blob);
              //     const a = document.createElement('a');
              //     a.href = url;
              //     a.download = `ai-response-${lastMissedMessage.id}.wav`;
              //     a.click();
              //     window.URL.revokeObjectURL(url);
              //   },
              //   error: (err) => {
              //     console.error('Error downloading AI audio', err);
              //   }
              // });
              this.voiceService.playAiAudio(lastMissedMessage.id);
            }

          },
          error:(error) => {
            console.error('Error syncing messages:', error);
          }
        });
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

  private get voiceService(): VoiceService {
    if (!this.voiceServiceInstance) {
      this.voiceServiceInstance = this.injector.get(VoiceService);
    }
    return this.voiceServiceInstance;
  }

  // ────────────────────────────────────────────────
  // SIGNALR methods (ChatHub methods)
  // ────────────────────────────────────────────────

  joinChat(chatId: string): Promise<void> {
    return this.hubConnection.invoke('join-chat', { chatId });
  }


  sendClientRequest(message: string, messageClientId: string): Promise<boolean> {
    console.log('Sending client request:', message, messageClientId);
    return this.hubConnection.invoke<boolean>('send-client-request', {
      message,
      messageClientId
    });
  }



  syncMessages(chatId: string, lastMessageId: number | null): Observable<any[]> {
    let params = new HttpParams().set('chatId', chatId);

    if (lastMessageId !== null) {
      params = params.set('lastMessageId', lastMessageId);
    }

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
            selectedChat.messages = chatMessages.messages??[];
            console.log('chat Messages in chat service:', selectedChat.messages);
            this.selectedChatSource.next(selectedChat);

            if (selectedChat.messages.length > 0) {
              const lastMessage = selectedChat.messages[(selectedChat.messages.length) - 1];
              this.addMessage(lastMessage);
              console.log('added last message in this chat (chat service):', lastMessage);
            } else {
              console.log('No messages in the selected chat yet.');
            }

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






