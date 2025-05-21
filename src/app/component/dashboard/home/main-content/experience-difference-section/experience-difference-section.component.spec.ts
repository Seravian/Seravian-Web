import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExperienceDifferenceSectionComponent } from './experience-difference-section.component';

describe('ExperienceDifferenceSectionComponent', () => {
  let component: ExperienceDifferenceSectionComponent;
  let fixture: ComponentFixture<ExperienceDifferenceSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExperienceDifferenceSectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExperienceDifferenceSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
