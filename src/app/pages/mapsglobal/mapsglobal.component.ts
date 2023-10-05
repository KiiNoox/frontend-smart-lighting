import { Component, Inject,  OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LOCAL_STORAGE, WebStorageService } from 'ngx-webstorage-service';
import * as Mapboxgl from 'mapbox-gl' ;
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AreaService} from '../../Services/area.service';
import {LignesService} from '../../Services/lignes.service';
import {DevicesService} from '../../Services/devices.service';
import {AutocompleteLibModule} from 'angular-ng-autocomplete';

import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import {Area} from '../../models/Area';
import jwt_decode from 'jwt-decode';
@Component({
  selector: 'app-mapsglobal',
  templateUrl: './mapsglobal.component.html',
  styleUrls: ['./mapsglobal.component.css']
})
export class MapsglobalComponent implements OnInit {

  @ViewChild('autoArea') autoArea;
  @ViewChild('autoLigne') autoLigne;
  @ViewChild('autoDevice') autoDevice;

  mapboxx: Mapboxgl.Map;
  private Lngg = 0;
  private ww: String;
  keyword = 'name';
  LngSearch: number;
  LatSearch: number;
  detailzone = false;
  AreaSelected: number;
  AreaSelected2: number;
  AreaSelected3: number;
  AreaSelected4: number;
  AreaSelected5: number;
  IdLigneSelected: number;
  IdAreaSelected: number;
  private Latt = 0;
  b:boolean=false;
  selectedValue;
  StatusselectedValue;
  connectivitySelectedValue;
  d: any[];
  areaData = [];
  ligneData = [];
  deviceData = [];
  private space: any;
  Devices:any[];
  cols: any[];
  colss: any[];
  colsss: any[];
  colDevice: any[];
  public CurrentArea;
   markers=[]
   markerb = new Mapboxgl.Marker(
    {
      color: 'Black',
      draggable: false,
    });
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
  }

  get Lat() {
    return this.areaForm1.get('Lat');
  }

  constructor(public areaService: AreaService, private formBuilder: FormBuilder, private router: Router,
              @Inject(LOCAL_STORAGE) private storage: WebStorageService, public  lignesService: LignesService,
              public devicesService: DevicesService,
  ) {
  }

  ngOnInit() {
    if (this.storage.get('token') === undefined) {
      this.router.navigateByUrl('/');
    }
    const decodedHeader = jwt_decode(this.storage.get('token'));
// @ts-ignore
    if (decodedHeader.users.role === 'admin') {
      // @ts-ignore
      this.areaService.getArea(decodedHeader.users._id).subscribe(data => {
        this.areaData = data;
      });
      // @ts-ignore
      this.areaService.getArea(decodedHeader.users._id).subscribe(data => {
        this.cols = data;
        for (let i = 0; i < data.length; i++) {
          this.marker2(data[i].Lng, data[i].Lat, data[i].name, data[i].description, data[i].Status)


        }
      });
      // @ts-ignore
      this.lignesService.getLigne(decodedHeader.users._id).subscribe(data => {
        console.log(data);
        for (let i = 0; i < data.length; i++) {
          console.log('*-*-*-*-*-*-*-*-*-*-----****-----');
          console.log(data[i].Status);
          this.marker3(data[i].Lng, data[i].Lat, data[i].name, data[i].description, data[i].Status)


        }
      });
      // @ts-ignore
      this.devicesService.getDevicesWithoutData(decodedHeader.users._id).subscribe(data => {
        //@ts-ignore
        this.d = data;
        console.log(this.d)
        for (let i = 0; i < this.d.length; i++) {
          this.marker4(this.d[i].Lng, this.d[i].Lat,    this.d[i].name,    this.d[i].description,    this.d[i].Status)


        }
      });
}
 else {
      // @ts-ignore
      this.areaService.getArea(decodedHeader.users.useractive).subscribe(data => {
        this.areaData = data;
      });
      // @ts-ignore
      this.areaService.getArea(decodedHeader.users.useractive).subscribe(data => {
        this.cols = data;
        for (let i = 0; i < data.length; i++) {
          this.marker2(data[i].Lng, data[i].Lat, data[i].name, data[i].description, data[i].Status)


        }
      });
      // @ts-ignore
      this.lignesService.getLigne(decodedHeader.users.useractive).subscribe(data => {
        console.log(data);
        for (let i = 0; i < data.length; i++) {
          console.log('*-*-*-*-*-*-*-*-*-*-----****-----');
          console.log(data[i].Status);
          this.marker3(data[i].Lng, data[i].Lat, data[i].name, data[i].description, data[i].Status)


        }
      });
      // @ts-ignore
      this.devicesService.GetAllDevice(decodedHeader.users.useractive).subscribe(data => {
        for (let i = 0; i < data.length; i++) {
          this.marker4(data[i].Lng, data[i].Lat, data[i].name, data[i].description, data[i].Status)


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
      container: 'map-mapglobal',
      style: 'mapbox://styles/mapbox/satellite-v9',
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

    this.mapboxx.on('load', () => {
      this.mapboxx.addSource('route', {
        'type': 'geojson',
        'data': {
          'type': 'Feature',
          'properties': {},
          'geometry': {
            'type': 'LineString',
            'coordinates': [
              [36.7420411, 10.2504764],
              [36.7420411, 10.2504765]

            ]
          }
        }
      });
      this.mapboxx.addLayer({
        'id': 'route',
        'type': 'line',
        'source': 'route',
        'layout': {
          'line-join': 'round',
          'line-cap': 'round'
        },
        'paint': {
          'line-color': '#888',
          'line-width': 8
        }
      });
    });
  }

  marker2(a: number, b: number, c: String, d: String, e: String) {
    const popup = new Mapboxgl.Popup({className: 'apple-popup'})
      .setLngLat([a, b])
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
    marker.getElement().addEventListener('click', function () {
      marker.setPopup(popup);
    });
    this.markers.push(marker);
  }

  marker3(a: number, b: number, c: String, d: String, e: String) {
    const popup = new Mapboxgl.Popup({className: 'apple-popup'})
      .setLngLat([a, b])
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
        color: 'Blue',
        draggable: false,
      }).setLngLat([a, b])
      .addTo(this.mapboxx);
    marker.getElement().addEventListener('click', function () {
      marker.setPopup(popup);
    });
    this.markers.push(marker);
  }
  marker4(a: number, b: number, c: String, d: String, e: String) {
    this.detailzone = false;
    const popup = new Mapboxgl.Popup({className: 'apple-popup'})
      .setLngLat([a, b])
      .setHTML('<div style="background-color: #8BD2D1;">' +
        '<h6 style="color: white;">Location Name : </h6></div>'
        + '<h6 style="text-align: center; color: black">' + c + '</h6>' +
        '<div style="background-color: #8BD2D1;">' +
        '<h6 style="color: white;">Location Description : </h6></div>'
        + '<h6 style="text-align: center; color: black">' + d + '</h6>' +
        '<div style="background-color: #8BD2D1;">' +
        '<h6 style="color: white;">Location Status :  </h6></div>' +
         '<h6 style="text-align: center; color: black">' + e + '</h6>' );
    // this.markerb.setLngLat([a, b])
    //   .addTo(this.mapboxx);


    /*this.markerb.getElement().addEventListener('click', function () {
      this.markerb.setPopup(popup);
    });*/
    const marker = new Mapboxgl.Marker(
      {
        color: 'Yellow',
        draggable: false,
      }).setLngLat([a, b])
      .addTo(this.mapboxx);
    marker.getElement().addEventListener('click', function () {
      marker.setPopup(popup);
    });
    this.markers.push(marker);
  }
  selectEvent(item) {
    this.b=false
    this.IdAreaSelected = item._id;
    this.LatSearch = item.Lat;
    this.LngSearch = item.Lng;
    this.lignesService.getLigneByAreaId(this.IdAreaSelected).subscribe(data => {
      this.ligneData = data;
    });
  }
  selectEvent2(item) {
    this.b=false
    console.log(item.Lng);
    console.log(item.Lat);
    this.ligneData=item.name;
    this.LatSearch = item.Lat;
    this.LngSearch = item.Lng;
    this.devicesService.GetDeviceByLigneId(item._id).subscribe(data => {
      this.deviceData = data;
    });
  }
  selectEvent3(item) {
    this.b=false
    this.IdAreaSelected = item._id;
    this.LatSearch = item.Lat;
    this.LngSearch = item.Lng;
    this.lignesService.getLigneByAreaId(this.IdAreaSelected).subscribe(data => {
      this.ligneData = data;
    });
  }


  Search() {
    let data=this.d;
   let  newMarkers=[]
    this.markers.forEach(marker => {
      marker.remove();
    });
    newMarkers=[]
    if (this.selectedValue !== undefined &&  this.StatusselectedValue === undefined && this.connectivitySelectedValue === undefined) {
      data= this.d.filter(u => u.alert == this.selectedValue);
    }
    if (this.selectedValue === undefined &&  this.StatusselectedValue !== undefined && this.connectivitySelectedValue === undefined) {
      data= this.d.filter(u => u.Status === this.StatusselectedValue);
    }
    if (this.selectedValue === undefined &&  this.StatusselectedValue === undefined && this.connectivitySelectedValue !== undefined) {
      data= this.d.filter(u => u.connectivityAlert == this.connectivitySelectedValue);
    }

    if (this.selectedValue !== undefined &&  this.StatusselectedValue !== undefined && this.connectivitySelectedValue === undefined) {
      data= this.d.filter(u => u.alert == this.selectedValue && u.Status == this.StatusselectedValue);
    }
    if (this.selectedValue !== undefined &&  this.StatusselectedValue === undefined && this.connectivitySelectedValue !== undefined) {
      data= this.d.filter(u => u.alert == this.selectedValue && u.connectivityAlert == this.connectivitySelectedValue);
    }
    if (this.selectedValue === undefined &&  this.StatusselectedValue !== undefined && this.connectivitySelectedValue !== undefined) {
      data= this.d.filter(u => u.Status == this.StatusselectedValue && u.connectivityAlert == this.connectivitySelectedValue);
    }

    if (this.selectedValue !== undefined &&  this.StatusselectedValue !== undefined && this.connectivitySelectedValue !== undefined) {
      data= this.d.filter(u => u.alert == this.selectedValue && u.Status == this.StatusselectedValue && u.connectivityAlert == this.connectivitySelectedValue);
    }
    for (let i = 0; i < data.length; i++) {
      this.detailzone = false;
      const popup = new Mapboxgl.Popup({className: 'apple-popup'})
        .setLngLat([data[i].Lng, data[i].Lat])
        .setHTML('<div style="background-color: #8BD2D1;">' +
          '<h6 style="color: white;">Location Name : </h6></div>'
          + '<h6 style="text-align: center; color: black">' + data[i].name + '</h6>' +
          '<div style="background-color: #8BD2D1;">' +
          '<h6 style="color: white;">Location Description : </h6></div>'
          + '<h6 style="text-align: center; color: black">' + data[i].description + '</h6>' +
          '<div style="background-color: #8BD2D1;">' +
          '<h6 style="color: white;">Location Status :  </h6></div>' +
           '<h6 style="text-align: center; color: black">' + data[i].Status + '</h6>' );


        const marker = new Mapboxgl.Marker(
          {
            color: 'Black',
            draggable: false,
          }).setLngLat([data[i].Lng, data[i].Lat])
          .addTo(this.mapboxx);
        marker.getElement().addEventListener('click', function () {
          marker.setPopup(popup);
        });
        newMarkers.push(marker);
    
      console.log(data[i].name)
    }
    this.markers.forEach(marker => {
      marker.remove();
    });
    newMarkers.forEach(marker => {
      marker.remove();
     });
    console.log(newMarkers)


  
    setTimeout(() => {
      newMarkers.forEach(marker => {
        marker.addTo(this.mapboxx);
      
    });
    }, 250);
 
    try{
    if ( this.b==true){
      this.mapboxx.flyTo(
        {
          zoom: 7,
          center: [
            this.LngSearch,
            this.LatSearch
          ],
          essential: true 
        }
      );
    }
    else{
    this.mapboxx.flyTo(
      {
        zoom: 15,
        center: [
          this.LngSearch,
          this.LatSearch
        ],
        essential: true 
      }
    );}
  }
    catch(e)
    {
    }
  }


  reload(){

    this.markers.forEach(marker => {
      marker.addTo(this.mapboxx);
  });
  console.log(this.ligneData)

    this.selectedValue=undefined
    this.StatusselectedValue=undefined
    this.b=true
    console.log(this.ligneData)
    this.autoArea.clear();
    this.autoLigne.clear();
    this.autoDevice.clear();



  }
  refresh() {
    const decodedHeader = jwt_decode(this.storage.get('token'));
    // @ts-ignore
    this.devicesService.GetAllDevice(decodedHeader.users._id).subscribe(data => {
      this.d = data;
    });

  }
 

  satelite() {
    this.mapboxx.setStyle('mapbox://styles/mapbox/satellite-v9');
  }
  stylestreet() {
    this.mapboxx.setStyle('mapbox://styles/mapbox/streets-v11');
  }
}
