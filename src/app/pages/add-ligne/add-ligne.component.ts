import {Component, EventEmitter, Inject, OnInit, Output} from '@angular/core';
import * as Mapboxgl from 'mapbox-gl';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AreaService} from '../../Services/area.service';
import {LignesService} from '../../Services/lignes.service';
import {DevicesService} from '../../Services/devices.service';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import {NotificationsService} from 'angular2-notifications';
import {LOCAL_STORAGE, WebStorageService} from 'ngx-webstorage-service';
import jwt_decode from 'jwt-decode';
import * as mapboxgl from 'mapbox-gl';
@Component({
  selector: 'app-add-ligne',
  templateUrl: './add-ligne.component.html',
  styleUrls: ['./add-ligne.component.css']
})
export class AddLigneComponent implements OnInit {
  keyword = 'name';
  private Latt = 0;
  private Lngg = 0;
  private test = false;
  public edited = true;
  mapboxx:  Mapboxgl.Map;
  IdLigneSelected: number;
  IdAreaSelected: number;
  Lignedata = [];
  data = [];
  public el = new mapboxgl.Marker();
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  areaForm1 = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    Area: new FormControl('', [Validators.required]),
    Lng: new FormControl('', [Validators.required]),
    Lat: new FormControl('', [Validators.required]),
    Device: new FormControl(null, [Validators.required]),
    Status: new FormControl('activated', [Validators.required]),
    users: new FormControl('', [Validators.required]),

  });

  get name() {
    return this.areaForm1.get('name');
  }

  get description() {
    return this.areaForm1.get('description');
  }
  get area() {
    return this.areaForm1.get('area');
  }
  get Lng() {
    return this.areaForm1.get('Lng');
  } get Lat() {
    return this.areaForm1.get('Lat');
  }
  constructor(private dialog: NgbModal , public areaService: AreaService ,
              public ligneService: LignesService , public devicesService: DevicesService  , private service: NotificationsService ,
              @Inject(LOCAL_STORAGE) private storage: WebStorageService) { }

  ngOnInit(): void {
    const decodedHeader = jwt_decode(this.storage.get('token'));
    // @ts-ignore
    this.areaService.getArea(decodedHeader.users._id).subscribe(data => {
      this.data = data;
      for ( let i = 0; i < data.length ; i++) {
        this.marker2(data[i].Lng , data[i].Lat , data[i].name, data[i].description, data[i].Status)
      }
    });
    // @ts-ignore
    this.ligneService.getLigne(decodedHeader.users._id).subscribe(data => {
      for ( let i = 0; i < data.length ; i++) {
        this.marker3(data[i].Lng , data[i].Lat , data[i].name, data[i].description, data[i].Status)
      }
    });
    (Mapboxgl as any).accessToken = 'pk.eyJ1IjoibWFyd2VuYmVuYWJkZWxsYXRpZiIsImEiOiJja2xvN3l4Z3owZ2d5MnZxbTBxaG0ydGQyIn0.anOW2Yn2gef3_qc8w7BnFg';

    if (Mapboxgl.getRTLTextPluginStatus() !== 'loaded') {
      Mapboxgl.setRTLTextPlugin(
        'https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.3/mapbox-gl-rtl-text.js',
        null,
        true // Lazy load the plugin
      );
    }
    this.mapboxx = new Mapboxgl.Map({
      container: 'map-mapboxLigne',
      style: 'mapbox://styles/mapbox/streets-v11',
      zoom: 7,
      center: [9.8480112, 37.3574074]
    });
    const geocoder = new MapboxGeocoder({
      accessToken: 'pk.eyJ1IjoibWFyd2VuYmVuYWJkZWxsYXRpZiIsImEiOiJja2xvN3l4Z3owZ2d5MnZxbTBxaG0ydGQyIn0.anOW2Yn2gef3_qc8w7BnFg',
      mapboxgl: Mapboxgl, // Set the mapbox-gl instance
      marker: false, // Do not use the default marker style
    });
    this.mapboxx.addControl(geocoder);
    const nav = new Mapboxgl.NavigationControl();
    this.mapboxx.addControl(nav);
    this.mapboxx.addControl(
      new Mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        trackUserLocation: true
      })
    );
    const popup = new Mapboxgl.Popup();
    popup.setLngLat([9.8480112 , 37.3574074 ]).setHTML('<div><h6 style="color: red"> Select Location</h6></div>').addTo(this.mapboxx);
    this.markerx();
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
  marker2(a: number , b: number , c: String, d: String, e: String) {

    const popup = new Mapboxgl.Popup({ className: 'apple-popup' })
      .setHTML('<div style="background-color: #8BD2D1;">' +
        '<h6 style="color: white;">Location Name : </h6></div>'
        + '<h6 style="text-align: center; color: black">' + c + '</h6>' +
        '<div style="background-color: #8BD2D1;">' +
        '<h6 style="color: white;">Location Description : </h6></div>'
        + '<h6 style="text-align: center; color: black">' + d + '</h6>' +
        '<div style="background-color: #8BD2D1;">' +
        '<h6 style="color: white;">Location Status :  </h6></div>' +
        '<h6 style="text-align: center; color: black">' + e + '</h6>' );
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



  marker3(a: number , b: number , c: String, d: String, e: String) {

    const popup = new Mapboxgl.Popup({ className: 'apple-popup' })
      .setHTML('<div style="background-color: #8BD2D1;">' +
        '<h6 style="color: white;">Location Name : </h6></div>'
        + '<h6 style="text-align: center; color: black">' + c + '</h6>' +
        '<div style="background-color: #8BD2D1;">' +
        '<h6 style="color: white;">Location Description : </h6></div>'
        + '<h6 style="text-align: center; color: black">' + d + '</h6>' +
        '<div style="background-color: #8BD2D1;">' +
        '<h6 style="color: white;">Location Status :  </h6></div>' +
        '<h6 style="text-align: center; color: black">' + e + '</h6>' );
    const marker = new Mapboxgl.Marker(
      {
        color: 'blue',
        draggable: false,
      }).setLngLat([a, b])
      .addTo(this.mapboxx);
    marker.getElement().addEventListener('click', function() {
      marker.setPopup(popup);
    });
  }


  selectEvent(item) {
    // do something with selected item
    console.log(item._id);
    this.areaForm1.controls['Area'].setValue(item._id);

  }

  onChangeSearch(val: string) {
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.

  }

  onFocused(e) {

    // do something when input is focused
  }
  markerx() {
    this.mapboxx.on('click', hello => {
      this.Lngg = hello.lngLat.lng;
      this.Latt = hello.lngLat.lat;
      this.el.setLngLat([hello.lngLat.lng, hello.lngLat.lat]) .addTo(this.mapboxx);

    });
  }
  OnSuccess() {
    console.log('ezarrrrrrrrrrrrrrrrrrr')
    this.service.success('Success', 'Line added successfully', {
      position: ['bottom', 'right'],
      timeOut: 2000,
      animate: 'fade',
      showProgressBar: true,
    })
  }

  addLigne() {
    if (this.areaForm1.controls['name'].valid && this.areaForm1.controls['description'].valid && this.areaForm1.controls['Area'].valid) {
      if (this.Lngg !== 0 && this.Latt !== 0) {
        this.areaForm1.controls['Lng'].setValue(this.Lngg);
        this.areaForm1.controls['Lat'].setValue(this.Latt);
        const decodedHeader = jwt_decode(this.storage.get('token'));
        // @ts-ignore
        this.areaForm1.controls['users'].setValue(decodedHeader.users._id);
        console.log(this.areaForm1.value);
        this.ligneService.AddLigne(this.areaForm1.value).subscribe(
          success => {
            this.passEntry.emit(this.areaForm1.value);

          }
        );
        this.dialog.dismissAll();
      } else {
        alert('You must Select a place !');
      }
    } else {
      alert('You must fill all the fields !');
    }
  }
  satelite() {
    console.log('zzzz');
    this.mapboxx.setStyle('mapbox://styles/mapbox/satellite-v9');
  }
  stylestreet() {
    this.mapboxx.setStyle('mapbox://styles/mapbox/streets-v11');
  }
}
