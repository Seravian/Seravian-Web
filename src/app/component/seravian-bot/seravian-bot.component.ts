import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { Chat } from '../../interfaces/chat';

@Component({
  selector: 'app-seravian-bot',
  templateUrl: './seravian-bot.component.html',
  styleUrls: ['./seravian-bot.component.css']
})
export class SeravianBotComponent implements OnInit {

  isPopupVisible = false;
  selectedChat: Chat | null = null;
  userMessage: string = '';

  @ViewChild('chatBody') chatBodyRef!: ElementRef;
  @ViewChild('messageInput') messageInputRef!: ElementRef;

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    this.chatService.selectedChat$.subscribe(chat => {
      this.selectedChat = chat;
    });
  }

  get messages() {
    return this.selectedChat?.messages ?? [];
  }

  sendMessage(): void {
    const message = this.userMessage.trim();
    if (message && this.selectedChat) {
      this.selectedChat.messages.push({ sender: 'user', text: message });
      this.userMessage = '';

      setTimeout(() => {
        this.scrollToBottom();
        this.messageInputRef.nativeElement.focus();
      }, 50);
    }
  }

  scrollToBottom(): void {
    try {
      this.chatBodyRef.nativeElement.scrollTop = this.chatBodyRef.nativeElement.scrollHeight;
    } catch (err) {
      console.warn('Failed to scroll:', err);
    }
  }


  handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault(); // prevent newline
      this.sendMessage();
    }
    // If Shift+Enter, do nothing (allows newline)
  }


  // adjustTextareaHeight(textarea: HTMLTextAreaElement): void {
  //   textarea.style.height = 'auto'; // reset height
  //   textarea.style.height = Math.min(textarea.scrollHeight, 150) + 'px'; // auto-grow up to 150px
  // }

  // adjustTextareaHeight(textarea: HTMLTextAreaElement): void {
  //   textarea.style.height = 'auto'; // Reset height
  //   const maxHeight = 120;          // Match the CSS max-height
  //   textarea.style.height = Math.min(textarea.scrollHeight, maxHeight) + 'px';
  // }

  adjustTextareaHeight(textarea: HTMLTextAreaElement): void {
    // Reset height to auto to measure the content height
    textarea.style.height = 'auto';

    // Default height of one line (you can adjust this value if needed)
    const lineHeight = parseInt(window.getComputedStyle(textarea).lineHeight, 10);
    const maxHeight = 120; // Maximum height for the textarea

    // If the content height exceeds one line, start growing the textarea
    if (textarea.scrollHeight > lineHeight) {
      textarea.style.height = Math.min(textarea.scrollHeight, maxHeight) + 'px';
    } else {
      textarea.style.height = '47px';  // Set back to default if no extra lines
    }
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
