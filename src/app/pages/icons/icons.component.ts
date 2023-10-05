import {Component, Inject} from '@angular/core';
import {LOCAL_STORAGE, WebStorageService} from 'ngx-webstorage-service';
import {UserService} from '../../Services/user.service';
import {FormBuilder} from '@angular/forms';
import {Router} from '@angular/router';@Component({
  // tslint:disable-next-line:component-selector
    selector: 'icons-cmp',
    moduleId: module.id,
    templateUrl: 'icons.component.html'
})

export class IconsComponent {
  constructor( private router: Router,
               @Inject(LOCAL_STORAGE) private storage: WebStorageService) {
  }
  // tslint:disable-next-line:use-lifecycle-interface
  ngOnInit() {
    console.log(this.storage.get('token'));
    if (this.storage.get('token') === undefined) {
      this.router.navigateByUrl('/');
    }}
}
