import {Component, Input, OnInit} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.css']
})
export class DataComponent implements OnInit {


  private value = 0;
  @Input() public id;
  VoltagePhaseA ;
  VoltagePhaseB ;
  VoltagePhaseC ;
  CurrentPhaseA ;
  CurrentPhaseB ;
  CurrentPhaseC ;

  private ActivePowerTotal ;
  private ActivePowerPhaseA ;
  private ActivePowerPhaseB ;
  private ActivePowerPhaseC ;
  private PowerFactorTotal ;
  PowerFactorPhaseA  ;
  PowerFactorPhaseB  ;
  PowerFactorPhaseC ;
  //
  private  ComActiveTotal;
  private  PositiveActiveTotal ;
  private  ReverseActiveTotal  ;
  x = 0;
  // gauge
  canvasWidth = 200 ;
  public bottomLabel = 'Kw'  ;
  public bottomLabelW = 'Kw'  ;
  themeSubscription: any;
  name1: any = 'electric consumption';
  name2: any = 'Power';
  name3: any = 'Voltage';
  // needle
  needleValue_ComActiveTotal  ;
  needleValue_PositiveActiveTotal  ;
  needleValue_ReverseActiveTotal  ;
  needleValue_ActivePowerTotal  ;
  // label
  label_ComActiveTotal = '' ;
  label_PositiveActiveTotal = '' ;
  label_ReverseActiveTotal: number ;
  label_ActivePowerTotal: number ;
  label_PositiveActiveTotal2 = 70;
  option: any = {};
  public options = {
    hasNeedle: true,
    needleColor: 'gray',
    needleUpdateSpeed: 1000,
    arcColors: ['#97a7a2', '#6bd098'],
    arcDelimiters: [30],
    rangeLabel: ['0', '300'],
    needleStartValue: 50,
  }
  data;
  code;
  lastDate;
  loading=true;
  constructor( private http: HttpClient, public dialog: NgbModal) { }

  ngOnInit(): void {
    console.log(this.lastDate);
    console.log(this.id);
    console.log(this.id.Ligne);
    if (this.id.Ligne !== undefined) {
      console.log('this area has lignes');
      if (this.id.Ligne[0].Device !== undefined) {
        console.log('the first ligne has devices');
        this.x = this.id.Ligne[0].Device[0].data.length;
        console.log(this.x);
      if (this.x > 0) {
        this.http.get('/api/Area/getsommesite/' +this.id._id).subscribe(data => {
        const resSTR = JSON.stringify(data);
        const resJSON = JSON.parse(resSTR);
        let datasite = resJSON;
        this.lastDate=datasite[0].time;
        for (let i = 1; i < datasite.length; i++) {
          if (datasite[i].time > datasite[i-1].time ) {
            this.lastDate = datasite[i].time;
          }
        }
        this.loading=false
      });
        this.label_ComActiveTotal =this.id.Ligne[0].Device[0].data[this.x - 1].electricconsumptions ;
        this.needleValue_ActivePowerTotal = (this.id.Ligne[0].Device[0].data[this.x - 1].electricconsumptions*100)/100 ;
        this.label_ActivePowerTotal =(this.id.Ligne[0].Device[0].data[this.x - 1].Power * 100) / 240;

        this.needleValue_PositiveActiveTotal =((this.id.Ligne[0].Device[0].data[this.x - 1].Power*100)/100).toFixed(2)  ;
        this.label_PositiveActiveTotal = this.id.Ligne[0].Device[0].data[this.x - 1].Power   ;
        this.label_ReverseActiveTotal =(this.id.Ligne[0].Device[0].data[this.x - 1].voltage * 100) / 240;
        this.needleValue_ReverseActiveTotal = this.id.Ligne[0].Device[0].data[this.x - 1].voltage ;
      }
      } } else {
      if (this.id.Device !== undefined) {
        this.x = this.id.Device[0].data.length;
      }
      if (this.x > 0) {

          this.http.get('/api/Ligne/getsommeligne/' + this.id._id).subscribe(data2 => {
            const resSTRR = JSON.stringify(data2);
            const resJSONN = JSON.parse(resSTRR);
            let dataligne = resJSONN;
            this.lastDate=dataligne[0].time;
            for (let i = 1; i < dataligne.length; i++) {
              if (dataligne[i].time > dataligne[i-1].time ) {
                this.lastDate = dataligne[i].time;
              }
            } 
            this.loading=false  
          })
        this.label_ComActiveTotal = this.id.Device[0].data[this.x - 1].electricconsumptions;
        this.needleValue_ActivePowerTotal = (this.id.Device[0].data[this.x - 1].electricconsumptions * 100) / 100;
        this.label_ActivePowerTotal = (this.id.Device[0].data[this.x - 1].Power * 100) / 240;
        this.needleValue_PositiveActiveTotal =((this.id.Device[0].data[this.x - 1].Power*100)/100).toFixed(2);      
        this.label_PositiveActiveTotal = this.id.Device[0].data[this.x - 1].Power;
        this.label_ReverseActiveTotal = (this.id.Device[0].data[this.x - 1].voltage * 100) / 240;
        this.needleValue_ReverseActiveTotal =this.id.Device[0].data[this.x - 1].voltage;
      }
    }

}


  }


