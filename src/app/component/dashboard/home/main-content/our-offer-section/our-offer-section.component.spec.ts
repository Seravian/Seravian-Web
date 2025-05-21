import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OurOfferSectionComponent } from './our-offer-section.component';

describe('OurOfferSectionComponent', () => {
  let component: OurOfferSectionComponent;
  let fixture: ComponentFixture<OurOfferSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OurOfferSectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OurOfferSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
