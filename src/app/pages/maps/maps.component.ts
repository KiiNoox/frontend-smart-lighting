import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LOCAL_STORAGE, WebStorageService } from 'ngx-webstorage-service';
import * as Mapboxgl from 'mapbox-gl' ;
declare var google: any;

@Component({
  moduleId: module.id,
  selector: 'maps-cmp',
  templateUrl: 'maps.component.html'
})

export class MapsComponent implements OnInit {
  constructor(private router: Router,
    @Inject(LOCAL_STORAGE) private storage: WebStorageService) {
  }
  ngOnInit() {
    if (this.storage.get('token') === undefined) {
      this.router.navigateByUrl('/');
    }
  }
}
