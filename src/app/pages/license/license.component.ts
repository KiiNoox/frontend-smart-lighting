import {Component, Inject, OnInit} from '@angular/core';
import jwt_decode from 'jwt-decode';
import {LOCAL_STORAGE, WebStorageService} from 'ngx-webstorage-service';
import {AreaService} from '../../Services/area.service';
import {UserService} from '../../Services/user.service';
import {User} from '../../models/User';
import {HttpEvent} from '@angular/common/http';
@Component({
  selector: 'app-license',
  templateUrl: './license.component.html',
  styleUrls: ['./license.component.css']
})
export class LicenseComponent implements OnInit {
  cols: any;
  SearchText: any;
  p = 1;
  code: string;
  valide: true;
  FreeLicense;
  date;
  limite;
  constructor(@Inject(LOCAL_STORAGE) private storage: WebStorageService , public userService: UserService) { }

  ngOnInit(): void {
    if (this.storage.get('limite') === false) {
      this.limite = false;
    }
    if (this.storage.get('limite') === true) {
      this.limite = true;
    }
    const decodedHeader = jwt_decode(this.storage.get('token'));
    // @ts-ignore
    console.log(decodedHeader.users._id);
    this.valide = this.storage.get('ValideLicense');
    // @ts-ignore
    console.log( decodedHeader.users.Date_Creation);
    this.FreeLicense = this.storage.get('freeLicense');
    // @ts-ignore
    this.date = new Date(decodedHeader.users.Date_Creation );
    // @ts-ignore
    this.date.setDate(this.date.getDate() + 14 );
    console.log(  'this.date');
    console.log(  this.date);
    // @ts-ignore
    this.userService.getuser(decodedHeader.users._id).subscribe(data => {
      console.log(data)
      this.cols = data ;
      console.log('----------------------------------');
      console.log(data);
      console.log('----------------------------------');
    });
  }
  ActivatedLicense() {
    console.log(this.code);
    if (this.code !== undefined) {
      console.log(this.code);
      const decodedHeader = jwt_decode(this.storage.get('token'));
      // @ts-ignore
      console.log(decodedHeader.users._id);
      // @ts-ignore
       this.userService.ActivateLicense(decodedHeader.users._id, this.code).subscribe();
      // @ts-ignore
      this.userService.ActivateLicense(decodedHeader.users._id, this.code).subscribe(data => {
console.log(data);
if (data === 'Welcom To LuxBoard') {
  alert(data);
  this.storage.set('ValideLicense', true);
  window.location.reload();
} else {
  alert(data);
}

      } );
    }
  }

}
