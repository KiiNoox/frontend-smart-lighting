import {Component, Input, OnInit} from '@angular/core';
import * as Mapboxgl from 'mapbox-gl';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AreaService} from '../../Services/area.service';
import {LignesService} from '../../Services/lignes.service';
import {DevicesService} from '../../Services/devices.service';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.css']
})
export class LocationComponent implements OnInit {
  keyword = 'name';
  private Latt = 0;
  @Input() public id;
  private Lngg = 0;
  private test = false;
  public edited = true;
  mapboxx:  Mapboxgl.Map;
  IdLigneSelected: number;
  IdAreaSelected: number;
  Lignedata = [];
  data = [];
  constructor(private dialog: NgbModal , public areaService: AreaService ,
              public ligneService: LignesService , public devicesService: DevicesService) { }

  ngOnInit(): void {
    (Mapboxgl as any).accessToken = 'pk.eyJ1IjoibWFyd2VuYmVuYWJkZWxsYXRpZiIsImEiOiJja2xvN3l4Z3owZ2d5MnZxbTBxaG0ydGQyIn0.anOW2Yn2gef3_qc8w7BnFg';

    if (Mapboxgl.getRTLTextPluginStatus() !== 'loaded') {
      Mapboxgl.setRTLTextPlugin(
        'https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.3/mapbox-gl-rtl-text.js',
        null,
        true // Lazy load the plugin
      );
    }
    this.mapboxx = new Mapboxgl.Map({
      container: 'map-mapboxLocation',
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
    const popup = new Mapboxgl.Popup();
    this.marker(this.id.Lng ,  this.id.Lat  );
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
}
