import {Component, Inject, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {LOCAL_STORAGE, WebStorageService} from 'ngx-webstorage-service';
import jwt_decode from 'jwt-decode';
import {translate} from '@angular/localize/src/translate';


export interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
    role: any;
}
export const ROUTES: RouteInfo[] = [
    { path: '/dashboard',     title: 'Dashboard' ,         icon: 'nc-bank',       class: '' ,  role: ['admin', 'user'] },
    { path: '/Area',       title: 'Sites Manager',    icon: 'nc-layout-11',  class: '' , role: ['admin', 'user'] },
    { path: '/Ligne',       title: 'Lines Manager',    icon: 'nc-layout-11',  class: '', role: ['admin', 'user'] },
    { path: '/device',       title: 'Streetlights',    icon: 'nc-bulb-63',  class: '', role: ['admin', 'user'] },
    { path: '/StreetLightMaps',       title: 'Maps',    icon: 'nc-pin-3',  class: '', role: ['admin', 'user'] },
    { path: '/Inventory',       title: 'Dimming Manager',    icon: 'nc-settings-gear-65',  class: '', role: ['admin'] },
    { path: '/User',       title: 'User Manager',    icon: 'nc-settings-gear-65',  class: '', role: ['admin'] },
    { path: '/License',       title: 'License Manager',    icon: 'nc-settings-gear-65',  class: '', role: ['admin'] },
   
];

@Component({
    moduleId: module.id,
    selector: 'sidebar-cmp',
    templateUrl: 'sidebar.component.html',
})

export class SidebarComponent implements OnInit {
    public menuItems: any[];
  public isCollapsed = true;
  public role: string;
  constructor(private router: Router, @Inject(LOCAL_STORAGE) private storage: WebStorageService) {
  }
    ngOnInit() {
      const decodedHeader = jwt_decode(this.storage.get('token'));
        // @ts-ignore
      this.role = decodedHeader.users.role;
        this.menuItems = ROUTES.filter(menuItem =>
          (menuItem.role[0] === this.role || menuItem.role[1] === this.role));
      this.router.events.subscribe((event) => {
        this.isCollapsed = true;
      });
    }
}
