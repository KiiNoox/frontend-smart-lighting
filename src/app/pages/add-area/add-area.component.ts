import {Component, EventEmitter, Inject, OnInit, Output} from '@angular/core';
import * as Mapboxgl from 'mapbox-gl';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AreaService} from '../../Services/area.service';
import {LignesService} from '../../Services/lignes.service';
import {DevicesService} from '../../Services/devices.service';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import {NotificationsService} from 'angular2-notifications';
import jwt_decode from 'jwt-decode';
import {LOCAL_STORAGE, WebStorageService} from 'ngx-webstorage-service';
import * as mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-add-area',
  templateUrl: './add-area.component.html',
  styleUrls: ['./add-area.component.css']
})
export class AddAreaComponent implements OnInit {
  keyword = 'name';
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
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
  areaForm1 = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    Lng: new FormControl('', [Validators.required]),
    Lat: new FormControl('', [Validators.required]),
    Ligne: new FormControl(null, [Validators.required]),
    Status: new FormControl('activated', [Validators.required]),
    users: new FormControl('', [Validators.required]),
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
               public ligneService: LignesService , public devicesService: DevicesService , private service: NotificationsService
               , @Inject(LOCAL_STORAGE) private storage: WebStorageService) { }

  ngOnInit(): void {
    console.log(this.Latt);
    console.log(this.Lngg);
    const decodedHeader = jwt_decode(this.storage.get('token'));

    // @ts-ignore
    this.areaService.getArea(decodedHeader.users._id).subscribe(data => {
      this.data = data;
      for ( let i = 0; i < data.length ; i++) {
        this.marker2(data[i].Lng , data[i].Lat , data[i].name, data[i].description, data[i].Status)
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
      container: 'map-mapboxxxxxxx',
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
    popup.setLngLat([9.8480112 , 37.3574074 ]).setHTML('<div><h6 style="color: red">Select Location</h6></div>').addTo(this.mapboxx);
    this.markerx();
  }
  addDevice() {
    console.log(this.Lngg);
    console.log(this.Latt);
    const popup = new Mapboxgl.Popup();
    popup.setLngLat([this.Lngg , this.Latt ])
      .setHTML('<div><h6 style="color: red"> Select Location</h6></div>').addTo(this.mapboxx);
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
  OnSuccess() {
    console.log('ezarrrrrrrrrrrrrrrrrrr')
    this.service.success('Success', 'area added successfully', {
      position: ['bottom', 'right'],
      timeOut: 2000,
      animate: 'fade',
      showProgressBar: true,
    })
  }
  markerx() {
    this.mapboxx.on('click', hello => {
      this.Lngg = hello.lngLat.lng;
      this.Latt = hello.lngLat.lat;
      this.el.setLngLat([hello.lngLat.lng, hello.lngLat.lat]) .addTo(this.mapboxx);

    });
  }
  addDevices() {
    if (this.areaForm1.controls['name'].valid && this.areaForm1.controls['description'].valid) {
      if (this.Lngg !== 0 && this.Latt !== 0) {
      this.areaForm1.controls['Lng'].setValue(this.Lngg);
      this.areaForm1.controls['Lat'].setValue(this.Latt);
      const decodedHeader = jwt_decode(this.storage.get('token'));
      // @ts-ignore
      this.areaForm1.controls['users'].setValue(decodedHeader.users._id);
      this.areaService.AddArea(this.areaForm1.value).subscribe(success => {
        this.passEntry.emit(this.areaForm1.value);

      });
      this.dialog.dismissAll();
      // location.reload();
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
