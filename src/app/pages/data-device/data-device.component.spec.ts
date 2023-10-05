import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataDeviceComponent } from './data-device.component';

describe('DataDeviceComponent', () => {
  let component: DataDeviceComponent;
  let fixture: ComponentFixture<DataDeviceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataDeviceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataDeviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
