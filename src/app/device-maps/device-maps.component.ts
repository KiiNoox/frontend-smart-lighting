import { Component, OnInit } from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-device-maps',
  templateUrl: './device-maps.component.html',
  styleUrls: ['./device-maps.component.css']
})
export class DeviceMapsComponent implements OnInit {

  constructor(private dialogmap: NgbModal) { }

  ngOnInit(): void {
  }

}
