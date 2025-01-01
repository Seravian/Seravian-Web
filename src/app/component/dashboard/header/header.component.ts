import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  isSidebarActive: boolean = false;

  toggleMenu(): void {
    this.isSidebarActive = true;
  }

  closeMenu(): void {
    this.isSidebarActive = false;
  }
}
