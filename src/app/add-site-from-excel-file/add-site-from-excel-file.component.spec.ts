import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSiteFromExcelFileComponent } from './add-site-from-excel-file.component';

describe('AddSiteFromExcelFileComponent', () => {
  let component: AddSiteFromExcelFileComponent;
  let fixture: ComponentFixture<AddSiteFromExcelFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddSiteFromExcelFileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSiteFromExcelFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
