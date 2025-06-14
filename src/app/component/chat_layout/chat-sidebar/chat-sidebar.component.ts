import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ChatService } from '../../../services/chat.service';
import { Chat } from '../../../interfaces/chat';
import { ChatMessage } from '../../../interfaces/chat-message';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { VoiceService } from '../../../services/voice.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-chat-sidebar',
  templateUrl: './chat-sidebar.component.html',
  styleUrls: ['./chat-sidebar.component.css']
})
export class ChatSidebarComponent implements OnInit,OnDestroy {
  isSidebarOpen = true;
  mobileBreakpoint = 500;
  isSearchOpen = false;
  selectedChatId: string | null = null;
  sessionChatId: string | null = null;
  dropdownVisible: string | null = null;
  showConfirmModal = false;
  chatToDeleteId: string | null = null;

  constructor(
    private chatService: ChatService ,
    private voiceService: VoiceService,
    private router: Router
  ) {}

  private currentUrl: string = '';

  chats: Chat[] = [];

  ngOnInit(): void {
    // UI Feature
    this.checkWindowWidth(); // Check at start
    window.addEventListener('resize', this.checkWindowWidth.bind(this));
    // **************************************************************************

    this.chatService.getChats().subscribe({
      next: (chats) => {
        this.chats = chats;
      },
      error: (err) => {
        console.error('Failed to load chats:', err);
      }
    });

    this.sessionChatId = sessionStorage.getItem('chatId');

    // Track URL changes
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.currentUrl = event.urlAfterRedirects;
      });

    // Handle tab close or refresh
    window.addEventListener('beforeunload', this.handleUnload);
    document.addEventListener('visibilitychange', this.handleVisibilityChange);

  }

  private handleUnload = (event: BeforeUnloadEvent) => {
    const isChatPage = window.location.pathname.includes('chatbot');
    const isDiagnosesPage = window.location.pathname.includes('diagnosis-list');
    if (!isChatPage||!isDiagnosesPage) {
      // this.cleanupSession();
    }
  };

  private handleVisibilityChange = () => {
    const isChatPage = window.location.pathname.includes('/chatbot');
    const isDiagnosesPage = window.location.pathname.includes('/diagnosis-list');
    if ((document.visibilityState === 'hidden') && (!isChatPage||!isDiagnosesPage)) {
      // this.cleanupSession();
    }
  };


  private cleanupSession(): void {
    sessionStorage.removeItem('chatId');
    this.sessionChatId = null;
    console.log('Chat session cleaned up (route/tab close).');
  }


  selectChat(chatId: string) {

    this.selectedChatId = chatId;
    this.sessionChatId = chatId; // <-- Add this line
    console.log('Selected chat ID:', chatId);
    sessionStorage.setItem('chatId',chatId);

    // this.chatService.addMessage(null);
    this.chatService.setChats();
    // this.chatService.setSelectedChat();
    this.chatService.unDeleteChatFlag();
  }


  @ViewChild('inputField') inputField: ElementRef | undefined;

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  onSearchClick() {
    this.isSearchOpen = !this.isSearchOpen;
  }


  createNewChat() {
    this.chatService.createChat('New Chat').subscribe({
      next: (chat) => {
        this.chats.unshift({ ...chat, isEditing: false, messages: [] });
        this.selectedChatId = chat.id;
        this.sessionChatId = chat.id; // <-- Add this line
        console.log('Selected chat ID:', chat.id);
        sessionStorage.setItem('chatId',chat.id);
        this.chatService.setChats();
        this.chatService.unDeleteChatFlag();
      },
      error: (err) => {
        console.error('Failed to create chat:', err);
      }
    });
  }


  startRename(chat: any) {
    chat.isEditing = true;
    this.dropdownVisible = null;

    // Delay focus until after view updates
    setTimeout(() => {
      this.inputField?.nativeElement.focus();
    }, 100); // try 100ms instead of 0
  }



  renameChat(chat: Chat) {
    if (!chat.title.trim()) return;

    this.chatService.updateChat(chat.id, chat.title).subscribe({
      next: () => {
        chat.isEditing = false;
      },
      error: (err) => {
        console.error('Failed to rename chat:', err);
      }
    });
  }


  promptDelete(id: string) {
    this.chatToDeleteId = id;
    this.showConfirmModal = true;
    this.dropdownVisible = null;
  }

  confirmDelete() {
    if (this.chatToDeleteId) {
      this.chatService.deleteChat(this.chatToDeleteId).subscribe({
        next: () => {
          this.chats = this.chats.filter(c => c.id !== this.chatToDeleteId);
          if (this.selectedChatId === this.chatToDeleteId) this.selectedChatId = null;
          this.chatToDeleteId = null;
          this.showConfirmModal = false;
          this.cleanupSession();
          this.chatService.deleteChatFlag();
        },
        error: (err) => {
          console.error('Failed to delete chat:', err);
          this.showConfirmModal = false;
        }
      });
    }
  }


  cancelDelete() {
    this.chatToDeleteId = null;
    this.showConfirmModal = false;
  }

  toggleDropdown(chatId: string) {
    const chat = this.chats.find(c => c.id === chatId);
    if (chat && !chat.isEditing) {
      this.dropdownVisible = this.dropdownVisible === chatId ? null : chatId;
    }
  }

  checkWindowWidth(): void {
    if (window.innerWidth <= this.mobileBreakpoint) {
      this.isSidebarOpen = false;
    } else {
      this.isSidebarOpen = true;
    }
  }

  exitFromChat():void{
    console.log('exiting chat');
    this.cleanupSession();
    this.router.navigate(['/dashboard']);
  }

  isVoiceModeActivated():boolean{
    return this.voiceService.getVoiceModeStatus();
  }


  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;

    const clickedInsideDropdown = target.closest('.dropdown-trigger') || target.closest('.dropdown-menu');
    const clickedInsideInput = target.closest('input'); // assuming it's only used for rename

    if (!clickedInsideDropdown && !clickedInsideInput) {
      this.dropdownVisible = null;

      // If any chat is currently being renamed, stop editing it when clicked outside
      for (const chat of this.chats) {
        if (chat.isEditing) {
          chat.isEditing = false;
        }
      }
    }
  }

  ngOnDestroy(): void {
    // window.removeEventListener('resize', this.checkWindowWidth.bind(this));
    // this.cleanupSession();
    // window.removeEventListener('beforeunload', this.handleUnload);
    // document.removeEventListener('visibilitychange', this.handleVisibilityChange);
  }


}
