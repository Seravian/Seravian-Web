import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as signalR from '@microsoft/signalr';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {


  private selectedChatSource = new BehaviorSubject<any>(null);
  selectedChat$ = this.selectedChatSource.asObservable();

  setSelectedChat(chat: any) {
    this.selectedChatSource.next(chat);
  }


  // private hubConnection: signalR.HubConnection;
  // constructor(private authservice : AuthService) {
  //   this.hubConnection = new signalR.HubConnectionBuilder()
  //     .withUrl('/seravianbot', { accessTokenFactory: () => this.authservice.getTokenForSignalR()|| '' })
  //     .build();
  //   this.hubConnection.on('ReceiveMessage', (user, message) => {
  //     console.log(`User: ${user}, Message: ${message}`);
  //   });
  //   this.hubConnection.start()
  //     .then(() => {
  //       console.log('Connection started');
  //     })
  //     .catch(err => console.error('Error while starting connection: ' + err));

  // }
  // sendMessage(user: string, message: string): void {
  //   this.hubConnection.invoke('SendMessage', user, message)
  //     .catch(err => console.error(err));
  // }
}
