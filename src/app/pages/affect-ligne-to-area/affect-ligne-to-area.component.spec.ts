import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AffectLigneToAreaComponent } from './affect-ligne-to-area.component';

describe('AffectLigneToAreaComponent', () => {
  let component: AffectLigneToAreaComponent;
  let fixture: ComponentFixture<AffectLigneToAreaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AffectLigneToAreaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AffectLigneToAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
