import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LOCAL_STORAGE, WebStorageService } from 'ngx-webstorage-service';
import * as Mapboxgl from 'mapbox-gl' ;
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AreaService} from '../../Services/area.service';
import {LignesService} from '../../Services/lignes.service';
import {AdddeviceComponent} from '../adddevice/adddevice.component';

import {DevicesService} from '../../Services/devices.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import {Area} from '../../models/Area';
import {EditAreaComponent} from '../edit-area/edit-area.component';
import {EditDeviceComponent} from '../edit-device/edit-device.component';
import Swal from 'sweetalert2';
import {LocationComponent} from '../location/location.component';
import {AffectLigneToAreaComponent} from '../affect-ligne-to-area/affect-ligne-to-area.component';
import {AffectDeviceToLigneComponent} from '../affect-device-to-ligne/affect-device-to-ligne.component';
import {NotificationsService} from 'angular2-notifications';
import {DataComponent} from '../data/data.component';
import jwt_decode from 'jwt-decode';
import {UserService} from '../../Services/user.service';
import {DataDeviceComponent} from '../data-device/data-device.component';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-device',
  templateUrl: './device.component.html',
  styleUrls: ['./device.component.css']
})
export class DeviceComponent implements OnInit {
  mapboxx:  Mapboxgl.Map;
  p = 1;
  connectivitySelectedValue;
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
  sortingColumn: string = '';
  sortingOrder: string = 'asc';
  /* From Group*/
  areaForm1 = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    Area: new FormControl('', [Validators.required]),
    Ligne: new FormControl('', [Validators.required]),
    Lng: new FormControl(this.Lngg, [Validators.required]),
    Lat: new FormControl(this.Latt, [Validators.required]),

  });

  get name() {
    return this.areaForm1.get('name');
  }

  get description() {
    return this.areaForm1.get('description');
  }
  get Area() {
    return this.areaForm1.get('Area');
  }
  get Lng() {
    return this.areaForm1.get('Lng');
  } get Lat() {
    return this.areaForm1.get('Lat');
  }

  /*constructeur*/

  constructor(public areaService: AreaService, private formBuilder: FormBuilder, private router: Router,
              @Inject(LOCAL_STORAGE) private storage: WebStorageService , public  lignesService: LignesService ,
              public devicesService: DevicesService ,
              private dialog: NgbModal , private service: NotificationsService , public userService: UserService,
              ) {
  }

  ngOnInit() {
    console.log(this.SearchText);
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
      this.l = this.storage.get('nbdata');
     // console.log(this.Devices.data[l].luminosite);
    } else {
      // @ts-ignore
      this.onffiche(decodedHeader.users.useractive);
    }


  }
  refresh() {
    const decodedHeader = jwt_decode(this.storage.get('token'));
    // @ts-ignore
    this.onffiche(decodedHeader.users._id);
    this.Errurfilter = false;
    console.log(this.selectedValue)
    console.log(this.StatusselectedValue)

  }
  search() {
    if (this.selectedValue !== undefined &&  this.StatusselectedValue === undefined && this.connectivitySelectedValue === undefined) {
      this.Devices= this.Devices.filter(u => u.alert == this.selectedValue);
    }
    if (this.selectedValue === undefined &&  this.StatusselectedValue !== undefined && this.connectivitySelectedValue === undefined) {
      this.Devices= this.Devices.filter(u => u.Status === this.StatusselectedValue);
    }
    if (this.selectedValue === undefined &&  this.StatusselectedValue === undefined && this.connectivitySelectedValue !== undefined) {
      this.Devices= this.Devices.filter(u => u.connectivityAlert == this.connectivitySelectedValue);
    }

    if (this.selectedValue !== undefined &&  this.StatusselectedValue !== undefined && this.connectivitySelectedValue === undefined) {
      this.Devices= this.Devices.filter(u => u.alert == this.selectedValue && u.Status == this.StatusselectedValue);
    }
    if (this.selectedValue !== undefined &&  this.StatusselectedValue === undefined && this.connectivitySelectedValue !== undefined) {
      this.Devices= this.Devices.filter(u => u.alert == this.selectedValue && u.connectivityAlert == this.connectivitySelectedValue);
    }
    if (this.selectedValue === undefined &&  this.StatusselectedValue !== undefined && this.connectivitySelectedValue !== undefined) {
      this.Devices= this.Devices.filter(u => u.Status == this.StatusselectedValue && u.connectivityAlert == this.connectivitySelectedValue);
    }

    if (this.selectedValue !== undefined &&  this.StatusselectedValue !== undefined && this.connectivitySelectedValue !== undefined) {
      this.Devices= this.Devices.filter(u => u.alert == this.selectedValue && u.Status == this.StatusselectedValue && u.connectivityAlert == this.connectivitySelectedValue);
    }

}
  OnSuccess() {
    this.service.success('Success', 'Device added successfully', {
      position: ['bottom', 'right'],
      timeOut: 2000,
      animate: 'fade',
      showProgressBar: true,
    })
  }
  addDevice() {
    const decodedHeader = jwt_decode(this.storage.get('token'));
    const freeLicense = this.storage.get('freeLicense');
    if (this.storage.get('LicenseDeviceAllowed') === undefined) {
      if (freeLicense < 14) {
        console.log(this.storage.get('nbdedevice'));
        if (this.storage.get('nbdedevice') === 10) {
          alert('you have the right only for 10 device');
        } else {
          const modalRef = this.dialog.open(AdddeviceComponent, {size: 'lg', backdrop: 'static', windowClass: 'custom-class'});
          modalRef.componentInstance.passEntry.subscribe((cols) => {
            // @ts-ignore
            this.onffiche(decodedHeader.users._id);
            this.OnSuccess();
          });
        }
      }
      } else {
      if (this.storage.get('limite') === false ) {
        const modalRef = this.dialog.open(AdddeviceComponent, {size: 'lg', backdrop: 'static', windowClass: 'custom-class'});
        modalRef.componentInstance.passEntry.subscribe((cols) => {
          // @ts-ignore
          this.onffiche(decodedHeader.users._id);
          this.OnSuccess();
        });
      } else {
      if (this.storage.get('LicenseDeviceAllowed') === this.storage.get('nbdedevice')) {
        alert('you have the right only for  ' + this.storage.get('LicenseDeviceAllowed') + ' device');
      } else {
        const modalRef = this.dialog.open(AdddeviceComponent, {size: 'lg', backdrop: 'static', windowClass: 'custom-class'});
        modalRef.componentInstance.passEntry.subscribe((cols) => {
          // @ts-ignore
          this.onffiche(decodedHeader.users._id);
          this.OnSuccess();
        });
      }
      }
    }
    }
  change() {
    console.log(this.SearchText);
  }
   onffiche(users) {
    this.devicesService.getDevicesWithoutData(users).subscribe(data => {
      //@ts-ignore
      this.Devices = data;
       //@ts-ignore
      this.storage.set('nbdedevice', data.length);
      this.storage.set('nbdata',  this.Devices[0].data.length);
      console.log(this.Devices[0].data[68].luminosite);
      this.luminosite = this.Devices[0].data[this.Devices[0].data.length - 1].luminosite

    });
  }
  onDeleteDevice(id) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this Device!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        Swal.fire(
          'Deleted!',
          'Your Device has been deleted.',
          'success'
        )
        this.devicesService.DeleteDeviceByid(id).subscribe();
        this.cols = this.Devices.filter(Devices => Devices.id !== id);
        this.ngOnInit();
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Your Device is safe :)',
          'error'
        )
      }
    })
  }
  data(id) {
    const modalRef = this.dialog.open(DataDeviceComponent , { size: 'lg',
      backdrop: 'static',
      windowClass: 'custom-class',
    });
    modalRef.componentInstance.id = id;
  }
  onedit(id) {
    const modalRef = this.dialog.open(EditDeviceComponent , { size: 'lg',
      backdrop: 'static',
      windowClass: 'custom-class',
    });
    modalRef.componentInstance.id = id;
  }
  Location(id) {
    const modalRef = this.dialog.open(LocationComponent , { size: 'lg',
      backdrop: 'static',
      windowClass: 'custom-class',
    });
    modalRef.componentInstance.id = id;
  }
  Search() {
    if (this.SearchText === '') {
      this.ngOnInit();
    } else {
      this.Devices = this.Devices.filter(res => {
        return res.name.toLocaleLowerCase().match(this.SearchText.toLocaleLowerCase());
      });
    }
  }
  onAffect(device) {
    const modalRef = this.dialog.open(AffectDeviceToLigneComponent , { size: 'lg',
      backdrop: 'static',
      windowClass: 'custom-class',
    });
    modalRef.componentInstance.id = device;
  }

  sortData(column: string): void {
    if (this.sortingColumn === column) {
      this.sortingOrder = this.sortingOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortingColumn = column;
      this.sortingOrder = 'asc';
    }
        this.Devices = this.Devices.sort((a, b) => {
      if (a[column].toLowerCase() < b[column].toLowerCase() ) return this.sortingOrder === 'asc' ? -1 : 1;
      if (a[column].toLowerCase() > b[column].toLowerCase() ) return this.sortingOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }

}
 