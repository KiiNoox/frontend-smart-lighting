import {Component, Inject, OnInit} from '@angular/core';
import {LignesService} from '../../Services/lignes.service';
import {LOCAL_STORAGE, WebStorageService} from 'ngx-webstorage-service';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-facture',
  templateUrl: './facture.component.html',
  styleUrls: ['./facture.component.css']
})
export class FactureComponent implements OnInit {
  DeviceName;
  DeviceType;
  Data = [];
  Production;
  Consumption;

  DateDay: string;
  dateF: Date;
  dateD: Date;
  total;
  time1 ;
  userEmail: string;
  time2;
  time3;
  time4;
  consumptionFirstPeriode;
  consumptionSecondPeriode;
  consumptionThirdPeriode;
  consumptionFourthPeriode;

  price1;
  price2;
  vmin1;
  vmin2;
  price11;
  price12;
  price13;
  price3;
  price4;
  constructor(public  lignesService: LignesService , @Inject(LOCAL_STORAGE) private storage: WebStorageService) { }

  ngOnInit(): void {
    const decodedHeader = jwt_decode(this.storage.get('token'));
    // @ts-ignore
    console.log(decodedHeader.users.email);
    const DataDate: Date = new Date(Date.now())
    let min ;
    // @ts-ignore
    this.userEmail = decodedHeader.users.email;
    this.userEmail.replace('"', '')
    console.log('email   : ' + this.userEmail)

    //   this.DateDay= this.DateDisplay(this.DateDay)

    this.lignesService.FactureData.subscribe(data => {
      this.Data = data
      console.log(data)
      const DD: Date = new Date(this.Data[6]);
      const DF: Date = new Date(this.Data[7]);
      this.DeviceName = this.Data[0];
      this.Consumption = this.Data[2]
      this.total = (this.Data[1] / 1000).toString().substring(0, 9);
      this.dateD = this.Data[4];
      this.price1 = this.Data[3].substring(0, 9);
      // tslint:disable-next-line:no-shadowed-variable
      const DataDate = new Date();
      this.DateDay = DataDate.getFullYear() + '/' + (DataDate.getMonth() + 1)
        + '/' + DataDate.getDate();

      console.log('name: ' + this.DeviceName );
  });

}
  /*DateDisplay(DataDate:Date=new Date()){
      var min,DateDay;
      DataDate.getMinutes() > 10 ?
        (min = DataDate.getMinutes()) : min = '0' + DataDate.getMinutes();
      DateDay=DataDate.getFullYear() + '/' + (DataDate.getMonth() + 1)
        + '/' + DataDate.getDate() + ' , '
        + DataDate.getHours() + ':' + min + ' '
      return(DateDay)
    }*/
  Download() {
    const data = document.getElementById('contentToConvert');
    html2canvas(data).then(canvas => {
      const imgWidth = 208;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      const contentDataURL = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4');
      const position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)
      pdf.save('Facture.pdf');
    });
  }
}
