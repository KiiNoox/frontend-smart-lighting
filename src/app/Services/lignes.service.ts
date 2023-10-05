import { Injectable } from '@angular/core';
import {Ligne} from '../models/Ligne';
import {BehaviorSubject, Observable, throwError} from 'rxjs';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Area} from '../models/Area';
import * as fileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { catchError } from 'rxjs/operators';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
@Injectable({
  providedIn: 'root'
})
export class LignesService {
  public host1 = '/api/Ligne/';

  public host = '/api/Ligne/ADDLigne';
    public host2 = '/api/Ligne/GetLigne/';
  public host3 = '/api/Ligne/GetByIdArea/';
  public host4 = '/api/Ligne/';
  public host5 = '/api/Area/AffectLigneToArea/';
  public host6 = '/api/Ligne/AffectDeviceToLigne/';
  private stat = new BehaviorSubject<any>({value: 'nan'});
  dataMsg = this.stat.asObservable();
  private factO = new BehaviorSubject<any>({value: 'nan'});
  FactureData = this.factO.asObservable();
  constructor(private http: HttpClient) { }

  AddLigne(ligne) {
    console.log(ligne);
    return this.http.post<Ligne>(this.host, ligne);
  }
  getLigne(users) {
    return this.http.get<Ligne[]>(this.host2 + users);
  }

  getLigneById(id) {
    return this.http.get<Ligne[]>(this.host4 + id);
  }
  getLigneByAreaId(id) {
    return this.http.get<Ligne[]>(this.host3 + id);
  }
  DeleteLigneByid(id):Observable<any> {
    return this.http.delete<Ligne>(this.host1 + id).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(error.error.message || 'An error occurred');
      })
    );
  };
  
  EditLigne(ligne , id) {
    return this.http.put<Ligne>(this.host1 + id, ligne);
  }
  affectLignetoArea(id , ligne) {
    console.log(id)
    console.log(ligne)
    return this.http.put<Ligne>(this.host5 + id, ligne);
  }
  affectDevicetoLigne(id , Device) {
    console.log(id)
    console.log(Device)
    return this.http.put<Ligne>(this.host6 + id, Device);
  }
  updateLigneStatusByidDevice(id , ligne) {
    return this.http.put<Ligne>(this.host1 + 'updateLigneStatusByidDevice/' + id, ligne);
  }
  updateLigneStatusByidDeviceA(id , ligne) {
    return this.http.put<Ligne>(this.host1 + 'updateLigneStatusByidDeviceA/' + id, ligne);
  }

  updateLigneStatus3(id , ligne) {
    return this.http.put<Ligne>(this.host1 + 'updateLigneStatus3/' + id, ligne);
  }
  DataStat(item) {
    this.stat.next(item);
    console.log('item received: ' + item)
  }
  public exportAsExcelFile(json: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    this.saveAsExcelFile(excelBuffer, excelFileName);
  }
  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {type: EXCEL_TYPE});
    fileSaver.saveAs(data, fileName + '_export_' + new  Date().getTime() + EXCEL_EXTENSION);
  }
  FactureStat(item) {
    this.factO.next(item);
    console.log('item receivedfact: ' + item)
  }
}
