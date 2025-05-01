import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';

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

  chats = [
    { id: '1', title: 'Chat with AI', isEditing: false },
    { id: '2', title: 'Daily Notes', isEditing: false },
    { id: '3', title: 'Project Ideas', isEditing: false }
  ];

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
      isEditing: false
    };
    this.chats.unshift(newChat);
    this.selectedChatId = newChat.id;
  }

  selectChat(id: string) {
    if (id) {
      this.selectedChatId = id;
    }
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
