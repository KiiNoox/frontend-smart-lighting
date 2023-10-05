import {Component, OnInit, Renderer2, ViewChild, ElementRef, Inject} from '@angular/core';
import { ROUTES } from '../../sidebar/sidebar.component';
import { Router } from '@angular/router';
import { Location} from '@angular/common';
import {LocationComponent} from '../../pages/location/location.component';
import {ProfileuserComponent} from '../../profileuser/profileuser.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AreaService} from '../../Services/area.service';
import {FormBuilder} from '@angular/forms';
import {LOCAL_STORAGE, WebStorageService} from 'ngx-webstorage-service';
import {LignesService} from '../../Services/lignes.service';
import {DevicesService} from '../../Services/devices.service';
import {NotificationsService} from 'angular2-notifications';
import {UserService} from '../../Services/user.service';
import jwt_decode from 'jwt-decode';


@Component({
    moduleId: module.id,
    selector: 'navbar-cmp',
    templateUrl: 'navbar.component.html',
    styleUrls: ['./navbar.component.css']

})

export class NavbarComponent implements OnInit{
    private listTitles: any[];
    location: Location;
    private nativeElement: Node;
    private toggleButton;
    private sidebarVisible: boolean;
  p = 1;
  px: number;
  SearchText: string;
  private Lngg = 0;
  response: any;
  private ww: String;
  Devices: any[];
  private Latt = 0;
  private space: any;
  cols: any[];
  colss: any[];
  colsss: any[];
  colDevice: any[];
  public CurrentArea;
  Errurfilter = false ;
  selectedValue;
  BatteryLevelselectedValue;
  StatusselectedValue;
  role = false;
  nbalert = 0;
  alert=false;
  nbConnectibvityAlert = 0;
  luminosite = 70;
    public isCollapsed = true;
    @ViewChild("navbar-cmp", {static: false}) button;

    constructor(location: Location, private renderer : Renderer2, private element: ElementRef,
                private dialog: NgbModal , public areaService: AreaService,
                private formBuilder: FormBuilder, private router: Router,
                @Inject(LOCAL_STORAGE) private storage: WebStorageService , public  lignesService: LignesService ,
                public devicesService: DevicesService ,
                private service: NotificationsService , public userService: UserService) {
        this.location = location;
        this.nativeElement = element.nativeElement;
        this.sidebarVisible = false;
    }

    ngOnInit(){
      const decodedHeader = jwt_decode(this.storage.get('token'));

        this.listTitles = ROUTES.filter(listTitle => listTitle);
        var navbar : HTMLElement = this.element.nativeElement;
        this.toggleButton = navbar.getElementsByClassName('navbar-toggle')[0];
        this.router.events.subscribe((event) => {
          this.sidebarClose();
       });
       //@ts-ignore
       console.log("role",decodedHeader.users.role)
      // @ts-ignore
      if (decodedHeader.users.role === 'admin') {
        // @ts-ignore
        this.onffiche(decodedHeader.users._id);
      } else {
        // @ts-ignore
        this.onffiche(decodedHeader.users.useractive);
      }
    }
  onffiche(users) {

    this.devicesService.getDevicesWithoutData(users).subscribe(data => {
      //@ts-ignore
      this.Devices = data;
     // this.Devices = this.Devices.filter(u => u.connectivityAlert == 1)
      this.nbConnectibvityAlert = this.Devices.filter(u => u.connectivityAlert == 1).length;
      this.nbalert = this.Devices.filter(u => u.alert == 1).length;
      this.alert= (this.nbConnectibvityAlert>0||this.nbalert>0)
    });

  }
    getTitle(){
      var titlee = this.location.prepareExternalUrl(this.location.path());
      if(titlee.charAt(0) === '#'){
          titlee = titlee.slice( 1 );
      }
      for(var item = 0; item < this.listTitles.length; item++){
          if(this.listTitles[item].path === titlee){
              return this.listTitles[item].title;
          }
      }
      return 'Dashboard';
    }
    deconnection() {
      localStorage.removeItem('token');
      localStorage.removeItem('ValideLicense');
      localStorage.removeItem('nbdedevice');
      localStorage.removeItem('LicenseDeviceAllowed');
      localStorage.removeItem('limite');
      this.router.navigateByUrl('/');
    }
    sidebarToggle() {
        if (this.sidebarVisible === false) {
            this.sidebarOpen();
        } else {
            this.sidebarClose();
        }
      }
      sidebarOpen() {
          const toggleButton = this.toggleButton;
          const html = document.getElementsByTagName('html')[0];
          const mainPanel =  <HTMLElement>document.getElementsByClassName('main-panel')[0];
          setTimeout(function(){
              toggleButton.classList.add('toggled');
          }, 500);

          html.classList.add('nav-open');
          if (window.innerWidth < 991) {
            mainPanel.style.position = 'fixed';
          }
          this.sidebarVisible = true;
      };
      sidebarClose() {
          const html = document.getElementsByTagName('html')[0];
          const mainPanel =  <HTMLElement>document.getElementsByClassName('main-panel')[0];
          if (window.innerWidth < 991) {
            setTimeout(function(){
              mainPanel.style.position = '';
            }, 500);
          }
          this.toggleButton.classList.remove('toggled');
          this.sidebarVisible = false;
          html.classList.remove('nav-open');
      };
      collapse(){
        this.isCollapsed = !this.isCollapsed;
        const navbar = document.getElementsByTagName('nav')[0];
        console.log(navbar);
        if (!this.isCollapsed) {
          navbar.classList.remove('navbar-transparent');
          navbar.classList.add('bg-white');
        } else{
          navbar.classList.add('navbar-transparent');
          navbar.classList.remove('bg-white');
        }

      }
  profile() {
    const modalRef = this.dialog.open(ProfileuserComponent , { size: 'lg',
      backdrop: 'static',
      windowClass: 'custom-class',
    });
  }
}
