import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceMapsComponent } from './device-maps.component';

describe('DeviceMapsComponent', () => {
  let component: DeviceMapsComponent;
  let fixture: ComponentFixture<DeviceMapsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeviceMapsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceMapsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
