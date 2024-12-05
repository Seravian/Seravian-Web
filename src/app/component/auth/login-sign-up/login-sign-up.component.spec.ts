import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginsignupComponent } from './login-sign-up.component';

describe('LoginSignUpComponent', () => {
  let component: LoginsignupComponent;
  let fixture: ComponentFixture<LoginsignupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginsignupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginsignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
