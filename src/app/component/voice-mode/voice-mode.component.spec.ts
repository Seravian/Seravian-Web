import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoiceModeComponent } from './voice-mode.component';

describe('VoiceModeComponent', () => {
  let component: VoiceModeComponent;
  let fixture: ComponentFixture<VoiceModeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VoiceModeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VoiceModeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
