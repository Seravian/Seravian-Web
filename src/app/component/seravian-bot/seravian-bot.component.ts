import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { Chat } from '../../interfaces/chat';
import { ChatMessage } from '../../interfaces/chat-message';
import { ChangeDetectorRef } from '@angular/core';
import { filter, Subscription, take } from 'rxjs';
import { th } from 'intl-tel-input/i18n';
import { UnConfirmedClientMessages } from '../../interfaces/un-confirmed-client-messages';
import { Router } from '@angular/router';
import { VoiceService } from '../../services/voice.service';
import { MessageType } from '../../interfaces/message-type.enum';

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
  // message: ChatMessage | null = null;
  unConfirmedMessages: UnConfirmedClientMessages[] = [];
  // selectedChatMessages: ChatMessage[] = [];
  MessageType = MessageType;
  isAllowedToSendMessage:boolean = true;

  private chatSubscription!: Subscription;
  private missedMessagesSubscription!: Subscription;
  private mesaageSubscription!: Subscription;

  @ViewChild('chatBody') chatBodyRef!: ElementRef;
  @ViewChild('messageInput') messageInputRef!: ElementRef;

  constructor(
    private chatService: ChatService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private voiceService: VoiceService
  ) {}

  ngOnInit(): void {

    this.chatSubscription = this.chatService.selectedChat$.subscribe(chat => {
      console.log('Selected chat:', chat);
      if (!chat) return;

      if (this.oldSelectedChat == null || this.oldSelectedChat.id !== chat.id) {
        this.selectedChat = chat;
        this.oldSelectedChat = chat;

        // Wait for SignalR connection before joining
        this.chatService.connectionEstablished$
          .pipe(filter(isConnected => isConnected), take(1)) // wait for the first `true`
          .subscribe(() => {
            this.chatService.joinChat(chat.id)
              .then(() => {
                console.log(`1 Joined chat ${chat.id}`);
                this.cdr.detectChanges();
                setTimeout(() => {
                  this.scrollToBottom();
                  this.messageInputRef.nativeElement.focus();
                }, 50);
              })
              .catch(err => console.error('Failed to join chat', err));
          });
      } else {
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
          isAI: message.isAI,
          content: message.content,
          timestampUtc: message.timestampUtc,
          messageType: message.messageType
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

      console.log('is it same chat ? :', this.selectedChat?.id === data.chatId);

      if (this.selectedChat && this.selectedChat.id === data.chatId) {

        const currentMessages = this.chatService['messagesSubject'].value;
        const exists = currentMessages.some(msg => msg?.id === data.id);

        if (!exists) {
          this.selectedChat.messages.push({
            id: data.id,
            isAI: false,
            content: data.message,
            timestampUtc: data.timestampUtc,
            messageType: data.messageType
          });

          console.log('Received other user message', data);

          this.chatService.addMessage({
            id: data.id,
            isAI: false,
            content: data.message,
            timestampUtc: data.timestampUtc,
            messageType: data.messageType,
          });
        }

        if (!this.voiceService.getVoiceModeStatus()) {
          setTimeout(() => {
            this.scrollToBottom();
            this.messageInputRef.nativeElement.focus();
          }, 50);
        }
      }
    });

    // Listen to SignalR receive-ai-response
    this.chatService['hubConnection'].on('receive-ai-response', (data: any) => {

      if (this.selectedChat && this.selectedChat.id === data.chatId) {

        this.isAllowedToSendMessage = true;

        const currentMessages = this.chatService['messagesSubject'].value;
        const exists = currentMessages.some(msg => msg?.id === data.id);

        if (!exists) {
          this.selectedChat.messages.push({
            id: data.id,
            isAI: true,
            content: data.message,
            timestampUtc: data.timestampUtc,
            messageType: data.messageType
          });

          console.log('AI response message', data);

          this.chatService.addMessage({
            id: data.id,
            isAI: true,
            content: data.message,
            timestampUtc: data.timestampUtc,
            messageType: data.messageType,
          });
        }

        if (!this.voiceService.getVoiceModeStatus()) {
          setTimeout(() => {
            this.scrollToBottom();
            this.messageInputRef.nativeElement.focus();
          }, 50);
        }
      }
    });


    // Listen to SignalR confirm-client-request
    this.chatService['hubConnection'].on('confirm-client-request', (data: any) => {

      if (this.selectedChat && this.selectedChat.id === data.chatId) {

        const confirmedMessage = this.unConfirmedMessages.find(m => m.clientMessageId === data.clientMessageId);
        console.log('Unconfirmed message:', confirmedMessage);
        if (confirmedMessage) {
          this.unConfirmedMessages = []; // Clear unconfirmed messages after confirmation

          const currentMessages = this.chatService['messagesSubject'].value;
          const exists = currentMessages.some(msg => msg?.id === data.messageId);

          if (!exists) {
            this.selectedChat.messages.push({
              id: data.messageId,
              content: confirmedMessage.content,
              timestampUtc: data.timestampUtc,
              isAI: false,
              messageType: MessageType.Text
            });
            console.log('confirmed message', data);

            this.chatService.addMessage({
              id: data.messageId,
              content: confirmedMessage.content,
              timestampUtc: data.timestampUtc.toString(),
              isAI: false,
              messageType: MessageType.Text
            });
          }

          if (!this.voiceService.getVoiceModeStatus()) {
            setTimeout(() => {
              this.scrollToBottom();
              this.messageInputRef.nativeElement.focus();
            }, 50);
          }

          console.log('chat messages',this.selectedChat.messages);
        }
      }
    });

    this.chatService['hubConnection'].on('notify-ai-audio-response-ready', (data: any) => {
      console.log('AI finished responding for chat', data.chatId);
      this.isAllowedToSendMessage = true;
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
        timestampUtc: new Date(Date.now())
      });

      console.log('Unconfirmed messages timesatmp:', this.unConfirmedMessages[0].timestampUtc);

      this.chatService.sendClientRequest(message, messageClientId)
        .then(notAllowed => {
          this.isAllowedToSendMessage = notAllowed;
          console.log('am i allowed to send again ? :', this.isAllowedToSendMessage);

          // Use isSuccessful here (but only inside this .then block)
        })
        .catch(error => {
          console.error('Failed to send request', error);
        });


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

    // console.log('event triggered');

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

  isSelectecChatDeleted(): boolean {
    return this.chatService.isChatDeletedFlag();
  }

  isVoiceModeActivated():boolean{
    return this.voiceService.getVoiceModeStatus();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const targetElement = event.target as HTMLElement;
    if (!targetElement.closest('.popup-menu') && !targetElement.closest('#file-upload')) {
      this.isPopupVisible = false;
    }
  }

  // *************************************************
  // ************ًWHEN VOICE MODE ACTIVATED************
  // *************************************************

  isListening = false;
  transcript: string = '';
  private transcriptSub!: Subscription;
  volumeLevel = 0;


    activateVoiceMode(): void {
    if(this.selectedChat){
      console.log('Voice mode activated');
      this.voiceService.activateVoiceModeService();
      // Voice Mode
      this.voiceService.startListening();
      this.isListening = true;

      this.voiceService.volumeLevel$.subscribe(level => {
        this.volumeLevel = level;
      });

      this.transcriptSub = this.voiceService.transcript$.subscribe(text => {
        if (text) {
          this.transcript = text;
          this.isListening = false;
        }
      });

    }else{
      window.alert('please select a chat');
    }
  }

  deactivateVoiceMode(): void {
      console.log('Voice mode deactivated');
      this.isListening = false;
      this.transcript = '';
      this.voiceService.stopListening();
      this.transcriptSub.unsubscribe();
      this.voiceService.deactivateVoiceModeService();
      if (this.selectedChat) {
        setTimeout(() => {
          this.scrollToBottom();
          this.messageInputRef.nativeElement.focus();
        }, 50);
      }

  }


  getScale(): number {
    const minScale = 1;
    const maxScale = 2;
    const normalizedVolume = Math.min(this.volumeLevel / 100, 1); // Normalize to 0-1
    return minScale + normalizedVolume * (maxScale - minScale);
  }


}
