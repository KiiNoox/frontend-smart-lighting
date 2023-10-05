import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {User} from '../models/User';
import {Profile} from '../models/Profile';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  public host = '/api/users/';
  public host4 = '/api/License/getBydatefin/';
  public host1 = '/api/users/register';
  public host2 = '/api/users/login';
 public host3 = '/api/License/getLicense/';
  public host5 = '/api/License/ActivatedLicense/';
  constructor(private http: HttpClient) { }


  /******************Register Company****************/
  register(user) {
    console.log(user);
    return this.http.post<User>(this.host1, user);
  }
  registeruser(user) {
    console.log(user);
    return this.http.post<User>(this.host + 'registerUser', user);
  }
  ActivateLicense(id , code) {
    return this.http.get(this.host + 'Addlicense/' + id + '/' + code );
  }
  ActivateLicenseUser(id , code) {
    return this.http.get(this.host + 'Updateuserlicense/' + id + '/' + code );
  }
  VerifLicense(user) {
    console.log(this.host4 + user);
    return this.http.get(this.host4 + user);
  }
  getuser(user) {
    return this.http.get<User[]>(this.host + user);
  }
  VerifFreeLicense(user) {
    return this.http.get(this.host + 'verifuser/' + user);
  }
  Login(user) {
    return this.http.post<User>(this.host2, user);
  }
  ConfirmMail(user) {
    console.log(this.host + 'ConfirmMail/' + user);
    return this.http.put<User>(this.host + 'ConfirmMail/' + user, null);
  }
  SendMailConfirmation(user) {
    console.log(user);
    console.log('*************************')
    return this.http.post<User>(this.host + 'SendMailConfirmation', user);
  }
  TestLicense(Zone) {
    console.log(this.host3  + Zone);
    return this.http.get(this.host3  + Zone);
  }
}
