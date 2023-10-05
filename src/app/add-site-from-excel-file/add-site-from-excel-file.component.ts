import { Component, OnInit } from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-add-site-from-excel-file',
  templateUrl: './add-site-from-excel-file.component.html',
  styleUrls: ['./add-site-from-excel-file.component.css']
})
export class AddSiteFromExcelFileComponent implements OnInit {

  constructor(private dialog: NgbModal) { }

  ngOnInit(): void {
  }

}
