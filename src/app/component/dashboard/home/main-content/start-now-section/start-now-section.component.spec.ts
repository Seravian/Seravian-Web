import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StartNowSectionComponent } from './start-now-section.component';

describe('StartNowSectionComponent', () => {
  let component: StartNowSectionComponent;
  let fixture: ComponentFixture<StartNowSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StartNowSectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StartNowSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
