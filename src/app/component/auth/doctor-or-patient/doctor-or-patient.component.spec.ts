import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorOrPatientComponent } from './doctor-or-patient.component';

describe('DoctorOrPatientComponent', () => {
  let component: DoctorOrPatientComponent;
  let fixture: ComponentFixture<DoctorOrPatientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DoctorOrPatientComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoctorOrPatientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
