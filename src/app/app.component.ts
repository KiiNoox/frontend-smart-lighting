import {Component, Inject} from '@angular/core';
import {UserService} from './Services/user.service';
import {FormBuilder} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {LOCAL_STORAGE, WebStorageService} from 'ngx-webstorage-service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  constructor(  @Inject(LOCAL_STORAGE) private storage: WebStorageService , private translateService: TranslateService) {
    this.translateService.setDefaultLang('en');
    this.translateService.use(this.storage.get('Lng'));
  }

}
