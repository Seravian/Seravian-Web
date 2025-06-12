import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendVerificationRequestComponent } from './send-verification-request.component';

describe('SendVerificationRequestComponent', () => {
  let component: SendVerificationRequestComponent;
  let fixture: ComponentFixture<SendVerificationRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SendVerificationRequestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SendVerificationRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
