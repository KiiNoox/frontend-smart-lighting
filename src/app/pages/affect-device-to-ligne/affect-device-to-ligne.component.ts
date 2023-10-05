import {Component, Inject, Input, OnInit} from '@angular/core';
import {Ligne} from '../../models/Ligne';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AreaService} from '../../Services/area.service';
import {LignesService} from '../../Services/lignes.service';
import {DevicesService} from '../../Services/devices.service';
import {LOCAL_STORAGE, WebStorageService} from 'ngx-webstorage-service';
import jwt_decode from 'jwt-decode';
@Component({
  selector: 'app-affect-device-to-ligne',
  templateUrl: './affect-device-to-ligne.component.html',
  styleUrls: ['./affect-device-to-ligne.component.css']
})
export class AffectDeviceToLigneComponent implements OnInit {

  ligne: Ligne;
  data = [];
  keyword = 'name';
  @Input() public id;
  idArea;
  areaForm1 = new FormGroup({
    Device: new FormControl('', [Validators.required]),
  });
  constructor( private dialog: NgbModal , public areaService: AreaService ,
               public ligneService: LignesService , public devicesService: DevicesService ,
               @Inject(LOCAL_STORAGE) private storage: WebStorageService) { }
  ngOnInit(): void {
    const decodedHeader = jwt_decode(this.storage.get('token'));
    // @ts-ignore
    this.ligneService.getLigne(decodedHeader.users._id).subscribe(data => {
      this.data = data;
    });
  }
  selectEvent(item) {
    // do something with selected item
    console.log(item._id);
    this.idArea = item._id;
  }

  onChangeSearch(val: string) {
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.

  }

  onFocused(e) {

    // do something when input is focused
  }

  affect() {
    this.areaForm1.controls['Device'].setValue(this.id);
    console.log(this.areaForm1.value);

    this.ligne = this.id;
    console.log(this.ligne);
    this.ligneService.affectDevicetoLigne( this.idArea, this.areaForm1.value ).subscribe();
  }
}
