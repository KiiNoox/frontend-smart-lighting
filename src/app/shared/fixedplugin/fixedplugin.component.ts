import {Component, Inject, OnInit} from '@angular/core';
import {UserService} from '../../Services/user.service';
import {FormBuilder} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {LOCAL_STORAGE, WebStorageService} from 'ngx-webstorage-service';
import {TranslateService} from '@ngx-translate/core';

@Component({
    moduleId: module.id,
    selector: 'fixedplugin-cmp',
    templateUrl: 'fixedplugin.component.html'
})

export class FixedPluginComponent implements OnInit{

  public sidebarColor: string = "white";
  public sidebarActiveColor: string = "danger";

  public state: boolean = true;

  changeSidebarColor(color){
    var sidebar = <HTMLElement>document.querySelector('.sidebar');

    this.sidebarColor = color;
    if(sidebar != undefined){
        sidebar.setAttribute('data-color', color);
    }
  }
  changeSidebarActiveColor(color){
    var sidebar = <HTMLElement>document.querySelector('.sidebar');
    this.sidebarActiveColor = color;
    if(sidebar != undefined){
        sidebar.setAttribute('data-active-color', color);
    }
  }
  constructor(public userService: UserService, private formBuilder: FormBuilder, private router: Router,
              @Inject(LOCAL_STORAGE) private storage: WebStorageService , private activatedRoute: ActivatedRoute
              , private translateService: TranslateService) {
  }
  ngOnInit() {}
  changelanguage(Language) {
    this.storage.set('Lng', Language);
    this.translateService.use(this.storage.get('Lng'));
    window.location.reload();
    console.log('aaaa' + this.storage.get('Lng'));
  }
}
