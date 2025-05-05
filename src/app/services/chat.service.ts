// import { Chat } from './../interfaces/chat';
// import { Injectable } from '@angular/core';
// import { HttpClient, HttpParams } from '@angular/common/http';
// import { BehaviorSubject, map, Observable } from 'rxjs';
// import * as signalR from '@microsoft/signalr';
// import { AuthService } from './auth.service';
// import { environment } from '../../environments/environment.development';
// import { ConfirmClientRequestDto } from '../interfaces/confirm-client-request-dto';

// @Injectable({
//   providedIn: 'root'
// })
// export class ChatService {


//   HubUrl: string = environment.HubUrl;
//   ChatUrl: string = environment.ChatUrl;
//   private callcounter = 0;

//   // Add to top of the class
//   private messagesSubject = new BehaviorSubject<any[]>([]);
//   messages$ = this.messagesSubject.asObservable();

//   // Helper to add messages
//   private addMessage(message: any) {
//     const current = this.messagesSubject.value;
//     this.messagesSubject.next([...current, message]);
//   }

//   // combine sidebar with messages
//   private selectedChatSource = new BehaviorSubject<any>(null);
//   selectedChat$ = this.selectedChatSource.asObservable();

//   setSelectedChat(chat: Chat) {
//     this.selectedChatSource.next(chat);
//   }

//   // ***********************************************************************************

//   // signalR logic
//   private hubConnection: signalR.HubConnection;
//   constructor(private authservice: AuthService, private http: HttpClient) {
//     this.hubConnection = new signalR.HubConnectionBuilder()
//       .withUrl(this.HubUrl, {
//         accessTokenFactory: () => this.authservice.getTokenForSignalR() || '',
//         withCredentials: false })
//       .withAutomaticReconnect()
//       .build();

//     this.hubConnection.on('receive-client-request', (data) => {
//       console.log('Received other user message', data);
//       this.addMessage({
//         id: data.id,
//         content: data.message,
//         timestampUtc: data.timestampUtc,
//         isAI: false
//       });
//     });


//     this.hubConnection.on('confirm-client-request', (data:ConfirmClientRequestDto) => {
//       console.log('Confirmed client message', data);
//     });

//     this.hubConnection.on('receive-ai-response', (data) => {
//       console.log('AI responded', data);
//       this.addMessage({
//         id: data.id,
//         content: data.message,
//         timestampUtc: data.timestampUtc,
//         isAI: true
//       });
//     });




//     this.hubConnection.onreconnected(async(connectionId) => {
//       console.log('Reconnected to SignalR server');
//       const selectedChat = this.selectedChatSource.value;

//       if (selectedChat) {

//         console.log('10 seconds delay started before joining chat');
//         await new Promise(res => setTimeout(res, 15000)); // 15 seconds delay
//         console.log('10 seconds delay ended');


//         this.joinChat(selectedChat.id);


//         // Get the timestamp of the last known message (optional null check)
//         const messages = this.messagesSubject.value;
//         const lastMessage = messages[messages.length - 1];
//         const lastTimestamp = lastMessage?.timestampUtc || new Date(0).toISOString();

//         this.syncMessages(selectedChat.id, lastTimestamp).subscribe(
//           (missedMessages) => {
//             console.log('Synced missed messages:', missedMessages);
//             missedMessages.forEach((msg) => this.addMessage(msg));
//           },
//           (error) => {
//             console.error('Error syncing messages:', error);
//           }
//         );
//       }
//     });




//     this.hubConnection.start()
//       .then(() => {
//         console.log('Connection started');
//       })
//       .catch(err => {
//         console.error('Error while starting connection: ' + err)
//         console.log('Retrying connection...');
//         this.hubConnection.start()
//       });
//   }

//   createChat(title: string): Observable<any> {
//     return this.http.post<any>(`${this.ChatUrl}/create`, { title }).pipe(
//       map((response) => response)
//     );
//   }

//   updateChat(chatId: string, title: string): Observable<any> {
//     return this.http
//       .put<any>(`${this.ChatUrl}/update`, { id: chatId, title })
//       .pipe(map((response) => response));
//   }

//   deleteChat(chatId: string): Observable<void> {
//     return this.http.delete<void>(`${this.ChatUrl}/delete`, {
//       body: { id: chatId },
//     });
//   }

//   getChats(): Observable<any[]> {
//     return this.http.get<any[]>(`${this.ChatUrl}/get-chats`).pipe(
//       map((response) => response)
//     );
//   }

//   getChatMessages(chatId: string): Observable<any> {
//     const params = new HttpParams().set('id', chatId);
//     return this.http
//       .get<any>(`${this.ChatUrl}/get-chat-messages`, { params })
//       .pipe(map((response) => response));
//   }




//   // **************************************************************************
//   // sync-messages ************************************************************
//   // **************************************************************************

//   syncMessages(chatId: string, lastMessageTimestampUtc: string): Observable<any[]> {
//     const params = new HttpParams()
//       .set('chatId', chatId)
//       .set('lastMessageTimestampUtc', lastMessageTimestampUtc);

//     return this.http
//       .get<any[]>(`${this.ChatUrl}/sync-messages`, { params })
//       .pipe(map((response) => response));
//   }


//   // ────────────────────────────────────────────────
//   // SIGNALR methods (ChatHub methods)
//   // ────────────────────────────────────────────────

//   joinChat(chatId: string): Promise<void> {
//     return this.hubConnection.invoke('join-chat', { chatId });
//   }


//   sendClientRequest(message: string, messageClientId: string): Promise<void> {
//     return this.hubConnection.invoke('send-client-request', {
//       message,
//       messageClientId
//     });
//   }


// }






import { Chat } from './../interfaces/chat';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, map, Observable } from 'rxjs';
import * as signalR from '@microsoft/signalr';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment.development';
import { ConfirmClientRequestDto } from '../interfaces/confirm-client-request-dto';

@Injectable({
  providedIn: 'root'
})
export class ChatService {


  HubUrl: string = environment.HubUrl;
  ChatUrl: string = environment.ChatUrl;
  private callcounter = 0;

  // Add to top of the class
  private messagesSubject = new BehaviorSubject<any[]>([]);
  messages$ = this.messagesSubject.asObservable();

  // Helper to add messages
  private addMessage(message: any) {
    const current = this.messagesSubject.value;
    this.messagesSubject.next([...current, message]);
  }

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
      console.log('Received other user message', data);
      this.addMessage({
        id: data.id,
        content: data.message,
        timestampUtc: data.timestampUtc,
        isAI: false
      });
    });


    this.hubConnection.on('confirm-client-request', (data:ConfirmClientRequestDto) => {
      console.log('Confirmed client message', data);
    });

    this.hubConnection.on('receive-ai-response', (data) => {
      console.log('AI responded', data);
      this.addMessage({
        id: data.id,
        content: data.message,
        timestampUtc: data.timestampUtc,
        isAI: true
      });
    });

    this.hubConnection.onreconnected(async(connectionId) => {
      console.log('Reconnected to SignalR server');
      const selectedChat = this.selectedChatSource.value;

      if (selectedChat) {

        // console.log('15 seconds delay started before joining chat');
        // await new Promise(res => setTimeout(res, 15000)); // 15 seconds delay
        // console.log('15 seconds delay ended');

        this.joinChat(selectedChat.id);

        // Get the timestamp of the last known message (optional null check)
        const messages = this.messagesSubject.value;
        console.log('Messages:', messages);
        const lastMessage = messages[messages.length - 1];
        console.log('Last message:', lastMessage);
        const lastTimestamp = lastMessage?.timestampUtc || new Date(0).toISOString();
        console.log('Last timestamp:', lastTimestamp);

        // this.syncMessages(selectedChat.id, lastTimestamp).subscribe({
        //   next: (missedMessages) => {
        //     console.log('Synced missed messages:', missedMessages);
        //     missedMessages.forEach((msg) => this.addMessage(msg));
        //   },
        //   error: (error) => {
        //     console.error('Error syncing messages:', error);
        //   }
        // });
      }
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

  syncMessages(chatId: string, lastMessageTimestampUtc: string): Observable<any[]> {
    const params = new HttpParams()
      .set('chatId', chatId)
      .set('lastMessageTimestampUtc', lastMessageTimestampUtc);

    return this.http
      .get<any[]>(`${this.ChatUrl}/sync-messages`, { params })
      .pipe(map((response) => response));
  }


  // ────────────────────────────────────────────────
  // SIGNALR methods (ChatHub methods)
  // ────────────────────────────────────────────────

  joinChat(chatId: string): Promise<void> {
    return this.hubConnection.invoke('join-chat', { chatId });
  }


  sendClientRequest(message: string, messageClientId: string): Promise<void> {
    return this.hubConnection.invoke('send-client-request', {
      message,
      messageClientId
    });
  }


}






