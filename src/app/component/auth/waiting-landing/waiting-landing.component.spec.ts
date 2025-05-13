import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WaitingLandingComponent } from './waiting-landing.component';

describe('WaitingLandingComponent', () => {
  let component: WaitingLandingComponent;
  let fixture: ComponentFixture<WaitingLandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WaitingLandingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WaitingLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
