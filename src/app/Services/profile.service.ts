import { Injectable } from '@angular/core';
import {Ligne} from '../models/Ligne';
import {Profile} from '../models/Profile';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Area} from '../models/Area';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  public host = '/api/Profile/';
  public host1 = '/api/Area/';
  public host2 = '/api/Ligne/';
  public host3 ='/api/LocationProfile/'

  constructor(private http: HttpClient) { }
  AddProfile(profile) {
    console.log(profile);
    return this.http.post<Profile>(this.host + 'ADDProfile', profile);
  }
  deleteLigneFromProfile(profile, idLigne) {
    return this.http.put<Profile>(this.host2 + 'removeLigneFromProfile/' + idLigne, profile);
  }
  EditProfile(ligne , id) {
    return this.http.put<Profile>(this.host + id, ligne);
  }
  getProfile(users) {
    return this.http.get<Profile[]>(this.host + 'GetProfile/' + users);
  }
  getAllProfiles(){
    return this.http.get<Profile[]>(this.host+'getProfiles')
  }
  DeleteProfileByid(id) {
    return this.http.delete<Profile>(this.host + id).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(error.error.message || 'An error occurred');
      })
    );
  }
  // AsseignProfile(assignedProfile) {
  //   console.log(assignedProfile,"aaaaaaaaaaaaaaaaaaaaaaaaaaaaa")

  //   return this.http.post(this.host3 + 'AsseignProfile',assignedProfile);
  // }
  EditAsseignProfileToArea(profile , id) {
    return this.http.put<Profile>(this.host1 + 'AsseignProfileToArea/' + id, profile);
  }
  EditAsseignProfileToLigne(profile , id) {
    return this.http.put<Profile>(this.host2 + 'affecteProfileToLigne/' + id, profile);

  }
  getLigneByprofile(id) {
    return this.http.get<Profile[]>(this.host2 + 'GetLigneByProfile/' + id);
  }
  getAreaByprofile(id) {
    return this.http.get<Profile[]>(this.host1 + 'GetAREAByprofile/' + id);
  }
  deleteAreaFromProfile(profile, idarea) {
    return this.http.put<Profile>(this.host1 + 'deleteAreaFromProfile/' + idarea, profile);
  }
  updateProfileOnEdit(profile , id) {
    console.log(this.host + 'updateProfileOnEdit/' + id);
    return this.http.put<Profile>(this.host + 'updateProfileOnEdit/' + id, profile);
  }
}

