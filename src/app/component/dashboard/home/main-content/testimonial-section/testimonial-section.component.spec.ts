import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestimonialSectionComponent } from './testimonial-section.component';

describe('TestimonialSectionComponent', () => {
  let component: TestimonialSectionComponent;
  let fixture: ComponentFixture<TestimonialSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestimonialSectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestimonialSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
