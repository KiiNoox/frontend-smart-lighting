import {Component, EventEmitter, Inject, Input, OnInit, Output} from '@angular/core';
import * as Mapboxgl from 'mapbox-gl';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AreaService} from '../../Services/area.service';
import {LignesService} from '../../Services/lignes.service';
import {DevicesService} from '../../Services/devices.service';
import {Area} from '../../models/Area';
import jwt_decode from 'jwt-decode';
import {LOCAL_STORAGE, WebStorageService} from 'ngx-webstorage-service';
@Component({
  selector: 'app-edit-area',
  templateUrl: './edit-area.component.html',
  styleUrls: ['./edit-area.component.css']
})
export class EditAreaComponent implements OnInit {
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  response: any;
  @Input() public id;
  keyword = 'name';
  changelocation = false;
  private Latt = 0;
  private Lngg = 0;
  private test = false;
  public edited = true;
  mapboxx:  Mapboxgl.Map;
  IdLigneSelected: number;
  IdAreaSelected: number;
  Lignedata = [];
  data = [];
  areaForm1 = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    Lng: new FormControl('', [Validators.required]),
    Lat: new FormControl('', [Validators.required]),

  });

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
  constructor( private dialog: NgbModal , public areaService: AreaService ,
               public ligneService: LignesService , public devicesService: DevicesService,
               @Inject(LOCAL_STORAGE) private storage: WebStorageService) { }

  ngOnInit(): void {
    console.log(this.id.name);
if (this.changelocation === false) {
  const decodedHeader = jwt_decode(this.storage.get('token'));
  // @ts-ignore
  this.areaService.getArea(decodedHeader.users._id).subscribe(data => {
    this.data = data;
    for ( let i = 0; i < data.length ; i++) {
      this.marker2(data[i].Lng , data[i].Lat , data[i].name)
    }
  });
}
    (Mapboxgl as any).accessToken = 'pk.eyJ1IjoibWFyd2VuYmVuYWJkZWxsYXRpZiIsImEiOiJja2xvN3l4Z3owZ2d5MnZxbTBxaG0ydGQyIn0.anOW2Yn2gef3_qc8w7BnFg';

    if (Mapboxgl.getRTLTextPluginStatus() !== 'loaded') {
      Mapboxgl.setRTLTextPlugin(
        'https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.3/mapbox-gl-rtl-text.js',
        null,
        true // Lazy load the plugin
      );
    }
    this.mapboxx = new Mapboxgl.Map({
      container: 'map-mapboxEditArea',
      style: 'mapbox://styles/mapbox/streets-v11',
      zoom: 7,
      center: [9.8480112, 37.3574074]
    });
    this.mapboxx.flyTo(
      {
        zoom: 8,
        center: [
          this.id.Lng ,
          this.id.Lat
        ],
        essential: true // this animation is considered essential with respect to prefers-reduced-motion
      }
    );
  }
  addDevice() {
    console.log(this.Lngg);
    console.log(this.Latt);
    const popup = new Mapboxgl.Popup();
    popup.setLngLat([this.Lngg , this.Latt ]).setHTML('<div><h1 style="color: red"> Select Location</h1></div>').addTo(this.mapboxx);
    this.marker(this.Lngg , this.Latt  );
    this.mapboxx.flyTo(
      {
        zoom: 15,
        center: [
          this.Lngg ,
          this.Latt
        ],
        essential: true // this animation is considered essential with respect to prefers-reduced-motion
      }
    );

  }
  marker(a: number , b: number) {
    const marker = new Mapboxgl.Marker(
      {
        color: 'red',
        draggable: true,
      }).setLngLat([a, b])
      .addTo(this.mapboxx);
    marker.on('drag', () => {
      this.Lngg = marker.getLngLat().lng;
      this.Latt = marker.getLngLat().lat;
    })
  }
  marker2(a: number , b: number , c: String) {

    const popup = new Mapboxgl.Popup({ className: 'apple-popup' })
      .setHTML('<div><h1 style="color: green; width: 1000px; height: 100px">Location : </h1>' + '<h6 style="text-align: center">' + c + '</h6></div>');
    const marker = new Mapboxgl.Marker(
      {
        color: 'green',
        draggable: false,
      }).setLngLat([a, b])
      .addTo(this.mapboxx);
    marker.getElement().addEventListener('click', function() {
      marker.setPopup(popup);
    });
  }
  marker23(a: number , b: number , c: String) {

    const popup = new Mapboxgl.Popup({ className: 'apple-popup' })
      .setHTML('<div><h1 style="color: green; width: 1000px; height: 100px">Location : </h1>' + '<h6 style="text-align: center">' + c + '</h6></div>');
    const marker = new Mapboxgl.Marker(
      {
        color: 'red',
        draggable: false,
      }).setLngLat([a, b])
      .addTo(this.mapboxx);
    marker.getElement().addEventListener('click', function() {
      marker.setPopup(popup);
    });
  }

  EditArea() {
    if ((this.Lngg && this.Latt ) === 0) {
      this.areaForm1.controls['Lng'].setValue(this.id.Lng);
      this.areaForm1.controls['Lat'].setValue(this.id.Lat);
    } else {
      this.areaForm1.controls['Lng'].setValue(this.Lngg);
      this.areaForm1.controls['Lat'].setValue(this.Latt);
    }
    this.areaService.EditArea(this.areaForm1.value , this.id._id).subscribe();

  }
  ChangeAreaLocation() {
    this.changelocation = true;
console.log(this.id._id);
    const decodedHeader = jwt_decode(this.storage.get('token'));
    // @ts-ignore
    this.areaService.getArea(decodedHeader.users._id).subscribe(data => {
      // @ts-ignore
      this.data = data.filter(dataa =>  dataa._id === this.id._id);

      for ( let i = 0; i < this.data.length ; i++) {
        this.marker23(this.data[i].Lng , this.data[i].Lat , this.data[i].name)
      }
    });
    this.mapboxx.flyTo(
      {
        zoom: 8,
        center: [
          9.8480112 ,
          37.3574074
        ],
        essential: true // this animation is considered essential with respect to prefers-reduced-motion
      }
    );
    const popup = new Mapboxgl.Popup();
    popup.setLngLat([9.8480112 , 37.3574074 ]).setHTML('<div><h1 style="color: red"> Select Location</h1></div>').addTo(this.mapboxx);
    this.marker(9.8480112 , 37.3574074  );
  }
}
