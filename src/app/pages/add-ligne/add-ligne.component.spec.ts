import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLigneComponent } from './add-ligne.component';

describe('AddLigneComponent', () => {
  let component: AddLigneComponent;
  let fixture: ComponentFixture<AddLigneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddLigneComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddLigneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
