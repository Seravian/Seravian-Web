import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { ChatService } from '../../../services/chat.service';
import { Chat } from '../../../interfaces/chat';

@Component({
  selector: 'app-chat-sidebar',
  templateUrl: './chat-sidebar.component.html',
  styleUrls: ['./chat-sidebar.component.css']
})
export class ChatSidebarComponent {
  isSidebarOpen = true;
  isSearchOpen = false;
  selectedChatId: string | null = null;
  dropdownVisible: string | null = null;
  showConfirmModal = false;
  chatToDeleteId: string | null = null;

  constructor(private chatService: ChatService) {}

  chats:Chat[] = [
    { id: '1', title: 'Chat with AI', isEditing: false ,messages: [
      { sender: 'user', text: 'Hi!' },
      { sender: 'bot', text: 'Hello, how can I help you?' },
    ] },
    { id: '2', title: 'Daily Notes', isEditing: false ,messages: [
      { sender: 'user', text: 'Don’t forget groceries.' },
      { sender: 'bot', text: 'Got it. Anything else?' },
    ] },
    { id: '3', title: 'Project Ideas', isEditing: false , messages: [
      { sender: 'user', text: 'What about a note app?' },
      { sender: 'bot', text: 'Sounds great! Want a to-do list too?' },
    ] },
  ];

  // selectChat(chat: Chat) {
  //   this.chatService.setSelectedChat(chat);
  // }

  // selectChat(chatId: string) {
  //   // Find the full chat object by its ID
  //   const selectedChat = this.chats.find(chat => chat.id === chatId);

  //   if (selectedChat) {
  //     // Send the full chat object to the chat service
  //     this.chatService.setSelectedChat(selectedChat);
  //   }
  // }


    selectChat(id: string) {
    if (id) {
      this.selectedChatId = id;
    }
  }

  @ViewChild('inputField') inputField: ElementRef | undefined;

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  onSearchClick() {
    this.isSearchOpen = !this.isSearchOpen;
  }

  createNewChat() {
    const newChat = {
      id: Math.random().toString(),
      title: 'New Chat',
      isEditing: false,
      messages: []
    };
    this.chats.unshift(newChat);
    this.selectedChatId = newChat.id;
  }




  startRename(chat: any) {
    chat.isEditing = true;
    this.dropdownVisible = null;
    setTimeout(() => {
      this.inputField?.nativeElement.focus();
    }, 0);
  }

  renameChat(chat: any) {
    if (chat) {
      chat.isEditing = false;
    }
  }

  promptDelete(id: string) {
    this.chatToDeleteId = id;
    this.showConfirmModal = true;
    this.dropdownVisible = null;
  }

  confirmDelete() {
    if (this.chatToDeleteId) {
      this.chats = this.chats.filter(c => c.id !== this.chatToDeleteId);
      if (this.selectedChatId === this.chatToDeleteId) this.selectedChatId = null;
      this.chatToDeleteId = null;
    }
    this.showConfirmModal = false;
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
