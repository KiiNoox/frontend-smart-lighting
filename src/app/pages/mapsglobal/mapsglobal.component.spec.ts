import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapsglobalComponent } from './mapsglobal.component';

describe('MapsglobalComponent', () => {
  let component: MapsglobalComponent;
  let fixture: ComponentFixture<MapsglobalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapsglobalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapsglobalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
