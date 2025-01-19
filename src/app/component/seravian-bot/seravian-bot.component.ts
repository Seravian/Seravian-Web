import { Component, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

@Component({
  selector: 'app-seravian-bot',
  templateUrl: './seravian-bot.component.html',
  styleUrls: ['./seravian-bot.component.css']
})
export class SeravianBotComponent {

  isPopupVisible = false;

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
