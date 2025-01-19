import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeravianBotComponent } from './seravian-bot.component';

describe('SeravianBotComponent', () => {
  let component: SeravianBotComponent;
  let fixture: ComponentFixture<SeravianBotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SeravianBotComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeravianBotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
