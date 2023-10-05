import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LOCAL_STORAGE, WebStorageService } from 'ngx-webstorage-service';
import * as Mapboxgl from 'mapbox-gl' ;
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AreaService} from '../../Services/area.service';
import {LignesService} from '../../Services/lignes.service';

import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import {Area} from '../../models/Area';
import {AddAreaComponent} from '../add-area/add-area.component';
import {AddLigneComponent} from '../add-ligne/add-ligne.component';

import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {EditAreaComponent} from '../edit-area/edit-area.component';
import {EditLigneComponent} from '../edit-ligne/edit-ligne.component';
import Swal from 'sweetalert2';
import {LocationComponent} from '../location/location.component';
import {AffectLigneToAreaComponent} from '../affect-ligne-to-area/affect-ligne-to-area.component';
import {NotificationsService} from 'angular2-notifications';
import {DataComponent} from '../data/data.component';
import jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-ligne',
  templateUrl: './ligne.component.html',
  styleUrls: ['./ligne.component.css']
})
export class LigneComponent implements OnInit {
  mapboxx:  Mapboxgl.Map;
  SearchText: any;
  private Lngg = 0;
  private ww: String;
  AreaSelected: number;
  AreaSelected2: number;
  private Latt = 0;
  private space: any;
  cols: any[];
  colss: any[];
  public CurrentArea;
  p = 1;
  Errurfilter = false ;
  selectedValue;
  role = false;
  BatteryLevelselectedValue;
  StatusselectedValue;
  /* From Group*/
  areaForm1 = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    Area: new FormControl('', [Validators.required]),
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
              private dialog: NgbModal , private service: NotificationsService) {
  }

  ngOnInit() {
    console.log(this.storage.get('Lng'));
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
      this.onaffiche(decodedHeader.users._id);
    } else {
      // @ts-ignore
      this.onaffiche(decodedHeader.users.useractive);
    }

  }
  OnSuccess() {
    this.service.success('Success', 'Line added successfully', {
      position: ['bottom', 'right'],
      timeOut: 2000,
      animate: 'fade',
      showProgressBar: true,
    })
  }
  addLigne() {
    const modalRef = this.dialog.open(AddLigneComponent , { size: 'lg', backdrop: 'static', windowClass: 'custom-class'});
    modalRef.componentInstance.passEntry.subscribe((cols) => {
      const decodedHeader = jwt_decode(this.storage.get('token'));
      // @ts-ignore
      this.onaffiche(decodedHeader.users._id);
      this.OnSuccess();
    });
  }

  onDelete(id) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this Line!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
   
      if (result.value) {
        this.lignesService.DeleteLigneByid(id).subscribe(
          (response)=>{
            Swal.fire(
              'Deleted!',
              'Your Area has been deleted.',
              'success'
            )
           
            this.cols = this.cols.filter(cols => cols.id !== id);
            const decodedHeader = jwt_decode(this.storage.get('token'));
            // @ts-ignore
            this.onaffiche(decodedHeader.users._id);
          },
          (error)=>
          {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: error,
            })
          }
        );
  
        // For more information about handling dismissals please visit
        // https://sweetalert2.github.io/#handling-dismissals
      }
       else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Your Area is safe :)',
          'error'
        )
      }
    })
  }

  // onDelete(id) {
  //   Swal.fire({
  //     title: 'Are you sure?',
  //     text: 'You will not be able to recover this Area!',
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonText: 'Yes, delete it!',
  //     cancelButtonText: 'No, keep it'
  //   }).then((result) => {
   
  //     if (result.value) {
  //       this.lignesService.DeleteLigneByid(id).subscribe(
  //         (response)=>{
  //           console.log("dooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooone")
  //           Swal.fire(
  //             'Deleted!',
  //             'Your Area has been deleted.',
  //             'success'
  //           )
           
  //           this.cols = this.cols.filter(cols => cols.id !== id);
  //           const decodedHeader = jwt_decode(this.storage.get('token'));
  //           // @ts-ignore
  //           this.onaffiche(decodedHeader.users._id);
  //         },
  //         (error)=>
  //         {
  //           Swal.fire({
  //             icon: 'error',
  //             title: 'Oops...',
  //             text: error,
  //           })
  //         }
  //       );
  
  //       // For more information about handling dismissals please visit
  //       // https://sweetalert2.github.io/#handling-dismissals
  //     }
  //      else if (result.dismiss === Swal.DismissReason.cancel) {
  //       Swal.fire(
  //         'Cancelled',
  //         'Your Area is safe :)',
  //         'error'
  //       )
  //     }
  //   })
  // }
  onaffiche(users) {
    this.lignesService.getLigne(users).subscribe(data => {
      this.cols = data ;
    });
  }
  onedit(id) {
    const modalRef = this.dialog.open(EditLigneComponent , { size: 'lg',
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
  data(id) {
    const modalRef = this.dialog.open(DataComponent , { size: 'lg',
      backdrop: 'static',
      windowClass: 'custom-class',
    });
    modalRef.componentInstance.id = id;
  }
  onAffect(Ligne) {
    const modalRef = this.dialog.open(AffectLigneToAreaComponent , { size: 'lg',
      backdrop: 'static',
      windowClass: 'custom-class',
    });
    modalRef.componentInstance.id = Ligne;
  }
  refresh() {
    const decodedHeader = jwt_decode(this.storage.get('token'));
    // @ts-ignore
    this.onaffiche(decodedHeader.users._id);
    this.Errurfilter = false;

  }
  search() {
    this.cols = this.cols.filter(u => u.Status === this.StatusselectedValue);
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
