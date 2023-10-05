import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Area} from '../models/Area';
import {Observable, Subject, throwError} from 'rxjs';
import {Ligne} from '../models/Ligne';
import {User} from '../models/User';
import {catchError, tap} from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class AreaService {
  public host = '/api/Area/';
  public host1 = '/api/Area/ADDAREA';
  public host2 = '/api/Area/GetAREA/';
  public host3 = '/api/users/allusers/';
  public host4 = '/api/users/SendMailResetPassword';
  public host5 = '/api/users/ChangePassword/';
  public apitemps = ''
  private _refreshNeeded$ = new Subject<void>();

  get refreshNeeded$() {
    return this._refreshNeeded$;
  }
  constructor(private http: HttpClient) { }

  /******************Register Company****************/
  getallusers(users) {
    return this.http.get<User[]>(this.host3 + users);
  }

  AddArea(area) {
    console.log(area);
    return this.http.post<Area>(this.host1, area);
  }

  EditArea(area , id) {
    return this.http.put<Area>(this.host + id, area);
  }
  /******************Register Company****************/
  getArea(users) {
    return this.http.get<Area[]>(this.host2 + users);
  }

  getAreaById(Id) {
    console.log(this.host + Id);
    return this.http.get<Area[]>(this.host + Id);
  }
  DeleteAreaByid(id) {
    return this.http.delete<Area>(this.host + id).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(error.error.message || 'An error occurred');
      })
    );
  }
  EditAreaStatus(area , id) {
    console.log('slm');
    return this.http.put<Area>(this.host + 'updateAreaStatus/' + id, area);
  }
  apiteamps(Lat , Lng) {

    return this.http.get('https://api.sunrise-sunset.org/json?lat=' + Lat + '&' + 'lng=' + Lng );
  }
  forgotpassword(email) {
    return this.http.post<Area>(this.host4, email);
  }

  changepassword(id , password) {
    return this.http.put<Area>(this.host5 + id, password);
  }
}
