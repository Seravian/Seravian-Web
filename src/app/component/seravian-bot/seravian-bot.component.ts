import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { Chat } from '../../interfaces/chat';
import { ChatMessage } from '../../interfaces/chat-message';
import { ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-seravian-bot',
  templateUrl: './seravian-bot.component.html',
  styleUrls: ['./seravian-bot.component.css']
})

export class SeravianBotComponent implements OnInit, OnDestroy {

  isPopupVisible = false;
  selectedChat: Chat | null = null;
  userMessage: string = '';
  message: ChatMessage | null = null;

  private chatSubscription!: Subscription;

  @ViewChild('chatBody') chatBodyRef!: ElementRef;
  @ViewChild('messageInput') messageInputRef!: ElementRef;

  constructor(
    private chatService: ChatService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // this.chatSubscription = this.chatService.selectedChat$.subscribe(chat => {
    //   this.selectedChat = chat;
    //   if (chat) {
    //     this.chatService.joinChat(chat.id)
    //       .then(() => console.log(`Joined chat ${chat.id}`))
    //       .catch(err => console.error('Failed to join chat', err));
    //   }
    //   this.cdr.detectChanges();
    //   setTimeout(() => {
    //     this.scrollToBottom();
    //     this.messageInputRef.nativeElement.focus();
    //   }, 50);
    // });

    this.chatSubscription = this.chatService.selectedChat$.subscribe(chat => {
      this.selectedChat = chat;

      if (chat) {
        this.chatService.joinChat(chat.id)
          .then(() => {
            console.log(`Joined chat ${chat.id}`);

            // Get the last message timestamp
            const lastMessage = chat.messages?.[chat.messages.length - 1];
            const lastTimestamp = lastMessage?.timestampUtc || new Date(0).toISOString();

            // Sync missed messages
            // this.chatService.syncMessages(chat.id, lastTimestamp).subscribe({
            //   next:(missedMessages) => {
            //     console.log('Synced messages in component:', missedMessages);
            //     chat.messages.push(...missedMessages);
            //     this.scrollToBottom();
            //     this.cdr.detectChanges();
            //   },
            //   error:(error) => {
            //     console.error('Failed to sync messages:', error);
            //   }
            // });
          })
          .catch(err => console.error('Failed to join chat', err));
      }

      this.cdr.detectChanges();

      setTimeout(() => {
        this.scrollToBottom();
        this.messageInputRef.nativeElement.focus();
      }, 50);
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

  sendMessage(): void {
    const message = this.userMessage.trim();
    if (message && this.selectedChat) {
      const messageClientId = this.generateGuid(); // <-- generate .NET-compatible Guid

      // Optimistic UI update
      this.selectedChat.messages.push({
        clientMessageId: messageClientId,
        id: null,
        isAI: false,
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


  ngOnDestroy(): void {
    this.chatSubscription?.unsubscribe();
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

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const targetElement = event.target as HTMLElement;
    if (!targetElement.closest('.popup-menu') && !targetElement.closest('#file-upload')) {
      this.isPopupVisible = false;
    }
  }
}
