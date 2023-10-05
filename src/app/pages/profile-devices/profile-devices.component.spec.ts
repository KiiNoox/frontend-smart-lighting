import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileDevicesComponent } from './profile-devices.component';

describe('ProfileDevicesComponent', () => {
  let component: ProfileDevicesComponent;
  let fixture: ComponentFixture<ProfileDevicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfileDevicesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileDevicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
