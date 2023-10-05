import {Inject, Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router} from '@angular/router';
import { Observable } from 'rxjs';
import {LOCAL_STORAGE, WebStorageService} from 'ngx-webstorage-service';
import jwt_decode from 'jwt-decode';
import {UserService} from './Services/user.service';

@Injectable({
  providedIn: 'root'
})
export class MyguadGuard implements CanActivate {
  public test;
  public total = 0;
  public total0 = 0;
  public validee = false;
  public testt;
  constructor( @Inject(LOCAL_STORAGE) private storage: WebStorageService , private router: Router, public userService: UserService ) {};

  canActivate() {
    // @ts-ignore
    const decodedHeader = jwt_decode(this.storage.get('token'));
    console.log('*************************************');
    // @ts-ignore
    console.log(decodedHeader.users.license);
    // @ts-ignore
    this.userService.VerifFreeLicense(decodedHeader.users._id).subscribe(data2 => {
      // @ts-ignore
      console.log('wwwwwwwwwwwwwwwwwww');
      console.log(data2);
      this.storage.set('freeLicense', data2);
    });
    // @ts-ignore
    if (decodedHeader.users.license.length === 0) {
      this.storage.set('ValideLicense', false);
      const freeLicensee = this.storage.get('freeLicense');
      console.log(freeLicensee)
      if (freeLicensee < 14) {
        this.storage.set('LicenseDeviceAllowed', 10);
        return true;
      } else {
        this.router.navigate(['/License']);
        console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaa');
        return false;
      }
    } else {
      // @ts-ignore
      this.userService.getuser(decodedHeader.users._id).subscribe(data => {
        // @ts-ignore
        for (let i = 0; i < data.license.length; i++) {
          // @ts-ignore
          if (data.license[i].limite === false) {
            this.storage.set('limite', false);
          }
          // @ts-ignore
          if (data.license[i].limite === true) {
            this.storage.set('limite', true);
          }
          // @ts-ignore
          if (data.license[i].device >= this.total0) {
            // @ts-ignore
            this.total0 = data.license[i].device;
          }
          // @ts-ignore
          if (data.license[i].Valide === true) {
            // @ts-ignore
            this.total = data.license[i].device + this.total;
            console.log('yes');
          }
          // @ts-ignore
          if (data.license[i].Valide === false) {
            this.testt = true;
          }
        }
      });
      if (this.testt === true) {
        if ((this.total - this.total0) >= this.total0) {

          this.storage.set('ValideLicense', true);
          this.storage.set('LicenseDeviceAllowed', this.total);
          this.total0 = 0;
          this.total = 0;
        } else {
          this.storage.set('ValideLicense', false);
          this.total0 = 0;
          this.total = 0;
        }
      } else {
        this.storage.set('ValideLicense', true);
        this.storage.set('LicenseDeviceAllowed', this.total);
        this.total0 = 0;
        this.total = 0;
      }
    }
    // @ts-ignore
    this.userService.VerifFreeLicense(decodedHeader.users._id).subscribe(data2 => {
      // @ts-ignore
      console.log('wwwwwwwwwwwwwwwwwww');
      console.log(data2);
      this.storage.set('freeLicense', data2);
    });
    const decodedHeader2 = this.storage.get('ValideLicense');
    console.log(decodedHeader2);
    const freeLicense = this.storage.get('freeLicense');
    console.log('wwwwwwwwwwwwwwwwwww2');
    console.log(freeLicense);
    if (this.storage.get('limite') === false) {
      return true;
    } else {
    if (decodedHeader2 === false) {
      if (freeLicense < 14) {
        this.storage.set('LicenseDeviceAllowed', 10);
        return true;
      } else {
        this.router.navigate(['/License']);
        console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaa');
        return false;
      }
    } else {
      console.log('bbbbbbbbbbbbbbbbb2');
      return true;
    }
  }
  }
}
