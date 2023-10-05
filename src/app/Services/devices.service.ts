import { Injectable } from '@angular/core';
import {Ligne} from '../models/Ligne';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Device} from '../models/Device';
import {Area} from '../models/Area';
@Injectable({
  providedIn: 'root'
})
export class DevicesService {
  public host = '/api/Device/';

  constructor(private http: HttpClient) { }
  AddDevice(device) {
    return this.http.post<Device>(this.host + 'AddDevice', device);
  }
  GetAllDevice(users) {
    return this.http.get<Ligne[]>(this.host + 'GetDevice/' + users);
  }
  GetDeviceByLigneId(id) {
    return this.http.get<Ligne[]>(this.host + 'GetByIdLigne/' + id);
  }
  GetDeviceById(id) {
    return this.http.get<Ligne>(this.host  + id);
  }
  DeleteDeviceByid(id) {
    return this.http.delete<Device>(this.host + id);
  }
  EditDevice(ligne , id) {
    return this.http.put<Ligne>(this.host + id, ligne);
  }
  EditDeviceStatus(device , id) {
    console.log(this.host + 'updateDeviceStatus/' + id);
    console.log(device);
    return this.http.put(this.host + 'updateDeviceStatus/' + id, device);
  }

  onoffStatus(device) {
    return this.http.post(this.host + 'SensorOff', device);
  }
  getlightdata( id) {

    return this.http.get<Device>('/api/Device/getlightdata/' + id);
  }
  getDevicesWithoutData(id){
    return this.http.get<Device>('/api/Device/getDevicesWithoutData/'+id)
  }

}
