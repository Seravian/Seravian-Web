import { Component, AfterViewInit, HostListener, ElementRef } from '@angular/core';
@Component({
  selector: 'app-testimonial-section',
  templateUrl: './testimonial-section.component.html',
  styleUrl: './testimonial-section.component.css'
})
export class TestimonialSectionComponent implements AfterViewInit {
  currentIndex = 0;
  startX = 0;
  currentX = 0;

  constructor(private elRef: ElementRef) {}

  ngAfterViewInit(): void {
    this.setupEventListeners();
    this.updateSlide();
  }

  /** Set up click event listeners for buttons */
  setupEventListeners(): void {
    const btns = this.elRef.nativeElement.querySelectorAll('.btn');
    btns.forEach((btn: HTMLElement, index: number) => {
      btn.addEventListener('click', () => {
        this.currentIndex = index;
        this.updateSlide();
      });
    });

    // Touch start event
    this.elRef.nativeElement.querySelector('.slider').addEventListener('touchstart', this.touchStart.bind(this));
    // Touch move event
    this.elRef.nativeElement.querySelector('.slider').addEventListener('touchmove', this.touchMove.bind(this));
    // Touch end event
    this.elRef.nativeElement.querySelector('.slider').addEventListener('touchend', this.touchEnd.bind(this));
  }

  /** Touch start event */
  touchStart(event: TouchEvent): void {
    this.startX = event.touches[0].clientX;
  }

  /** Touch move event */
  touchMove(event: TouchEvent): void {
    this.currentX = event.touches[0].clientX;
    const moveX = this.currentX - this.startX;
    const main = this.elRef.nativeElement.querySelector('main');
    const slideRow = this.elRef.nativeElement.querySelector('#slide-row');
    const mainWidth = main.offsetWidth;

    const translateValue = this.currentIndex * -mainWidth + moveX;
    slideRow.style.transform = `translateX(${translateValue}px)`;
  }

  /** Touch end event */
  touchEnd(event: TouchEvent): void {
    const main = this.elRef.nativeElement.querySelector('main');
    const mainWidth = main.offsetWidth;

    if (this.currentX < this.startX - 50) {
      // Swiped left
      this.currentIndex = Math.min(this.currentIndex + 1, 2); // Assuming there are 3 slides
    } else if (this.currentX > this.startX + 50) {
      // Swiped right
      this.currentIndex = Math.max(this.currentIndex - 1, 0);
    }

    this.updateSlide();
  }

  /** Update the slider's position and button active state */
  updateSlide(): void {
    const main = this.elRef.nativeElement.querySelector('main');
    const slideRow = this.elRef.nativeElement.querySelector('#slide-row');
    const mainWidth = main.offsetWidth;

    const translateValue = this.currentIndex * -mainWidth;
    slideRow.style.transform = `translateX(${translateValue}px)`;

    const btns = this.elRef.nativeElement.querySelectorAll('.btn');
    btns.forEach((btn: HTMLElement, index: number) => {
      btn.classList.toggle('active', index === this.currentIndex);
    });
  }

  /** Listen for window resize events to update the slide position */
  @HostListener('window:resize')
  onResize(): void {
    this.updateSlide();
  }
}
