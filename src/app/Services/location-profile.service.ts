import { Injectable } from '@angular/core';
import {Ligne} from '../models/Ligne';
import {Profile} from '../models/Profile';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Area} from '../models/Area';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class LocationProfileService {
  private  host = '/api/Profile/';
  private  host1 = '/api/Area/';
  private  host2 = '/api/Ligne/';
  private  host3 ='/api/LocationProfile/'
  constructor(private http:HttpClient) { }
  getAllAsignedProfile() {
    return this.http.get(this.host3 + 'getAllLocationProfiles/');
  }
  getAssignedProfilesByUser(user) {
    console.log(this.host3 + 'getLocationProfile/'+user)
    return this.http.get(this.host3 + 'getLocationProfile/'+user);
  }
  AssignProfile(assignedProfile): Observable<any> {
    return this.http.post(this.host3 + 'AssignProfile',assignedProfile).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(error.error.message || 'An error occurred');
      })
    );;
  }
  CancelAssignByprofile(id) {
    return this.http.delete(this.host3 + 'CancelAssignProfile/' + id);
  }
  getOneAsignedProfile(id:number){
    return this.http.get(this.host3 + 'getOneLocationProfile/'+id);
  }
  getRelatedAreas(id:number){
    return this.http.get<Area>(this.host3+'getRelatedAreas/'+id)
  }
  getRelatedLignes(id:number){
    return this.http.get<Ligne>(this.host3+'getRelatedLines/'+id)
  }
  updateAssignedProfile(id,profile): Observable<any> {
    return this.http.put(this.host3+id,profile).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(error.error.message || 'An error occurred');
      })
    );;
  }

  addProfileToArea(req) {
    return this.http.put(this.host3+"addProfileToArea/"+req.id,req);
  }
  addProfileToLigne(req) {
    return this.http.put(this.host3+"addProfileToLigne/"+req.id,req);
  }
  removeProfileFromArea(req) {
    return this.http.put(this.host3+"removeProfileFromArea/"+req.id,req);
  }
  removeProfileFromLigne(req) {
    return this.http.put(this.host3+"removeProfileFromLigne/"+req.id,req);
  }
}



