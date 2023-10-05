import {Component, Input, OnInit} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {HttpClient} from '@angular/common/http';
import { DevicesService } from 'app/Services/devices.service';
@Component({
  selector: 'app-data-device',
  templateUrl: './data-device.component.html',
  styleUrls: ['./data-device.component.css']
})
export class DataDeviceComponent implements OnInit {

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
  // gauge
  canvasWidth = 200 ;
  public bottomLabel = 'KWh'  ;
  public bottomLabelW = 'W'  ;
  public bottomLabelW2 = 'V'  ;
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
  datadev;
  timeComp;
  lastDate
  loading=true;
  constructor( private http: HttpClient, public dialog: NgbModal, private devicesService: DevicesService) { }

  ngOnInit(): void {

        this.label_ComActiveTotal = this.id.electricconsumptions ;
        this.needleValue_ActivePowerTotal = (this.id.electricconsumptions * 100) / 100 ;
        this.label_ActivePowerTotal = (this.id.Power * 100) / 240; ;

        this.needleValue_PositiveActiveTotal = this.id.Power
        //.substring(0 , 6)  ;
        this.label_PositiveActiveTotal = this.id.Power   ;
        this.label_ReverseActiveTotal = (this.id.voltage * 100) / 240;
        this.needleValue_ReverseActiveTotal = this.id.voltage ;
      
          this.devicesService.getlightdata(this.id._id).subscribe(data2 => {
             this.datadev = data2;
             this.timeComp=this.datadev.data;
            this.lastDate=this.timeComp[0].time;
            for (let i = 1; i < this.timeComp.length; i++) {
              if (this.timeComp[i].time > this.timeComp[i-1].time ) {
                this.lastDate = this.timeComp[i].time;
              }
            } 
            console.log(this.lastDate)
            this.loading=false  
          })}

          
          getFormattedPowerFactor(): string {
            if (this.id.powerfactor !== undefined && this.id.powerfactor !== null) {
              return (Math.round(this.id.powerfactor * 1000) / 1000).toFixed(3);
            } else {
              return 'N/A';
            }
          }     

}
