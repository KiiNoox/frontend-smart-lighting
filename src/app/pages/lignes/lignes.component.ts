import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LOCAL_STORAGE, WebStorageService } from 'ngx-webstorage-service';
import * as Mapboxgl from 'mapbox-gl' ;
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AreaService} from '../../Services/area.service';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import {Area} from '../../models/Area';
import {AdddeviceComponent} from '../adddevice/adddevice.component';
import {AddAreaComponent} from '../add-area/add-area.component';
import jwt_decode from "jwt-decode";

import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {EditAreaComponent} from '../edit-area/edit-area.component';
import Swal from "sweetalert2";
import {LocationComponent} from '../location/location.component';
import {NotificationsService} from 'angular2-notifications';
import {DataComponent} from '../data/data.component';
import {AddSiteFromExcelFileComponent} from '../../add-site-from-excel-file/add-site-from-excel-file.component';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-lignes',
  templateUrl: './lignes.component.html',
  styleUrls: ['./lignes.component.css']
})
export class LignesComponent implements OnInit {
  mapboxx:  Mapboxgl.Map;
  private Lngg = 0;
  SearchText: any;
  private ww: String;
  AreaSelected: number;
  private Latt = 0;
  private space: any;
  cols: any[];
  colss: any[];
  public CurrentArea;
  p = 1;
  Errurfilter = false ;
  selectedValue;
  BatteryLevelselectedValue;
  StatusselectedValue;
role = false;
  /* From Group*/
  areaForm1 = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    Lng: new FormControl(this.Lngg, [Validators.required]),
    Lat: new FormControl(this.Latt, [Validators.required]),

  });
  sortingColumn: string = '';
  sortingOrder: string = 'asc';

  get name() {
    return this.areaForm1.get('name');
  }

  get description() {
    return this.areaForm1.get('description');
  }
  get Lng() {
    return this.areaForm1.get('Lng');
  } get Lat() {
    return this.areaForm1.get('Lat');
  }

  /*constructeur*/

  constructor(public areaService: AreaService, private formBuilder: FormBuilder, private router: Router,
    @Inject(LOCAL_STORAGE) private storage: WebStorageService ,  private dialog: NgbModal ,
     private service: NotificationsService,private http: HttpClient) {}

  ngOnInit() {
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
      this.afficheArea(decodedHeader.users._id);
    } else {
      // @ts-ignore
      this.afficheArea(decodedHeader.users.useractive);
    }
  }
  addArea() {
    const modalRef = this.dialog.open(AddAreaComponent , { size: 'lg', backdrop: 'static', windowClass: 'custom-class'});
    modalRef.componentInstance.passEntry.subscribe((cols) => {
      this.cols.push(cols);
      this.OnSuccess();
    });
  }
  addAreaFromExcelFile() {
    const modalRef = this.dialog.open(AddSiteFromExcelFileComponent , { size: 'lg', backdrop: 'static', windowClass: 'custom-class'});
  }
  OnSuccess() {
    this.service.success('Success', 'area added successfully', {
      position: ['bottom', 'right'],
      timeOut: 2000,
      animate: 'fade',
      showProgressBar: true,
    })
  }
  onDeleteOrderItem(id) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this site!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this.areaService.DeleteAreaByid(id).subscribe(
        (response)=>{
          Swal.fire(
            'Deleted!',
            'Your Area has been deleted.',
            'success'
          )
          this.cols = this.cols.filter(cols => cols.id !== id);
          this.ngOnInit();
        },
        (error)=>{
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: error,
          })
        }

        );
     
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Your site is safe :)',
          'error'
        )
      }
    })


  }
  
  afficheArea(users) {
    this.areaService.getArea(users).subscribe(data => {
      this.cols = data ;
    });
  }
  onedit(id) {
    const modalRef = this.dialog.open(EditAreaComponent , { size: 'lg',
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
  refresh() {
    const decodedHeader = jwt_decode(this.storage.get('token'));
    // @ts-ignore
    console.log(decodedHeader.users.role);
    // @ts-ignore
    this.afficheArea(decodedHeader.users._id);
    this.Errurfilter = false;

  }
  search() { 
    console.log(this.StatusselectedValue);
this.cols = this.cols.filter(u => u.Status === this.StatusselectedValue);
  }
  data(id) {
    const modalRef = this.dialog.open(DataComponent , { size: 'lg',
      backdrop: 'static',
      windowClass: 'custom-class',
    });
    modalRef.componentInstance.id = id;

    // this.http.get('/api/Area/getsommesite/' +id._id).subscribe(data => {
    //   console.log('data');
    //   console.log(data);
    //   const resSTR = JSON.stringify(data);
    //   const resJSON = JSON.parse(resSTR);
    //   let datasite = resJSON;
    //   console.log(datasite);
      // });
  }

  sortData(column: string): void {
    if (this.sortingColumn === column) {
      this.sortingOrder = this.sortingOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortingColumn = column;
      this.sortingOrder = 'asc';
    }
        this.cols = this.cols.sort((a, b) => {
      if (a[column].toLowerCase() < b[column].toLowerCase() ) return this.sortingOrder === 'asc' ? -1 : 1;
      if (a[column].toLowerCase() > b[column].toLowerCase() ) return this.sortingOrder === 'asc' ? 1 : -1;
      return 0;
    });
}

}