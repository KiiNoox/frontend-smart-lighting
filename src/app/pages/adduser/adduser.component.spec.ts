import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ADDUserComponent } from './adduser.component';

describe('ADDUserComponent', () => {
  let component: ADDUserComponent;
  let fixture: ComponentFixture<ADDUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ADDUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ADDUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
