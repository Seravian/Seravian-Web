import { Chat } from './../interfaces/chat';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, map, Observable } from 'rxjs';
import * as signalR from '@microsoft/signalr';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ChatService {


  HubUrl: string = environment.HubUrl;
  ChatUrl: string = environment.ChatUrl;
  private callcounter = 0;

  // combine sidebar with messages
  private selectedChatSource = new BehaviorSubject<any>(null);
  selectedChat$ = this.selectedChatSource.asObservable();

  setSelectedChat(chat: Chat) {
    this.selectedChatSource.next(chat);
  }

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
      console.log('New client message received', data);
      // Handle client message broadcast
    });


    // Optional: AI response
    this.hubConnection.on('receive-ai-response', (data) => {
      console.log('AI response received', data);
      // Handle AI message
    });

    this.hubConnection.start()
      .then(() => {
        console.log('Connection started');
      })
      .catch(err => {
        console.error('Error while starting connection: ' + err)
        console.log('Retrying connection...');
        this.hubConnection.start()
      });
  }

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
  }

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

  // ────────────────────────────────────────────────
  // SIGNALR methods (ChatHub methods)
  // ────────────────────────────────────────────────

  joinChat(chatId: string): Promise<void> {
    return this.hubConnection.invoke('join-chat', { chatId });
  }

  sendClientRequest(message: string): Promise<void> {
    return this.hubConnection.invoke('send-client-request', { message });
  }


}
