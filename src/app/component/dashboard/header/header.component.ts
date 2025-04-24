import { Component,ElementRef, HostListener, ViewChild } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
// export class HeaderComponent {
//   isSidebarActive: boolean = false;

//   toggleMenu(): void {
//     this.isSidebarActive = true;
//   }

//   closeMenu(): void {
//     this.isSidebarActive = false;
//   }
// }

export class HeaderComponent {
  // isSidebarActive: boolean = false;
  // userMenuOpen: boolean = false;


  // toggleUserMenu(): void {
  //   this.userMenuOpen = !this.userMenuOpen;
  // }

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

  constructor() {
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

}
