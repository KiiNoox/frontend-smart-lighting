import {Component, Inject, OnInit} from '@angular/core';
import {AreaService} from '../../Services/area.service';
import {FormBuilder} from '@angular/forms';
import {Router} from '@angular/router';
import {LOCAL_STORAGE, WebStorageService} from 'ngx-webstorage-service';
import {LignesService} from '../../Services/lignes.service';
import {DevicesService} from '../../Services/devices.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {NotificationsService} from 'angular2-notifications';
import {UserService} from '../../Services/user.service';
import jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.css']
})
export class AlertsComponent implements OnInit {
  p = 1;
  px: number;
  SearchText: string;
  private Lngg = 0;
  response: any;
  private ww: String;
  Devices: any[];
  private Latt = 0;
  private space: any;
  cols: any[];
  colss: any[];
  colsss: any[];
  colDevice: any[];
  public CurrentArea;
  Errurfilter = false ;
  selectedValue;
  BatteryLevelselectedValue;
  StatusselectedValue;
  role = false;
  luminosite = 70;
  l;
  constructor(public areaService: AreaService, private formBuilder: FormBuilder, private router: Router,
              @Inject(LOCAL_STORAGE) private storage: WebStorageService , public  lignesService: LignesService ,
              public devicesService: DevicesService ,
              private dialog: NgbModal , private service: NotificationsService , public userService: UserService) { }

  ngOnInit(): void {
    if (this.storage.get('token') === undefined) {
      this.router.navigateByUrl('/');
    }
    const decodedHeader = jwt_decode(this.storage.get('token'));
    // @ts-ignore
    console.log(decodedHeader.users.role);
    // @ts-ignore
    if (decodedHeader.users.role === 'admin') {
      this.role = true;
    }
    // @ts-ignore
    if (decodedHeader.users.role === 'admin') {
      // @ts-ignore
      this.onffiche(decodedHeader.users._id);
      console.log(this.storage.get('nbdata'));
      console.log('qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq');
      this.l = this.storage.get('nbdata');
      // console.log(this.Devices.data[l].luminosite);
    } else {
      // @ts-ignore
      this.onffiche(decodedHeader.users.useractive);
    }
  }
  onffiche(users) {
    this.devicesService.GetAllDevice(users).subscribe(data => {
      this.Devices = data;
      this.Devices = this.Devices.filter(u => u.alert === '1')
    });

  }
}
