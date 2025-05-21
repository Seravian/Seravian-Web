import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { Chat } from '../../interfaces/chat';
import { ChatMessage } from '../../interfaces/chat-message';
import { ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { th } from 'intl-tel-input/i18n';
import { UnConfirmedClientMessages } from '../../interfaces/un-confirmed-client-messages';
import { Router } from '@angular/router';

@Component({
  selector: 'app-seravian-bot',
  templateUrl: './seravian-bot.component.html',
  styleUrls: ['./seravian-bot.component.css']
})

export class SeravianBotComponent implements OnInit, OnDestroy {

  isPopupVisible = false;
  selectedChat: Chat | null = null;
  oldSelectedChat: Chat | null = null;
  userMessage: string = '';
  message: ChatMessage | null = null;
  unConfirmedMessages: UnConfirmedClientMessages[] = [];

  private chatSubscription!: Subscription;
  private missedMessagesSubscription!: Subscription;

  @ViewChild('chatBody') chatBodyRef!: ElementRef;
  @ViewChild('messageInput') messageInputRef!: ElementRef;

  constructor(
    private chatService: ChatService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {

    this.chatSubscription = this.chatService.selectedChat$.subscribe(chat => {

      if(this.oldSelectedChat == null || this.oldSelectedChat.id !== chat.id){ //first time selected or new chat selected

        this.selectedChat = chat;
        this.oldSelectedChat = chat;

        if (chat) {
          this.chatService.joinChat(chat.id)
            .then(() => {
              console.log(`1 Joined chat ${chat.id}`);

              // Get the last message from the selected chat
              if (chat.messages && chat.messages.length > 0) {
                const lastMessage = chat.messages[chat.messages.length - 1];
                this.chatService.addMessage(lastMessage);
                console.log('added message:', lastMessage);
              }else{
                console.log('No messages in the selected chat yet.');
              }

            })
            .catch(err => console.error('Failed to join chat', err));

          this.cdr.detectChanges();
          setTimeout(() => {
            this.scrollToBottom();
            this.messageInputRef.nativeElement.focus();
          }, 50);

        }

      }else{
        console.log('Same chat selected, no action taken.');
      }

    });


    // One-time missed messages sync
    this.missedMessagesSubscription = this.chatService.missedMessages$.subscribe((missedMessages: ChatMessage[]) => {
      console.log('Missed messages number:', missedMessages.length);
      console.log('Missed messages:', missedMessages);
      if (missedMessages.length > 0 && this.selectedChat) {
        console.log('Missed messages:', missedMessages);
        this.selectedChat.messages.push(...missedMessages.map((message: ChatMessage) => ({
          id: message.id,
          isAI: false,
          content: message.content,
          timestampUtc: message.timestampUtc
        })));

        // Clear missed messages after syncing
        this.chatService.setMissedMessages([]);
        console.log('Missed messages synced and cleared.');

        setTimeout(() => {
          this.scrollToBottom();
          this.messageInputRef.nativeElement.focus();
        }, 50);
      }else{
      }
    });


    // Listen to SignalR receive-client-request
    this.chatService['hubConnection'].on('receive-client-request', (data: any) => {
      if (this.selectedChat) {
        this.selectedChat.messages.push({
          id: data.id,
          isAI: false,
          content: data.message,
          timestampUtc: data.timestampUtc
        });
        setTimeout(() => {
          this.scrollToBottom();
          this.messageInputRef.nativeElement.focus();
        }, 50);
      }
    });

    // Listen to SignalR receive-ai-response
    this.chatService['hubConnection'].on('receive-ai-response', (data: any) => {
      if (this.selectedChat) {
        this.selectedChat.messages.push({
          id: data.id,
          isAI: true,
          content: data.message,
          timestampUtc: data.timestampUtc
        });
        setTimeout(() => {
          this.scrollToBottom();
          this.messageInputRef.nativeElement.focus();
        }, 50);
      }
    });


    // Listen to SignalR confirm-client-request
    this.chatService['hubConnection'].on('confirm-client-request', (data: any) => {
      if (this.selectedChat) {
        const confirmedMessage = this.unConfirmedMessages.find(m => m.clientMessageId === data.clientMessageId);
        console.log('Confirmed message:', confirmedMessage);
        if (confirmedMessage) {
          // Optimistic UI update
          this.selectedChat.messages.push({
            id: data.messageId,
            content: confirmedMessage.content,
            timestampUtc: data.timestampUtc,
            isAI: false
          });
          setTimeout(() => {
            this.scrollToBottom();
            this.messageInputRef.nativeElement.focus();
          }, 50);

          console.log('chat messages',this.selectedChat.messages);
        }
      }
    });


  }

  sendMessage(): void {
    const message = this.userMessage.trim();
    if (message && this.selectedChat) {
      const messageClientId = this.generateGuid(); // <-- generate .NET-compatible Guid

      // Optimistic UI update
      this.unConfirmedMessages.push({
        clientMessageId: messageClientId,
        content: message,
        timestampUtc: new Date()
      });

      this.chatService.sendClientRequest(message, messageClientId)
        .catch(err => console.error('SignalR send failed', err));


      this.userMessage = '';

      setTimeout(() => {
        this.scrollToBottom();
        this.messageInputRef.nativeElement.focus();
      }, 50);
    }
  }

  private generateGuid(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  get messages() {
    return this.selectedChat?.messages ?? [];
  }




  ngOnDestroy(): void {
    this.chatSubscription?.unsubscribe();
    this.missedMessagesSubscription?.unsubscribe();
    this.chatService.setMissedMessages([]); // Clear missed messages on destroy
  }

// **********************************************
// ***************UI Features********************
// **********************************************

  scrollToBottom(): void {
    try {
      this.chatBodyRef.nativeElement.scrollTop = this.chatBodyRef.nativeElement.scrollHeight;
    } catch (err) {
      console.warn('Failed to scroll:', err);
    }
  }

  handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  adjustTextareaHeight(textarea: HTMLTextAreaElement): void {
    textarea.style.height = 'auto';
    const lineHeight = parseInt(window.getComputedStyle(textarea).lineHeight, 10);
    const maxHeight = 120;
    if (textarea.scrollHeight > lineHeight) {
      textarea.style.height = Math.min(textarea.scrollHeight, maxHeight) + 'px';
    } else {
      textarea.style.height = '47px';
    }
  }

  trackByMessageId(index: number, message: ChatMessage) {
    return message.id ?? index;
  }

  togglePopup(): void {
    this.isPopupVisible = !this.isPopupVisible;
  }

  selectOption(option: string): void {
    console.log(`Selected option: ${option}`);
    this.isPopupVisible = false;
  }

  handleButtonClick(event: Event): void {

    console.log('event triggered');

    const button = (event.currentTarget as HTMLElement);
    button.classList.add('hide-tooltip');

    // Remove the class after a short delay to re-enable tooltip later
    setTimeout(() => {
      button.classList.remove('hide-tooltip');
    }, 5000); // Adjust delay if needed
  }


  hasText(): boolean {
    return this.userMessage.trim().length > 0;
  }

  activateVoiceMode(): void {
    if(this.selectedChat){
      console.log('Voice mode activated');
      this.router.navigate(['/voice-mode']);
    }else{
      window.alert('please select a chat');
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const targetElement = event.target as HTMLElement;
    if (!targetElement.closest('.popup-menu') && !targetElement.closest('#file-upload')) {
      this.isPopupVisible = false;
    }
  }
}
