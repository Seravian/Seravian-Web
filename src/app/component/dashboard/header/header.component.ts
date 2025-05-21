import { Component,ElementRef, HostListener, ViewChild } from '@angular/core';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})

export class HeaderComponent {

  isSidebarActive: boolean = false;
  isUserMenuOpen: boolean = false;
  isMobileMenuOpen: boolean = false;


  toggleUserMenu(): void {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  closeUserMenu(): void {
    this.isUserMenuOpen = false;
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }

  constructor(private authService: AuthService) {
    document.addEventListener('click', this.handleDocumentClick.bind(this));
  }

  private handleDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.user-menu') && !target.closest('.user-photo')) {
      this.closeUserMenu();
    }

    if (!target.closest('.menu-toggle') && !target.closest('.mobile-dropdown')) {
      this.closeMobileMenu();
    }
  }

  signOut(): void {
    this.authService.logout();
  }

}
