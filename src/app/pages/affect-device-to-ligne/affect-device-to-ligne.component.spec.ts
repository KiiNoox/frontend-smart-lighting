import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AffectDeviceToLigneComponent } from './affect-device-to-ligne.component';

describe('AffectDeviceToLigneComponent', () => {
  let component: AffectDeviceToLigneComponent;
  let fixture: ComponentFixture<AffectDeviceToLigneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AffectDeviceToLigneComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AffectDeviceToLigneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
