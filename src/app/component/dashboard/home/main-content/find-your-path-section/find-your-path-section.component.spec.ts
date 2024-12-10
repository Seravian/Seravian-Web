import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FindYourPathSectionComponent } from './find-your-path-section.component';

describe('FindYourPathSectionComponent', () => {
  let component: FindYourPathSectionComponent;
  let fixture: ComponentFixture<FindYourPathSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FindYourPathSectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FindYourPathSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
