import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { ChatService } from '../../../services/chat.service';
import { Chat } from '../../../interfaces/chat';
import { ChatMessage } from '../../../interfaces/chat-message';

@Component({
  selector: 'app-chat-sidebar',
  templateUrl: './chat-sidebar.component.html',
  styleUrls: ['./chat-sidebar.component.css']
})
export class ChatSidebarComponent implements OnInit {
  isSidebarOpen = true;
  isSearchOpen = false;
  selectedChatId: string | null = null;
  dropdownVisible: string | null = null;
  showConfirmModal = false;
  chatToDeleteId: string | null = null;

  constructor(private chatService: ChatService) {}



  chats: Chat[] = [];

  ngOnInit(): void {
    this.chatService.getChats().subscribe({
      next: (chats) => {
        this.chats = chats;
      },
      error: (err) => {
        console.error('Failed to load chats:', err);
      }
    });
  }


  selectChat(chatId: string) {
    this.selectedChatId = chatId;
    console.log('Selected chat ID:', chatId);

    this.chatService.getChatMessages(chatId).subscribe({
      next: (chatMessages:Chat) => {
        const selectedChat = this.chats.find(chat => chat.id === chatId);
        if (selectedChat) {
          selectedChat.messages = chatMessages.messages??[];
          this.chatService.setSelectedChat({ ...selectedChat }); // optional
        }
      },
      error: (err) => {
        console.error('Failed to load chat messages:', err);
      }
    });
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
      },
      error: (err) => {
        console.error('Failed to create chat:', err);
      }
    });
  }


  startRename(chat: any) {
    chat.isEditing = true;
    this.dropdownVisible = null;
    setTimeout(() => {
      this.inputField?.nativeElement.focus();
    }, 0);
  }


  renameChat(chat: any) {
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

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.dropdown-trigger') && !target.closest('.dropdown-menu')) {
      this.dropdownVisible = null;
    }
  }
}
