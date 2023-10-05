import {Component, Inject, OnInit} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AreaService} from '../Services/area.service';
import {LignesService} from '../Services/lignes.service';
import {DevicesService} from '../Services/devices.service';
import {NotificationsService} from 'angular2-notifications';
import {LOCAL_STORAGE, WebStorageService} from 'ngx-webstorage-service';
import jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-profileuser',
  templateUrl: './profileuser.component.html',
  styleUrls: ['./profileuser.component.css']
})
export class ProfileuserComponent implements OnInit {
date_creation;
username;
  constructor(private dialog: NgbModal , public areaService: AreaService ,
              public ligneService: LignesService , public devicesService: DevicesService  , private service: NotificationsService ,
              @Inject(LOCAL_STORAGE) private storage: WebStorageService) { }

  ngOnInit(): void {
    const decodedHeader = jwt_decode(this.storage.get('token'));
    // @ts-ignore
    this.date_creation = decodedHeader.users.Date_Creation
    // @ts-ignore
    this.username = decodedHeader.users.username;
  }

}
