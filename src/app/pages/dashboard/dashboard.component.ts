import {Component, Inject, OnInit} from '@angular/core';
// @ts-ignore
import Chart, {ChartDataSets} from 'chart.js';
import { ChartType, ChartOptions } from 'chart.js';
import {LOCAL_STORAGE, WebStorageService} from 'ngx-webstorage-service';
import {UserService} from '../../Services/user.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import jwt_decode from 'jwt-decode';
import {SingleDataSet, Label, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip, Color} from 'ng2-charts';
import {DevicesService} from '../../Services/devices.service';
import {AreaService} from '../../Services/area.service';
import {LignesService} from '../../Services/lignes.service';
import Swal from 'sweetalert2';
import {HttpClient} from '@angular/common/http';
import { cpuUsage } from 'process';
import { ProfileService } from 'app/Services/profile.service';

@Component({
  // tslint:disable-next-line:component-selector
    selector: 'dashboard-cmp',
    moduleId: module.id,
    templateUrl: 'dashboard.component.html'
})

export class DashboardComponent implements OnInit {
  areaForm1 = new FormGroup({
    Area: new FormControl('', [Validators.required]),
    Ligne: new FormControl('', [Validators.required]),
    Device: new FormControl('', [Validators.required]),
    date: new FormControl('', [Validators.required]),
    date2: new FormControl('', [Validators.required]),
    date3: new FormControl('', [Validators.required]),
    date4: new FormControl('', [Validators.required]),
  });
  public canvas: any;
  public ctx;
  FactureData = [];
  public chartColor = '#FFFFFF';
  public chartEmail;
  public chartHours;
  site;
  cols3: any;
  keyword = 'name';
  // Pie
  public role: string;
  deviceone = [];
  dataonedsite = [];
  public pieChartOptions: ChartOptions = {
    responsive: true,
  };
  public pieChartData: SingleDataSet = [300, 500];
  public pieChartLegend = true;
  public pieChartPlugins = [];
  public nbactif = 0;
  public nbinactif = 0;
  public nbsite = 0;
  public nbligne = 0;
  public nbdevice = 0;
  private consommationp: string;
  private OneDayp;
  price = 0;
  public doughnutChartLabels = ['Activated', 'Desactivated'];
  // public doughnutChartData = [120, 150, 180, 90];
  public doughnutChartType = 'doughnut';
  public pieChartLabels = ['Sites', 'Lines', 'Devices'];
  // public pieChartData = [this.countsite(), 4, 1];
  public pieChartType = 'pie';
  lineChartLabels: Label[] = ['January', 'February', 'March', 'April', 'May', 'June'];

  lineChartOptions = {
    responsive: true,
  };
  lineChartData: ChartDataSets[] = [
    {
      data: [85, 72, 78, 75, 77, 75],
      //  label: 'Consumption'
    },
  ];
  lineChartColors: Color[] = [
    {
      borderColor: '#6bd098',
      backgroundColor: '#e4e8f1',
    },
  ];

  lineChartLegend = false;
  lineChartPlugins = [];
  lineChartType = 'line';
  public chartColors: Array<any> = [
    {
      backgroundColor: ['#6bd098', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360'],
      hoverBackgroundColor: ['#6bd098', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360'],
      borderWidth: 2,
    }
  ];
  public chartColors2: Array<any> = [
    {
      backgroundColor: ['#6bd098', '#f17e5d', '#FDB45C', '#949FB1', '#4D5360'],
      hoverBackgroundColor: ['#6bd098', '#f17e5d', '#FDB45C', '#949FB1', '#4D5360'],
      borderWidth: 2,
    }
  ];
  chartData = [
    {
      // label: '1st Year',
      data: [21, 56, 4, 31, 45, 15, 57, 61, 9, 17, 24, 59]
    },
    {
      // label: '2nd Year',
      data: [47, 9, 28, 54, 77, 51, 24]
    }
  ];
  labels = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  chartOptions = {
    responsive: true    // THIS WILL MAKE THE CHART RESPONSIVE (VISIBLE IN ANY DEVICE).
  }
  colors = [
    { // 1st Year.
      backgroundColor: 'rgba(77,83,96,0.2)'
    },
    { // 2nd Year.
      backgroundColor: '#6bd098'
    }
  ];
  consommation;
  // CHART CLICK EVENT.
  nbmaxdevice: any;
  nbfree: any;
  userId: any;
  type;
  private datasite: any;

  private datadev;
  private dataLength: any;
  private labelline = [];
  // private dataconso: any[];
  // private labelconso: any[];
  private sommedata: number;
  barchart: any;
  barchartt: any;
  barchartm: any;
  barcharty: any;
  devv = [];
  private test: any;
  private datasites: any;
  private conc = [];
  private test2: any;
  private alldevices = [];
  al: any[];
  alldev: any[];
  private siteOnep = [];
  private datas: any;
  private tabledata: any;
  private testtt: any;
  private alltest = [];

  private concat;
  // private dataaa: any;
  private DataTableOne1 = [];
  private DataTableOne2 = [];
  private TableOneDataPath1;
  private TableOneDataPath2;
  // labelconsoligne;
  private dataligne: any;
  private concat2: any;
  private devvv = [];
  private devsl;
  private testl: any;
  private alltestligne = [];
  private devicesligne;
  private testligne: any;
  private alldevicesligne = [];
  private alldevligne: any;
  private label2 = [];
  private devvsite = [];
  private alltestsite = [];
  private alldevicessite = [];
  private yearp;
  private datadevsite: any;
  private concatsite: any;
  private alldevsite: any;
  private rania = [];
  private rania2 = [];
  private dataonedline = [];
  lineone = [];
  private namesite: any;
  private nameline: any;
  private testttsite: any[];
  private testsite;
  private namedevice;
  private totaldevice = [];
  private datasitepone: any;
  private namesitep: any;
  private dataonedsitep1 = [];
  private namesitep1: any;
  private lineonep1 = [];
  private dataonedlinep = [];
  private sitemonthpm = [];
  private datamonthsitepm = [];
  private namelinep1: any;
  private datalignep1: any;
  private namedevicep;
  private datadevp1;
  private dataLengthp1: any;
  private deviceonep1 = [];
  private dataoneddevicep1 = [];
  private datasitepm: any;
  linemonth = [];
  lineyear = [];
  devicemonth = [];
  deviceyear = [];
  sitemonth = [];
  siteyear = [];
  private datamonthline = [];
  private datamonthsite = [];
  private datamonthdevice = [];
  private datayearline = [];
  private datayearsite = [];
  private datayeardevice = [];
  barchartp1;
  barchartp2;
  barchartp3;
  barchartp4;
  private totalsite = [];
  private totalline = [];
  dataoneddevice = [];
  private devsite: any[];
  Tabledaysite: any[]
  private labelconsosite;
  private labelsite = [];
  private alsite: any;
  month = null;
  year = null;
  themeSubscription: any;
  dateDebut: Date = null;
  dateFin: Date = null;
  consommationpy;
  consommationpm;
  consommationpt;
  OneDay: Date = null;
  monthp;
  DataTableOne = [];
  CurrentSensor;
  LastSensorTemp;
  TableOneDataPath;
  SensorOneType;
  SensorSelected: any = 'notok';
  datasetToExcel = [];
  ExcelItem;
  idselectedline;
  idselecteddevice;
  selectedDevice;
  selectedLine;
  selectedSite;
  idselectedsite;
  barcharttotal;
  nbtotaldedevice;
  nbtotaldedevicereste;
  data = [];
  Lignedata = [];
  Devicedata = [];
  private namesitepm: any;
  private namelinepm: any;
  private datalignepm: any;
  private linemonthpm = [];
  private datamonthlinepm = [];
  private namedevicepm: any;
  private datadevpm;
  private dataLengthpm: any;
  private devicemonthpm = [];
  private datamonthdevicep = [];
  private namesitepy: any;
  private datasitepy: any;
  private siteyearpy = [];
  private datayearsitepy = [];
  private namelinepy: any;
  private datalignepy: any;
  private lineyearpy = [];
  private datayearlinepy = [];
  private namedevicepy: any;
  private datadevpy;
  private dataLengthpy: any;
  private deviceyearpy = [];
  private datayeardevicepy = [];
  private namesitept: any;
  private datadevpt;
  private totalsitept = [];
  private namelinept: any;
  private totallinept = [];
  private totaldevicept = [];
  private namedevicept: any;
  private timeComp: any[];
  limite;
  nbalert = 0;
  alert=false;
  nbConnectibvityAlert = 0;
  constructor(private router: Router,
              @Inject(LOCAL_STORAGE) private storage: WebStorageService, public devicesService: DevicesService,
              public areaService: AreaService, public ligneService: LignesService, private http: HttpClient,
              private  profileService: ProfileService              ) {
    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend();
  }
   convertTime12to24 = (time12h) => {
    const [time, modifier] = time12h.split(' ');
      let [hours, minutes] = time.split(':');

    if (hours === '12') {
      hours = '00';
    }

    if (modifier === 'PM') {
      hours = parseInt(hours, 10) + 12;
    }

    return `${hours}:${minutes}`;
  }
  updateAutoProfiles(){
    this.profileService.getAllProfiles().subscribe(data => {
          //@ts-ignore
      console.log("profiles",data.profiles)
            //@ts-ignore
      let profile=data.profiles     
      let today= new Date()
       for(let i=0; i<profile.length;i++){
     
      if(profile[i].modeAuto===true )
      {
         this.areaService.apiteamps(profile[i].positionDetails[0],profile[i].positionDetails[1]).subscribe(data2=>{

            // @ts-ignore
          let sunset=data2.results.sunset;
            // @ts-ignore
          let sunrise=data2.results.sunrise;
          sunrise =  this.convertTime12to24(sunrise);
          sunset =  this.convertTime12to24(sunset);
          let y: number = +sunset.substring(0, 2);
          const x = sunset.substring(2, 5);
          y = y + 1;
          const z = y.toString();
          sunset = z + x ;
  
          let a: number = +sunrise.substring(0, 1);
          const b = sunrise.substring(1, 4);
          a = a + 1;
          const c = a.toString();
          sunrise = c + b;
          console.log(sunrise,sunset,"tiiiiiiiiiiiiiiiiiiiiii")
          profile[i].Time[0]=sunset;
          profile[i].Time[(profile[i].Time.length)-1]=sunrise;
          console.log(profile[i].Time,"tiiiiiiiiiiiiiiiiiiiiiimmmmmmmmmmmmmmme")
          this.profileService.EditProfile(profile[i] ,profile[i]._id).subscribe();
        })
      }
    }
      //@ts-ignore
    console.log("profiles",data.profiles)
    });
  }

  ngOnInit() {
    this.updateAutoProfiles()
    this.limite = this.storage.get('limite');
    console.log(this.limite)
    // @ts-ignore
    const decodedHeader = jwt_decode(this.storage.get('token'));
    // @ts-ignore
    this.role = decodedHeader.users;
    console.log(this.role);
    // @ts-ignore
    this.role = decodedHeader.users.Zone;
    console.log(this.role);
    this.nbtotaldedevice = this.storage.get('LicenseDeviceAllowed');

    // @ts-ignore
    this.areaService.getArea(decodedHeader.users._id).subscribe(data => {
      this.site = data;
    });
    if (this.storage.get('token') === undefined) {
      this.router.navigateByUrl('/');
    }
    // @ts-ignore
    this.devicesService.GetAllDevice(decodedHeader.users._id).subscribe(data => {
      this.cols3 = data;
      console.log(this.cols3);
      this.nbConnectibvityAlert = this.cols3.filter(u => u.connectivityAlert == 1).length;
      this.nbalert = this.cols3.filter(u => u.alert == 1).length;
      this.alert= (this.nbConnectibvityAlert>0||this.nbalert>0)
      for (let i = 0; i < this.cols3.length; i++) {
        if (this.cols3[i].Status === 'activated') {
          this.nbactif = this.nbactif + 1;
        } else if (this.cols3[i].Status === 'desactivated') {
          this.nbinactif = this.nbinactif + 1;
        }


      }
    });
    // @ts-ignore
    this.ligneService.getLigne(decodedHeader.users._id).subscribe(data => {
      console.log(data.length)
      this.nbligne = data.length;
    });
    // @ts-ignore
    this.areaService.getArea(decodedHeader.users._id).subscribe(data => {
      this.nbsite = data.length;

    });
    if (this.limite === false) {
      this.nbtotaldedevicereste = 'unlimited';
    } else {
      // @ts-ignore
      this.devicesService.GetAllDevice(decodedHeader.users._id).subscribe(data => {
        this.nbdevice = data.length;
        this.nbtotaldedevicereste = this.nbtotaldedevice - this.nbdevice;
      });
    }
    this.http.get('https://api.sunrise-sunset.org/json?lat=').subscribe(data => {
                 const resSTR = JSON.stringify(data);
    const  datasite = resSTR ;
 
   })
    // @ts-ignore
    this.devicesService.GetAllDevice(decodedHeader.users._id).subscribe(data => {
      this.nbdevice = data.length;
    });
    this.chartColor = '#FFFFFF';

    this.canvas = document.getElementById('chartHours');
    this.ctx = this.canvas.getContext('2d');

    this.chartHours = new Chart(this.ctx, {
      type: 'line',

      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
        datasets: [{
          borderColor: '#6bd098',
          backgroundColor: '#6bd098',
          pointRadius: 0,
          pointHoverRadius: 0,
          borderWidth: 3,
          data: [300, 310, 316, 322, 330, 326, 333, 345, 338, 354]
        },
          {
            borderColor: '#f17e5d',
            backgroundColor: '#f17e5d',
            pointRadius: 0,
            pointHoverRadius: 0,
            borderWidth: 3,
            data: [320, 340, 365, 360, 370, 385, 390, 384, 408, 420]
          },
          {
            borderColor: '#fcc468',
            backgroundColor: '#fcc468',
            pointRadius: 0,
            pointHoverRadius: 0,
            borderWidth: 3,
            data: [370, 394, 415, 409, 425, 445, 460, 450, 478, 484]
          }
        ]
      },
      options: {
        legend: {
          display: false
        },

        tooltips: {
          enabled: false
        },

        scales: {
          yAxes: [{

            ticks: {
              fontColor: '#9f9f9f',
              beginAtZero: false,
              maxTicksLimit: 5,
              // padding: 20
            },
            gridLines: {
              drawBorder: false,
              zeroLineColor: '#ccc',
              color: 'rgba(255,255,255,0.05)'
            }

          }],

          xAxes: [{
            barPercentage: 1.6,
            gridLines: {
              drawBorder: false,
              color: 'rgba(255,255,255,0.1)',
              zeroLineColor: 'transparent',
              display: false,
            },
            ticks: {
              padding: 20,
              fontColor: '#9f9f9f'
            }
          }]
        },
      }
    });


    this.canvas = document.getElementById('chartEmail');
    this.ctx = this.canvas.getContext('2d');
    this.chartEmail = new Chart(this.ctx, {
      type: 'pie',
      data: {
        labels: [1, 2, 3],
        datasets: [{
          label: 'Emails',
          pointRadius: 0,
          pointHoverRadius: 0,
          backgroundColor: [
            '#e3e3e3',
            '#4acccd',
            '#fcc468',
            '#ef8157'
          ],
          borderWidth: 0,
          data: [342, 480, 530, 120]
        }]
      },

      options: {

        legend: {
          display: false
        },

        pieceLabel: {
          render: 'percentage',
          fontColor: ['white'],
          precision: 2
        },

        tooltips: {
          enabled: false
        },

        scales: {
          yAxes: [{

            ticks: {
              display: false
            },
            gridLines: {
              drawBorder: false,
              zeroLineColor: 'transparent',
              color: 'rgba(255,255,255,0.05)'
            }

          }],

          xAxes: [{
            barPercentage: 1.6,
            gridLines: {
              drawBorder: false,
              color: 'rgba(255,255,255,0.1)',
              zeroLineColor: 'transparent'
            },
            ticks: {
              display: false,
            }
          }]
        },
      }
    });

    // tslint:disable-next-line:prefer-const
    const speedCanvas = document.getElementById('speedChart');

    // tslint:disable-next-line:prefer-const
    const dataFirst = {
      data: [0, 19, 15, 20, 30, 40, 40, 50, 25, 30, 50, 70],
      fill: false,
      borderColor: '#fbc658',
      backgroundColor: 'transparent',
      pointBorderColor: '#fbc658',
      pointRadius: 4,
      pointHoverRadius: 4,
      pointBorderWidth: 8,
    };

    const dataSecond = {
      data: [0, 5, 10, 12, 20, 27, 30, 34, 42, 45, 55, 63],
      fill: false,
      borderColor: '#51CACF',
      backgroundColor: 'transparent',
      pointBorderColor: '#51CACF',
      pointRadius: 4,
      pointHoverRadius: 4,
      pointBorderWidth: 8
    };

    const speedData = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [dataFirst, dataSecond]
    };

    const chartOptions = {
      legend: {
        display: false,
        position: 'top'
      }
    };

    const lineChart = new Chart(speedCanvas, {
      type: 'line',
      hover: false,
      data: speedData,
      options: chartOptions
    });
  }

  onChartClick(event) {
    console.log(event);
  }

  selectEvent(item) {
    this.selectedSite = item.name;
    console.log(this.selectedSite)
    this.idselectedsite = item._id;
    this.ligneService.getLigneByAreaId(this.idselectedsite).subscribe(data => {
      this.Lignedata = data;
      console.log(data)

    });
  }

  onChangeSearch(val: string) {
    console.log('aaaa');
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
    console.log(this.idselectedsite);

  }

  onFocused(e) {
    console.log('aaaa');
    console.log(this.idselectedsite);
    // do something when input is focused
  }

  selectEvent3(item) {
    // do something with selected item
    this.idselecteddevice = item._id;
    this.selectedDevice = item.name;
    this.ligneService.getLigneByAreaId(this.idselecteddevice).subscribe(data => {
      console.log(data)
      this.Lignedata = data;
    });
  }


  selectEvent2(item) {
    this.idselectedline = item._id;
    this.selectedLine = item.name;
    console.log(this.selectedLine)
    this.devicesService.GetDeviceByLigneId(this.idselectedline).subscribe(data => {
      this.Devicedata = data;
      console.log(this.Devicedata);
      console.log(this.idselectedline);
    });
  }

  send1() {

    this.storage.set('selectedSite', this.idselectedsite);

    console.log('testt: ' + this.idselectedsite)

    this.ligneService.DataStat(this.idselectedsite);

  }

  send2() {
    this.storage.set('selectedLine', this.idselectedline);

    console.log('testt: ' + this.idselectedline)

    this.ligneService.DataStat(this.idselectedline);

  }

  send3() {
    this.storage.set('selectedDevice', this.idselecteddevice);

    console.log('testt: ' + this.idselecteddevice)

    this.ligneService.DataStat(this.idselecteddevice);

  }

  fct(): void {
    this.ligneService.exportAsExcelFile(this.datasetToExcel, 'Dataset');
  }
  tesdt() {
    console.log(this.OneDay);
    console.log(this.OneDay)
  }
refresh() {
  this.areaForm1.get('Area').reset();
  this.areaForm1.get('Ligne').reset();
  this.areaForm1.get('Device').reset();
  this.idselectedsite = undefined;
  this.idselectedline = undefined;
  this.idselecteddevice = undefined;
 // this.ngOnInit();
  }
  t() {
    console.log('t');
    this.areaForm1.get('Area').reset();
    this.areaForm1.get('Ligne').reset();
    this.areaForm1.get('Device').reset();
    this.idselectedsite = undefined;
    this.idselectedline = undefined;
    this.idselecteddevice = undefined;
  }
  getoneday() {

    console.log(this.idselectedline);
    this.dateFin = null;
    this.dateDebut = null;
    this.year = null;
    this.TableOneDataPath1 = null;
    this.TableOneDataPath2 = null;
    this.TableOneDataPath = null;
    this.consommation = null;
    this.rania = [];
    this.dataonedsite = [];
    this.dataonedline = [];
    this.dataoneddevice = [];
    console.log(this.OneDay)
    const OD = new Date(this.areaForm1.get('date').value);
    console.log(this.idselectedsite)
    console.log(this.idselectedline)
    console.log(this.idselecteddevice)
    console.log('++++' + this.areaForm1.get('date').value);
    if (this.areaForm1.get('date').value === null) {
      alert('Select Date');
    } else {
    if (OD.getFullYear() !== 1970) {
        this.clearTable();
        console.log(this.CurrentSensor);
        if (this.idselectedsite !== undefined && this.idselectedline === undefined && this.idselecteddevice === undefined) {
        this.http.get('/api/Area/getsommesite/' + this.idselectedsite).subscribe(data => {
          console.log('data');
          console.log(data);
          const resSTR = JSON.stringify(data);
          const resJSON = JSON.parse(resSTR);
          this.datasite = resJSON;

          this.http.get('/api/Area/namesite/' + this.idselectedsite).subscribe(data2 => {
            console.log(data2)
            const resSTRR = JSON.stringify(data2);
            const resJSONN = JSON.parse(resSTRR);
            this.namesite = resJSONN

            if (this.datasite.length === 0) {
              alert('no data');
            } else {
              const Tabledaysite = this.datasite;
              console.log(Tabledaysite)

              let i = 0;
              console.log(Tabledaysite)
              let dataSite=[];
              for (i = 0; i < Tabledaysite.length ; i++) {
                const DataDate = new Date(Tabledaysite[i].time);

                if (OD.getDate() == DataDate.getDate() &&
                  OD.getMonth() == DataDate.getMonth() && OD.getFullYear() == DataDate.getFullYear()) {


                  this.labelsite.push(DataDate.getFullYear() + '/' + (DataDate.getMonth() + 1)
                    + '/' + DataDate.getDate() + ' , '
                    + DataDate.getHours());

                    dataSite.push(Tabledaysite[i])
                }

              }
    
                let tab=0
                let con=dataSite[0].electricconsumptions;
                for (let i = 1; i < dataSite.length; i++) {
                if(dataSite[i].time<dataSite[i-1].time)
                { 
                  con=dataSite[i-1].electricconsumptions-con;
                  tab+=con;
                  con=dataSite[i].electricconsumptions;

                }
                if (i==dataSite.length-1){
                  tab+=dataSite[i].electricconsumptions-con;
                }
              }

                
              let valint=dataSite[0].electricconsumptions
              for (let i = 1; i < dataSite.length; i++) {
               if(dataSite[i].time<dataSite[i-1].time)
                  { 
                    valint+=dataSite[i].electricconsumptions;
                  } 
                }
                console.log(valint,'valint')

              let newData=[]
              for (let i = 1; i < dataSite.length; i++) {
               if(dataSite[i].time>dataSite[i-1].time)
               { 
                 newData[i]=dataSite[i].electricconsumptions-dataSite[i-1].electricconsumptions;
               } 
               else 
               {
                  newData[i]=0;
               }
           }
           let newD= dataSite;
           for(let i=0;i<dataSite.length;i++){
              newD[i].electricconsumptions=newData[i];
            }
                   
          
          
              const reducedData = newD.reduce((acc, curr) => {
                const index = acc.findIndex((item) => item.time === curr.time);
                if (index >= 0) {
                  acc[index].electricconsumptions += curr.electricconsumptions;
                } else {
                  acc.push(curr);
                }
                return acc;
              }, []);

              const sortedData = reducedData.sort((a, b) => {
                if (a.time < b.time) {
                  return -1;
                }
                if (a.time > b.time) {
                  return 1;
                }
                return 0;
              });

              sortedData[0].electricconsumptions=valint;
              for (let i =1 ; i < sortedData.length; i++) {
                sortedData[i].electricconsumptions+=sortedData[i-1].electricconsumptions;
              }
              console.log(sortedData, 'sortedddddddddddddddddddddddddddddddData');

         

              for (let i = 0; i < sortedData.length; i++) {
                this.ExcelItem = {

                  'Site Name': this.selectedSite,
                  'Date': this.OneDay,
                  'data': sortedData[i].electricconsumptions + 'Khw',
                  'hours': sortedData[i].time.slice(10,19) 
                }
                this.datasetToExcel.push(this.ExcelItem)
              }
              this.barchart = new Chart('canvasss', {
                type: 'line',
                data: {
                  labels: sortedData.map((item) => item.time.slice(10,19) ),
                  datasets: [{
                    label: 'Consumption',
                    data: sortedData.map((item) => item.electricconsumptions),
                    fill: true,
                    borderColor: 'rgb(34,139,34)', 
                    tension: 0.1
                  }]
                }
              });
            

              this.consommation = tab+ ' ' + 'KWh'



            }
          });
          });
        }
        if (this.idselectedsite !== undefined && this.idselectedline !== undefined && this.idselecteddevice === undefined) {
          this.http.get('/api/Ligne/nameline/' + this.idselectedline).subscribe(data => {
            const resSTR = JSON.stringify(data);
            const resJSON = JSON.parse(resSTR);
            this.nameline = resJSON;
            this.http.get('/api/Ligne/getsommeligne/' + this.idselectedline).subscribe(data2 => {
              const resSTRR = JSON.stringify(data2);
              const resJSONN = JSON.parse(resSTRR);
              this.dataligne = resJSONN;
              console.log(this.dataligne)

              const Tabledayline = this.dataligne;
              console.log(Tabledayline)

              this.SensorOneType = 'Consumption';
              let i = 0;

              let sommedayline = 0
              for (i = 0; i < Tabledayline.length ; i++) {

                const DataDate = new Date(Tabledayline[i].time);

                console.log(new Date(Tabledayline[i].time).getDate())
                const CurentDate = new Date(Date.now());

                if ((OD.getDate() == DataDate.getDate() &&
                  OD.getMonth() == DataDate.getMonth() && OD.getFullYear() == DataDate.getFullYear())) {
                  console.log(Tabledayline[i])
                  sommedayline += Tabledayline[i].electricconsumptions;
                  console.log(sommedayline)
                  this.lineone.push(Tabledayline[i])
                }
              }
              console.log(this.lineone)
        
              let tab=0
              let con=this.lineone[0].electricconsumptions;
              for (let i = 1; i < this.lineone.length; i++) {
              if(this.lineone[i].time<this.lineone[i-1].time)
              { 
                con=this.lineone[i-1].electricconsumptions-con;
                tab+=con;
                con=this.lineone[i].electricconsumptions;

              }
              if (i==this.lineone.length-1){
                tab+=this.lineone[i].electricconsumptions-con;
              }
            }



            
          let valint=this.lineone[0].electricconsumptions
          for (let i = 1; i < this.lineone.length; i++) {
           if(this.lineone[i].time<this.lineone[i-1].time)
              { 
                valint+=this.lineone[i].electricconsumptions;
              } 
            }
            console.log(valint,'valint')

          let newData=[]
          for (let i = 1; i < this.lineone.length; i++) {
           if(this.lineone[i].time>this.lineone[i-1].time)
           { 
             newData[i]=this.lineone[i].electricconsumptions-this.lineone[i-1].electricconsumptions;
           } 
           else 
           {
              newData[i]=0;
           }
       }
       let newD= this.lineone;
       for(let i=0;i<this.lineone.length;i++){
          newD[i].electricconsumptions=newData[i];
        }
               
      
      
          const reducedData = newD.reduce((acc, curr) => {
            const index = acc.findIndex((item) => item.time === curr.time);
            if (index >= 0) {
              acc[index].electricconsumptions += curr.electricconsumptions;
            } else {
              acc.push(curr);
            }
            return acc;
          }, []);

          const sortedData = reducedData.sort((a, b) => {
            if (a.time < b.time) {
              return -1;
            }
            if (a.time > b.time) {
              return 1;
            }
            return 0;
          });

          sortedData[0].electricconsumptions=valint;
          for (let i =1 ; i < sortedData.length; i++) {
            sortedData[i].electricconsumptions+=sortedData[i-1].electricconsumptions;
          }
          console.log(sortedData, 'sortedddddddddddddddddddddddddddddddData');

     

          for (let i = 0; i < sortedData.length; i++) {
            this.ExcelItem = {

              'Site Name': this.selectedSite,
              'Date': this.OneDay,
              'data': sortedData[i].electricconsumptions + 'Khw',
              'hours': sortedData[i].time.slice(10,19) 
            }
            this.datasetToExcel.push(this.ExcelItem)
          }
          this.barchart = new Chart('canvasss', {
            type: 'line',
            data: {
              labels: sortedData.map((item) => item.time.slice(10,19) ),
              datasets: [{
                label: 'Consumption',
                data: sortedData.map((item) => item.electricconsumptions),
                fill: true,
                borderColor: 'rgb(34,139,34)', 
                tension: 0.1
              }]
            }
          });
        

          this.consommation = tab+ ' ' + 'KWh'

            });
          });
        }
        if (this.idselectedsite !== undefined && this.idselectedline !== undefined && this.idselecteddevice !== undefined) {
          this.http.get('/api/Device/namedevice/' + this.idselecteddevice).subscribe(data => {
            
            console.log(data)
            this.namedevice = data;
            this.devicesService.getlightdata(this.idselecteddevice).subscribe(data2 => {
              console.log(data2)
              this.datadev = data2;
              this.timeComp=this.datadev.data;
              let j=0;
              let tab = [];
              for (let i = 0; i < this.timeComp.length; i++) {
                if (this.timeComp[i].time.slice(0, 10)==this.OneDay)
                {
                  tab[j]=this.timeComp[i].electricconsumptions
                  j++;
                }
  
              }
              console.log("electric consumptions in this day",tab[j-1]-tab[0]);

              this.dataLength = this.datadev.data.length;
                            this.dataLength = this.datadev.data.length;
              console.log(this.dataLength)
              this.LastSensorTemp = new Date(this.datadev.data[this.datadev.data.length - 1].time);
              console.log(this.LastSensorTemp)
              const Tabledaydevice = this.datadev.data;
              console.log(Tabledaydevice)

              this.SensorOneType = 'Consumption';

              let i = 0;

              let sommedaydevice = 0
              for (i = 0; i < this.dataLength; i++) {
                const DataDate = new Date(Tabledaydevice[i].time);
                if ((OD.getDate() === DataDate.getDate() &&
                  OD.getMonth() === DataDate.getMonth() && OD.getFullYear() === DataDate.getFullYear())) {

                  console.log(Tabledaydevice[i])
                  sommedaydevice += Tabledaydevice[i].electricconsumptions;
                  console.log(sommedaydevice)


                  this.deviceone.push(Tabledaydevice[i])
                }

              }

              console.log(this.deviceone)

              const lab=[]
              const con=[this.deviceone[0].electricconsumptions]
              console.log("this.deviceone",this.deviceone)
              for (let i = 0; i < this.deviceone.length; i++) {
              lab.push(this.deviceone[i].time.slice(11, 19))
              if(i>0)
              con.push(this.deviceone[i].electricconsumptions)
              }

              let s=0;
              for (let i = 0; i < this.deviceone.length; i++) {
              s+=con[i];  
                this.ExcelItem = {

                  'DeviceName': this.selectedDevice,
                  'Date': this.OneDay,
                  'Data': s+ 'Kwh',
                  'hours': lab[i]
                }
                this.datasetToExcel.push(this.ExcelItem)
              }
              this.barchart = new Chart('canvasss', {
                type: 'line',
                data: {
                  labels:lab,
                  datasets: [{
                    label: 'Consumption',
                    data: con,
                    fill: true,
                    borderColor: 'rgb(34,139,34)', 
                    tension: 0.1
                  }]
                }
              });


              this.consommation = (this.deviceone[this.deviceone.length-1].electricconsumptions-this.deviceone[0].electricconsumptions).toString() + ' ' + 'KWh'


//

            });
          });
        }
    }
    }}

  getyear() {
    this.OneDay = null
    this.dateFin = null
    this.dateDebut = null
    this.month = null;
    this.TableOneDataPath1 = null;
    this.TableOneDataPath2 = null;
    this.TableOneDataPath = null;
    this.datayearsite = [];
    this.rania = [];
    this.dataonedsite = [];
    this.dataonedline = [];
    this.dataoneddevice = [];
    this.lineyear = [];
    this.siteyear = [];
    this.dataligne = [];
    this.datayeardevice = [];
    this.datadev = [];
    this.deviceyear = [];
    this.dataligne = [];
    this.datamonthline = [];
    this.linemonth = [];
    const Year = this.year;
    console.log(Year)
    console.log(new Date(Date.parse(Year)).getFullYear())
    if (new Date(Date.parse(this.areaForm1.get('date3').value)).getFullYear() !== null) {
      this.SensorSelected = 'ok';
      console.log('sensorselected: ' + this.SensorSelected)
      this.clearTable();
      console.log(this.CurrentSensor);
      if (this.areaForm1.get('date3').value === null) {
        alert('Select Date');
      } else {
        if (this.idselectedsite !== undefined && this.idselectedline === undefined && this.idselecteddevice === undefined) {
          this.http.get('/api/Area/namesite/' + this.idselectedsite).subscribe(data => {
            console.log(data)
            const resSTR = JSON.stringify(data);
            const resJSON = JSON.parse(resSTR);
            this.namesite = resJSON;
            this.http.get('/api/Area/getsommesite/' + this.idselectedsite).subscribe(data2 => {
              console.log(data2)
              const resSTRR = JSON.stringify(data2);
              const resJSONN = JSON.parse(resSTRR);
              this.datasite = resJSONN;

              const Tableyearsite = this.datasite;
              console.log(Tableyearsite)
              if (this.datasite.length === 0) {
                alert('no data');
              } else {
                this.SensorOneType = 'Consumption';
                const YY = new Date(Date.parse(Year));
                console.log(YY)
                let i = 0;

                let somme3 = 0
                for (i = 0; i < Tableyearsite.length ; i++) {
                  const DataDate = new Date(Tableyearsite[i].time);
                  const TD = DataDate.getMonth() * 1000 + DataDate.getFullYear() * 10000 + DataDate.getDay() * 100;

                  if (
                    YY.getFullYear() === DataDate.getFullYear()) {
                    console.log('true')

                    console.log(Tableyearsite[i])
                    somme3 += Tableyearsite[i].electricconsumptions;
                    console.log(somme3)
                    this.siteyear.push(Tableyearsite[i])
                  }

                }

                console.log(this.siteyear)

                const allyear = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin',
                  'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre']
                for (let i = 0; i < this.siteyear.length; i++) {
                }
                console.log(Tableyearsite)


                for (let i = 1; i <= 12; i++) {
                  const monthlyData = getSiteYearData(i, this.siteyear);
                  this.datayearsite.push(monthlyData);
                }

                const label = [];
                for (let i = 0; i < allyear.length; i++) {
                  label.push(allyear[i])
                }

                let sommedata1 = 0
                for (let i = 0; i < this.datayearsite.length; i++) {
                  sommedata1 += this.datayearsite[i]
                  this.ExcelItem = {

                    'Site Name': this.namesite,
                    'Electric Consumption': this.datayearsite[i] + 'Kwh',
                    'Months': label[i],
                    'Year': 2021,


                  }
                  this.datasetToExcel.push(this.ExcelItem)
                }
                console.log(sommedata1)


                this.barcharty = new Chart('canvas2', {
                  type: 'bar',
                  data: {
                    labels: allyear,
                    datasets: [
                      {
                        data: this.datayearsite,
                        borderColor: '#b0bcb5',
                        backgroundColor: 'rgb(134,226,175)',
                        fill: true
                      }
                    ]
                  },
                  options: {
                    legend: {
                      display: false
                    },
                    scales: {
                      xAxes: [{
                        display: true
                      }],
                      yAxes: [{
                        display: true
                      }],
                    }
                  }
                });


                this.consommation = this.datayearsite.reduce((total, current) => total + current, 0).toString() + ' ' + 'KWh'



                  }
            });
          });
        }
        
        if (this.idselectedsite !== undefined && this.idselectedline !== undefined && this.idselecteddevice === undefined) {
          this.http.get('/api/Ligne/nameline/' + this.idselectedline).subscribe(data => {
            console.log(data)
            const resSTR = JSON.stringify(data);
            const resJSON = JSON.parse(resSTR);
            this.nameline = resJSON;
            this.http.get('/api/Ligne/getsommeligne/' + this.idselectedline).subscribe(data2 => {
              console.log(data2)
              const resSTRR = JSON.stringify(data2);
              const resJSONN = JSON.parse(resSTRR);
              this.dataligne = resJSONN;
              if (this.dataligne.length === 0) {
                alert('no data');
              } else {
                const Tableyearline = this.dataligne;
                console.log(Tableyearline)
                if (this.dataligne.length === 0) {
                  alert('no data');
                } else {
                  this.SensorOneType = 'Consumption';
                  const YY = new Date(Date.parse(Year));
                  console.log(YY)
                  let i = 0;

                  let somme2 = 0
                  for (i = 0; i < Tableyearline.length ; i++) {
                    let min;

                    const DataDate = new Date(Tableyearline[i].time);
                    console.log('DataDate: ' + DataDate)

                    if (
                      YY.getFullYear() === DataDate.getFullYear()) {
                      console.log('true')

                      somme2 += Tableyearline[i].electricconsumptions;
                      console.log(somme2)
                      this.lineyear.push(Tableyearline[i])
                    }

                  }
       
                  const allyear = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre']



                  for (let i = 1; i <= 12; i++) {
                    const monthlyData = getSiteYearData(i, this.lineyear);
                    this.datayearline.push(monthlyData);
                  }

                  const label = [];
                  for (let i = 0; i < allyear.length; i++) {
                    label.push(allyear[i])
                  }


                  let sommedata2
                  if (this.lineyear[this.lineyear.length - 1] ===
                    undefined || this.lineyear[0] === undefined) {
                    sommedata2 = 0;
                  } else {
                    sommedata2 = this.lineyear[this.lineyear.length - 1].electricconsumptions - this.lineyear[0].electricconsumptions
                  }
                  console.log(sommedata2)
                  for (let i = 0; i < this.datayearline.length; i++) {
                    this.ExcelItem = {

                      'Line Name': this.nameline,
                      'Electric Consumption': this.datayearline[i] + 'Kwh',
                      'Months': label[i],
                      'Year': '2021',


                    }
                    this.datasetToExcel.push(this.ExcelItem)
                  }


                  this.barcharty = new Chart('canvas2', {
                    type: 'bar',
                    data: {
                      labels: label,
                      datasets: [
                        {
                          data: this.datayearline,
                          borderColor: '#b0bcb5',
                          backgroundColor: 'rgb(134,226,175)',
                          fill: true
                        }
                      ]
                    },
                    options: {
                      legend: {
                        display: false
                      },
                      scales: {
                        xAxes: [{
                          display: true
                        }],
                        yAxes: [{
                          display: true
                        }],
                      }
                    }
                  });


                  console.log('SensorValue1: ' + sommedata2)
                  this.consommation = this.datayearline.reduce((total, current) => total + current, 0).toString() + ' ' + 'KWh'

                  console.log(this.consommation)
                }
              }
            });
          });
        }
        if (this.idselectedsite !== undefined && this.idselectedline !== undefined && this.idselecteddevice !== undefined) {
          console.log(this.idselecteddevice);
          this.http.get('/api/Device/namedevice/' + this.idselecteddevice).subscribe(data => {
            console.log(data)
            const resSTR = JSON.stringify(data);
            const resJSON = JSON.parse(resSTR);
            this.namedevice = resJSON;
            this.devicesService.getlightdata(this.idselecteddevice).subscribe(data2 => {
              console.log(data2)
              this.datadev = data2;
              if (this.datadev.length === 0) {
                alert('no data');
              } else {
                this.dataLength = this.datadev.data.length;
                console.log(this.dataLength)
                this.LastSensorTemp = new Date(this.datadev.data[this.datadev.data.length - 1].time);
                console.log(this.LastSensorTemp)

                const Tableyeardevice = this.datadev.data;
                console.log(Tableyeardevice)

                this.SensorOneType = 'Consumption';


                const YY = new Date(Date.parse(Year));
                console.log(YY)
                let i = 0;
                let somme = 0
                for (i = 0; i < this.dataLength ; i++) {


                  const DataDate = new Date(Tableyeardevice[i].time);

                  if (
                    YY.getFullYear() === DataDate.getFullYear()) {
                    console.log('true')


                    console.log(Tableyeardevice)
                    somme += Tableyeardevice[i].electricconsumptions;
                    console.log(somme)


                    this.deviceyear.push(Tableyeardevice[i])
                  }

                }

                const allyear = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre']


                for (let i = 1; i <= 12; i++) {
                  this.datayeardevice.push(getDataForMonth(i, this.deviceyear));
                }


                         const label = [];
                         for (let i = 0; i < allyear.length; i++) {
                           label.push(allyear[i])
                         }
         

             
                for (let i = 0; i < this.datayeardevice.length; i++) {
                  this.ExcelItem = {

                    'DeviceName': this.namedevice,
                    'Type': this.datadev.type,
                    'Electric Consumption': this.datayeardevice[i] + 'Khw',
                    'Months': label[i],
                    'Year': '2021',


                  }
                  this.datasetToExcel.push(this.ExcelItem)
                }

                this.barcharty = new Chart('canvas2', {
                  type: 'bar',
                  data: {
                    labels: label,
                    datasets: [
                      {
                        data: this.datayeardevice,
                        borderColor: '#b0bcb5',
                        backgroundColor: 'rgb(134,226,175)',
                        fill: true
                      }
                    ]
                  },
                  options: {
                    legend: {
                      display: false
                    },
                    scales: {
                      xAxes: [{
                        display: true
                      }],
                      yAxes: [{
                        display: true
                      }],
                    }
                  }
                });
                this.consommation = this.datayeardevice.reduce((total, current) => total + current, 0).toString() + ' ' + 'KWh'
              }
            });
          });
        }
      }
    }
  }

  getmonth() {
    this.OneDay = null
    this.dateFin = null
    this.dateDebut = null
    this.year = null
    this.TableOneDataPath1 = null;
    this.TableOneDataPath2 = null;
    this.TableOneDataPath = null
    const Month = this.month;
    this.rania = [];
    this.dataonedsite = [];
    this.dataonedline = [];
    this.dataoneddevice = [];
    this.datasite = [];
    this.datamonthsite = [];
    this.sitemonth = [];

    this.dataligne  = [];
    this.datamonthline  = [];
    this.linemonth  = [];
    this.datadev = [];
    this.devicemonth = [];
    this.datamonthdevice = [];
    console.log(Month)
    if (this.areaForm1.get('date2').value === null) {
      alert('Select Date');
    } else {
      if (new Date(Date.parse(this.areaForm1.get('date2').value)).getMonth() !== null) {
        this.SensorSelected = 'ok';
        console.log('sensorselected: ' + this.SensorSelected)
        this.clearTable();
        console.log(this.CurrentSensor);
        if (this.idselectedsite !== undefined && this.idselectedline === undefined && this.idselecteddevice === undefined) {
          this.http.get('/api/Area/namesite/' + this.idselectedsite).subscribe(data => {
            console.log(data)
            const resSTR = JSON.stringify(data);
            const resJSON = JSON.parse(resSTR);
            this.namesite = resJSON;
            this.http.get('/api/Area/getsommesite/' + this.idselectedsite).subscribe(data2 => {
              console.log(data2)
              const resSTRR = JSON.stringify(data2);
              const resJSONN = JSON.parse(resSTRR);
              this.datasite = resJSONN;

              const Tablemonthsite = this.datasite;
              console.log(Tablemonthsite)

              this.SensorOneType = 'Consumption';
              const MM = new Date(Date.parse(Month));
              console.log(MM)
              let i = 0;

              let sommemonthsite = 0
              for (i = 0; i < Tablemonthsite.length; i++) {

                const DataDate = new Date(Tablemonthsite[i].time);
                //  console.log("DataDate: " + DataDate)

                console.log(new Date(Tablemonthsite[i].time).getDate())
                const CurentDate = new Date(Date.now());


                if (
                  MM.getMonth() === DataDate.getMonth()) {
                  console.log('true')


                  console.log(Tablemonthsite[i])
                  sommemonthsite += Tablemonthsite[i].electricconsumptions;
                  this.sitemonth.push(Tablemonthsite[i])
                }

              }
           
              console.log(this.sitemonth)


              const allmonth = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31]
              
              const distinctYears = new Set(this.sitemonth.map(item =>
                new Date (item.time).getFullYear()
                ));
                let  alldata=[]
                for (let k = 0; k < distinctYears.size; k++) {
                  let tab= []
                for (let i = 0; i < this.sitemonth.length; i++) {
                  if(new Date(this.sitemonth[i].time).getFullYear()===Array.from(distinctYears)[k]){
                    tab.push(this.sitemonth[i])
                  }
                }
                alldata.push(tab)
              }
              for(let j=0;j<31;j++)
              { let m=[]
                for (let k = 0; k < distinctYears.size; k++) {
              let dayConso=null;
              for (let i=0;i<alldata[k].length;i++) {
               try{
                if(new Date(alldata[k][i].time).getFullYear()===new Date(MM).getFullYear()){
                if (new Date(alldata[k][i].time).getDate() === allmonth[j])
                 {
                    if(dayConso===null)
                  {
                    dayConso=alldata[k][i].electricconsumptions;
                  }  
                  if(new Date(alldata[k][i].time).getDate() !==new Date(alldata[k][i+1].time).getDate()){ 
                    dayConso=alldata[k][i].electricconsumptions-dayConso;
                    m.push(dayConso)
                  }
                }
                else{
                  dayConso=alldata[k][i+1].electricconsumptions;
                }
              }
                
              }catch(e){
                if (e instanceof TypeError && e.message.includes("Cannot read properties of undefined (reading 'time')")) {
                  dayConso=alldata[k][i].electricconsumptions-dayConso;
                  m.push(dayConso)
                }
            }
          }
            }
            if (m.length > 0) {
              const d=m.reduce((total, current) => total + current, 0);
              this.datamonthsite.push(d)
            }
             else {
              this.datamonthsite.push(0)
            }
          }




              const label = [];
              for (let i = 0; i < allmonth.length; i++) {
                label.push(allmonth[i])
              }


              let sommemonthsiteall
              if (this.sitemonth[this.sitemonth.length - 1] ===
                undefined || this.sitemonth[0] === undefined) {
                sommemonthsiteall = 0;
              } else {
                sommemonthsiteall = this.sitemonth[this.sitemonth.length - 1].electricconsumptions - this.sitemonth[0].electricconsumptions
              }
              for (let i = 0; i < this.datamonthsite.length; i++) {
                // sommemonthsiteall+=this.datamonthsite[i]
                this.ExcelItem = {

                  'Site Name': this.selectedSite,
                  'Electric Consumption': this.datamonthsite[i] + 'Kwh',
                  'Month': this.month,
                  'Days': label[i]

                }
                this.datasetToExcel.push(this.ExcelItem)
              }

              this.barchartm = new Chart('canvas1', {
                type: 'bar',
                data: {
                  labels: label,
                  datasets: [
                    {
                      data: this.datamonthsite,
                      borderColor: '#b0bcb5',
                      backgroundColor: 'rgb(134,226,175)',
                      fill: true
                    }
                  ]
                },
                options: {
                  legend: {
                    display: false
                  },
                  scales: {
                    xAxes: [{
                      display: true
                    }],
                    yAxes: [{
                      display: true
                    }],
                  }
                }
              });


               
               this.consommation=this.datamonthsite.reduce((total, current) => total + current, 0).toString()+ ' ' + 'KWh';
              console.log(this.consommation)
            });
          });
        }
        if (this.idselectedsite !== undefined && this.idselectedline !== undefined && this.idselecteddevice === undefined) {
          this.http.get('/api/Ligne/nameline/' + this.idselectedline).subscribe(data => {
            console.log(data)
            const resSTR = JSON.stringify(data);
            const resJSON = JSON.parse(resSTR);
            this.nameline = resJSON;
            this.http.get('/api/Ligne/getsommeligne/' + this.idselectedline).subscribe(data2 => {
              console.log(data2)
              const resSTRR = JSON.stringify(data2);
              const resJSONN = JSON.parse(resSTRR);
              this.dataligne = resJSONN;

              const Tablemonthline = this.dataligne;
              console.log(Tablemonthline)

              this.SensorOneType = 'Consumption';
              const MM = new Date(Date.parse(Month));
              console.log(MM)
              let i = 0;

              let sommemonthline = 0
              for (i = 0; i < Tablemonthline.length ; i++) {

                const DataDate = new Date(Tablemonthline[i].time);

                if (
                  MM.getMonth() === DataDate.getMonth()) {
                  console.log('true')

                  console.log(Tablemonthline[i])
                  sommemonthline += Tablemonthline[i].electricconsumptions;
                  console.log(sommemonthline)
                  this.linemonth.push(Tablemonthline[i])
                }

              }
  
              console.log(this.linemonth)

              const allmonth = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,
                14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31]
                const distinctYears = new Set(this.linemonth.map(item =>
                  new Date (item.time).getFullYear()
                  ));
                  console.log("distinctYears",distinctYears)
                  let  alldata=[]
                  for (let k = 0; k < distinctYears.size; k++) {
                    let tab= []
                  for (let i = 0; i < this.linemonth.length; i++) {
                    if(new Date(this.linemonth[i].time).getFullYear()===Array.from(distinctYears)[k]){
                      tab.push(this.linemonth[i])
                    }
                  }
                  alldata.push(tab)
                }
    
                for(let j=0;j<31;j++)
              { let m=[]
                for (let k = 0; k < distinctYears.size; k++) {
              let dayConso=null;
              for (let i=0;i<alldata[k].length;i++) {
               try{
                if(new Date(alldata[k][i].time).getFullYear()===new Date(MM).getFullYear()){
                if (new Date(alldata[k][i].time).getDate() === allmonth[j])
                 {
                    if(dayConso===null)
                  {
                    dayConso=alldata[k][i].electricconsumptions;
                  }  
                  if(new Date(alldata[k][i].time).getDate() !==new Date(alldata[k][i+1].time).getDate()){ 
                    dayConso=alldata[k][i].electricconsumptions-dayConso;
                    m.push(dayConso)
                  }
                }
                else{
                  dayConso=alldata[k][i+1].electricconsumptions;
                }
              }
                
              }catch(e){
                if (e instanceof TypeError && e.message.includes("Cannot read properties of undefined (reading 'time')")) {
                  dayConso=alldata[k][i].electricconsumptions-dayConso;
                  m.push(dayConso)
                }
            }
          }
            }
            if (m.length > 0) {
              const d=m.reduce((total, current) => total + current, 0);
              this.datamonthline.push(d)
            }
             else {
              this.datamonthline.push(0)
            }
          }


              const label = [];
              for (let i = 0; i < allmonth.length; i++) {
                label.push(allmonth[i])
              }

              let sommemonthlineall
              if (this.linemonth[this.linemonth.length - 1] ===
                undefined || this.linemonth[0] === undefined) {
                sommemonthlineall = 0;
              } else {
                sommemonthlineall = this.linemonth[this.linemonth.length - 1].electricconsumptions - this.linemonth[0].electricconsumptions
              }

              for (let i = 0; i < this.datamonthline.length; i++) {
                //     sommemonthlineall+=  this.datamonthline[i]
                this.ExcelItem = {

                  'Line Name': this.selectedLine,
                  'Electric Consumption': this.datamonthline[i] + 'Kwh',
                  'Month': this.month,
                  'Days': label[i]

                }
                this.datasetToExcel.push(this.ExcelItem)
              }

              this.barchartm = new Chart('canvas1', {
                type: 'bar',
                data: {
                  labels: label,
                  datasets: [
                    {
                      data: this.datamonthline,
                      borderColor: '#b0bcb5',
                      backgroundColor: 'rgb(134,226,175)',
                      fill: true
                    }
                  ]
                },
                options: {
                  legend: {
                    display: false
                  },
                  scales: {
                    xAxes: [{
                      display: true
                    }],
                    yAxes: [{
                      display: true
                    }],
                  }
                }
              });


              console.log('SensorValue1: ' + sommemonthlineall)
              //     console.log("SensorValue2: " + this.DataTableTwo)
              this.consommation = this.datamonthline.reduce((total, current) => total + current, 0).toString()+ ' ' + 'KWh';

              console.log(this.consommation)



            });


          });
        }
        if (this.idselectedsite !== undefined && this.idselectedline !== undefined && this.idselecteddevice !== undefined) {
          this.http.get('/api/Device/namedevice/' + this.idselecteddevice).subscribe(data => {
            console.log(data)
            const resSTR = JSON.stringify(data);
            const resJSON = JSON.parse(resSTR);
            this.namedevice = resJSON;
            this.devicesService.getlightdata(this.idselecteddevice).subscribe(data2 => {
              console.log(data2)
              this.datadev = data2;

              this.dataLength = this.datadev.data.length;
              this.timeComp=this.datadev.data;

              function isLeapYear(year: number): boolean {
                return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
              }
              function getDaysInMonth(month: number, year: number): number {
                if (month === 2 && isLeapYear(year)) {
                  return 29; 
                } else {
                  return new Date(year, month, 0).getDate(); 
                }
              }
              const nbrDays = getDaysInMonth(this.month.slice(5,7), this.month.slice(0,4));    
         


              const Tablemonthdevice = this.datadev.data;
              console.log(Tablemonthdevice)

              this.SensorOneType = 'Consumption';


              const MM = new Date(Date.parse(Month));
              let i = 0;
              let sommemonthdevice = 0
              console.log(this.dataLength)
             

              for (i = 0; i < this.dataLength - 1; i++) {
                console.log(Tablemonthdevice[i].time)
                const DataDate = new Date(Tablemonthdevice[i].time);

                if (
                  MM.getMonth() === DataDate.getMonth()) {

                  console.log(Tablemonthdevice[i])
                  sommemonthdevice += Tablemonthdevice[i].electricconsumptions;
                  console.log(sommemonthdevice)


                  this.devicemonth.push(Tablemonthdevice[i])
                }

              }
     
              console.log(this.devicemonth)

              const allmonth = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,
                12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31]
                const distinctYears = new Set(this.devicemonth.map(item =>
                new Date (item.time).getFullYear()
                ));
              let  alldata=[]
            console.log(distinctYears)
            console.log(Array.from(distinctYears)[0])

              for (let k = 0; k < distinctYears.size; k++) {
                let tab= []
              for (let i = 0; i < this.devicemonth.length; i++) {
                if(new Date(this.devicemonth[i].time).getFullYear()===Array.from(distinctYears)[k]){
                  tab.push(this.devicemonth[i])
                }
              }
              alldata.push(tab)
            }
            for(let j=0;j<31;j++){
              let m=[]
            for (let k = 0; k < distinctYears.size; k++) {
                for(let i=0;i<alldata[k].length;i++){
                  if(new Date(alldata[k][i].time).getFullYear()===new Date(MM).getFullYear()){
                 if (new Date(alldata[k][i].time).getDate() === allmonth[j]) {
                   m.push(alldata[k][i].electricconsumptions)
                  }
                }
              }
            } if (m.length > 0) {
              const d = m[m.length - 1] - m[0]
              this.datamonthdevice.push(d)
            } else {
              this.datamonthdevice.push(0)
            }
             
            }
        

              const label = [];
              for (let i = 0; i < allmonth.length; i++) {
                label.push(allmonth[i])
              }
              let sommemonthdeviceall
              if (this.devicemonth[this.devicemonth.length - 1] ===
                undefined || this.devicemonth[0] === undefined) {
                sommemonthdeviceall = 0;
              } else {
                sommemonthdeviceall = this.devicemonth[this.devicemonth.length - 1].electricconsumptions - this.devicemonth[0].electricconsumptions
              }

              for (let i = 0; i < this.datamonthdevice.length; i++) {
                this.ExcelItem = {

                  'DeviceName': this.selectedDevice,
                  'Type': this.datadev.type,
                  'Electric Consumption': this.datamonthdevice[i] + 'Khw',
                  'Month': this.month,
                  'Days': label[i]

                }
                this.datasetToExcel.push(this.ExcelItem)
              }

              this.barchart = new Chart('canvas1', {
                type: 'bar',
                data: {
                  labels: label,
                  datasets: [
                    {
                      data: this.datamonthdevice,
                      borderColor: '#b0bcb5',
                      backgroundColor: 'rgb(134,226,175)',
                      fill: true
                    }
                  ]
                },
                options: {
                  legend: {
                    display: false
                  },
                  scales: {
                    xAxes: [{
                      display: true
                    }],
                    yAxes: [{
                      display: true
                    }],
                  }
                }
              });
              

              console.log('SensorValue1: ' + sommemonthdeviceall)
              //     console.log("SensorValue2: " + this.DataTableTwo)
              this.consommation = this.datamonthdevice.reduce((total, current) => total + current, 0).toString()+ ' ' + 'KWh';

              console.log(this.consommation)

            });
          });

        }
      }
    }
  }

  gettotal() {
    this.OneDay = null
    this.dateFin = null
    this.dateDebut = null
    this.month = null;
    this.dataonedline = [];
    this.dataoneddevice = [];
    this.datadev = [];
    this.totalsite = [];
    this.datadev = [];
    this.totalsite  = [];
    this.totalline = [];
    this.totaldevice = [];
    this.SensorSelected = 'ok';
      console.log('sensorselected: ' + this.SensorSelected)
      this.clearTable();
      console.log(this.CurrentSensor)
      if (this.idselectedsite !== undefined && this.idselectedline === undefined && this.idselecteddevice === undefined) {
        this.http.get('/api/Area/namesite/' + this.idselectedsite).subscribe(data => {
          console.log(data)
          const resSTR = JSON.stringify(data);
          const resJSON = JSON.parse(resSTR);
          this.namesite = resJSON;

          this.http.get('/api/Area/getsommesite/' + this.idselectedsite).subscribe(data2 => {
            console.log(data2)
            this.datadev = data2;
            const resSTRR = JSON.stringify(data2);
            const resJSONN = JSON.parse(resSTRR);
            //  this.dataLength = this.datadev.data.length;
            console.log(this.dataLength)
            //  this.LastSensorTemp = new Date(this.datadev.data[this.datadev.data.length - 1].time);
            console.log(this.LastSensorTemp)
            // this.DataTimePath = this.CurrentSensor.data;
            const Tabletotalsite = resJSONN;
            console.log(Tabletotalsite)

            if (Tabletotalsite.length === 0) {
              alert('no data');
            } else {
              this.SensorOneType = 'Consumption';
              const years = [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028]
      


              for(let i=0;i<years.length;i++){
                this.totalsite.push(getTotalData(years[i],Tabletotalsite));
              }

              for (let i = 0; i < this.totalsite.length; i++) {
                this.ExcelItem = {

                  'Device Name': this.selectedSite,
                  'Electric Consumption': this.totalsite[i] + 'Kwh',
                  'Year': years[i],
                }
                this.datasetToExcel.push(this.ExcelItem)
              }
              this.barchart = new Chart('canvas3', {
                type: 'bar',
                data: {
                  labels: years,

                  datasets: [
                    {
                      data: this.totalsite,
                      borderColor: '#b0bcb5',
                      backgroundColor: 'rgb(134,226,175)',
                      fill: true
                    }
                  ]
                },
                options: {
                  legend: {
                    display: false
                  },
                  scales: {
                    xAxes: [{
                      display: true
                    }],
                    yAxes: [{
                      display: true
                    }],
                  }
                }
              });

            }
          });
        });
      }
      if (this.idselectedsite !== undefined && this.idselectedline !== undefined && this.idselecteddevice === undefined) {
        this.http.get('/api/Ligne/nameline/' + this.idselectedline).subscribe(data => {
          console.log(data)
          const resSTR = JSON.stringify(data);
          const resJSON = JSON.parse(resSTR);
          this.nameline = resJSON;

          this.http.get('/api/Ligne/getsommeligne/' + this.idselectedline).subscribe(data2 => {
            console.log(data2)
            const resSTRR = JSON.stringify(data2);
            const resJSONN = JSON.parse(resSTRR);
            const Tabletotalline = resJSONN;
            console.log(Tabletotalline)
            if (Tabletotalline.length === 0) {
              alert('no data');
            } else {
              this.SensorOneType = 'Consumption';


              const years = [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028]
        
              
              for(let i=0;i<years.length;i++){
                this.totalline.push(getTotalData(years[i],Tabletotalline));
              }


              for (let i = 0; i < this.totalline.length; i++) {
                this.ExcelItem = {

                  'Device Name': this.selectedLine,
                  'Electric Consumption': this.totalline[i] + 'Kwh',
                  'Year': years[i],
                }
                this.datasetToExcel.push(this.ExcelItem)
              }

              this.barchart = new Chart('canvas3', {
                type: 'bar',
                data: {
                  labels: years,

                  datasets: [
                    {
                      data: this.totalline,
                      borderColor: '#b0bcb5',
                      backgroundColor: 'rgb(134,226,175)',
                      fill: true
                    }
                  ]
                },
                options: {
                  legend: {
                    display: false
                  },
                  scales: {
                    xAxes: [{
                      display: true
                    }],
                    yAxes: [{
                      display: true
                    }],
                  }
                }
              });
            }
          });
        });
      }
      if (this.idselectedsite !== undefined && this.idselectedline !== undefined && this.idselecteddevice !== undefined) {
        this.http.get('/api/Device/namedevice/' + this.idselecteddevice).subscribe(data => {
          console.log(data)
          const resSTR = JSON.stringify(data);
          const resJSON = JSON.parse(resSTR);
          this.namedevice = resJSON;

          this.devicesService.getlightdata(this.idselecteddevice).subscribe(data2 => {
            console.log(data2)
            this.datadev = data2;

            this.dataLength = this.datadev.data.length;
            console.log(this.dataLength)
            this.LastSensorTemp = new Date(this.datadev.data[this.datadev.data.length - 1].time);
            console.log(this.LastSensorTemp)

            const Tabletotaldevice = this.datadev.data;
            console.log(Tabletotaldevice)

            if (Tabletotaldevice.length === 0) {
              alert('Select Date');
            } else {
              this.SensorOneType = 'Consumption';


              const years = [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028]
      
              for (let i=0;i<years.length;i++){
                let tab =[];
                let data =0;
                for(let j=0;j<Tabletotaldevice.length;j++){
                  if(years[i]===new Date(Tabletotaldevice[j].time).getFullYear()){
                  tab.push(Tabletotaldevice[j].electricconsumptions);
                  }
                  data = tab[tab.length-1]-tab[0]; 
                }
                this.totaldevice.push(data);
              }
              for (let i = 0; i < this.totaldevice.length; i++) {
                this.ExcelItem = {

                  'Device Name': this.selectedDevice,
                  'Electric Consumption': this.totaldevice[i] + 'Kwh',
                  'Year': years[i],
                }
                this.datasetToExcel.push(this.ExcelItem)
              }

              this.barchart = new Chart('canvas3', {
                type: 'bar',
                data: {
                  labels: years,

                  datasets: [
                    {
                      data: this.totaldevice,
                      borderColor: '#b0bcb5',
                      backgroundColor: 'rgb(134,226,175)',
                      fill: true
                    }
                  ]
                },
                options: {
                  legend: {
                    display: false
                  },
                  scales: {
                    xAxes: [{
                      display: true
                    }],
                    yAxes: [{
                      display: true
                    }],
                  }
                }
              });


              //  this.consommation = sommedaysiteall.toString().substring(0, 5) + ' ' + 'KWh'


//
            }

          });
        });
      }
  }

  clearTable() {
    // this.label = [];
    this.DataTableOne = []
    this.TableOneDataPath = [];
    this.CurrentSensor = null;
    this.datasetToExcel = [];
    // this.labelconso=[];
    this.consommation = null;
    // this.SensorSelected="ok";
// this.dataconso=null;
    // this.labelconso=null;
    //   this.labelconsosite=null;
    this.sommedata = null;
    this.tabledata = []
    this.devv = [];
    this.test = null;
    this.datasites = null;
    this.conc = [];
    this.test2 = null;
    this.alldevices = [];
    this.al = [];
    this.alldev = [];
    this.datas = null;
    this.tabledata = null;
    this.testtt = null;
    this.alltest = [];
    this.concat = null;
    this.datasite = null;

    this.datadev = null;
    this.dataLength = null;
    this.labelline = [];
    // private dataconso: any[];
    // private labelconso: any[];
    this.sommedata = null;

    this.devv = [];
    this.test = null;
    this.datasites = null;
    this.conc = [];
    this.test2 = null;
    this.alldevices = [];
    this.al = [];
    this.alldev = [];
    this.datas = null;
    this.tabledata = null;
    this.testtt = null;
    this.alltest = [];

    this.concat = null;
    // private dataaa: any;
    this.DataTableOne1 = [];
    this.DataTableOne2 = [];
    this.TableOneDataPath1 = null;
    this.TableOneDataPath2 = null;
    // labelconsoligne;
    this.dataligne = null;
    this.concat2 = null;
    this.devvv = [];
    this.devsl = null;
    this.testl = null;
    this.alltestligne = [];
    this.devicesligne = null;
    this.testligne = null;
    this.alldevicesligne = [];
    this.alldevligne = null;
    this.label2 = [];
    this.devvsite = [];
    this.alltestsite = [];
    this.alldevicessite = [];
    this.datadevsite = null;
    this.concatsite = null;
    this.alldevsite = null;
    this.testttsite = [];
    this.testsite = null;

    this.devsite = [];

    this.labelconsosite = null;
    this.labelsite = [];
    this.alsite = null;
    this.DataTableOne = [];
    this.LastSensorTemp = null;
    this.TableOneDataPath = null;


  }

  getonedayprice() {
    this.yearp = null
    this.TableOneDataPath1 = null;
    this.TableOneDataPath2 = null;
    this.TableOneDataPath = null;
    this.consommationp = null;
    this.datasitepone = [];
    this.siteOnep = [];
    this.dataonedsitep1 = [];
    this.namesitep1 = [];
    console.log(this.idselectedsite)
    this.rania = [];
    this.dataonedsite = [];
    this.dataonedline = [];
    this.dataoneddevice = [];
    this.datalignep1 = [];
    this.lineonep1 = [];
    this.dataonedlinep = [];
    const OD = new Date(this.OneDayp);
    if (this.price === undefined) {
      alert('choose price')
    } else {
    if (this.OneDayp === undefined) {
      alert('choose date')
    } else {
      if (OD.getFullYear() !== 1970) {
        this.SensorSelected = 'ok';
        console.log('sensorselected: ' + this.SensorSelected)
        this.clearTable();
        console.log(this.CurrentSensor)
        if (this.idselectedsite !== undefined && this.idselectedline === undefined && this.idselecteddevice === undefined) {
          this.http.get('/api/Area/getsommesite/' + this.idselectedsite).subscribe(data => {
            console.log(data)
            const resSTR = JSON.stringify(data);
            const resJSON = JSON.parse(resSTR);
            this.datasitepone = resJSON;

            this.http.get('/api/Area/namesite/' + this.idselectedsite).subscribe(data2 => {
              console.log(data2)
              const resSTRR = JSON.stringify(data2);
              const resJSONN = JSON.parse(resSTRR);
              this.namesitep1 = resJSONN

              const Tabledaysitepone = this.datasitepone;
              console.log(Tabledaysitepone)

              let i = 0;
              console.log(Tabledaysitepone)
              for (i = 0; i < Tabledaysitepone.length - 1; i++) {

                const DataDate = new Date(Tabledaysitepone[i].time);


                if (OD.getDate() == DataDate.getDate() &&
                  OD.getMonth() == DataDate.getMonth() && OD.getFullYear() == DataDate.getFullYear()) {

                  this.labelsite.push(DataDate.getFullYear() + '/' + (DataDate.getMonth() + 1)
                    + '/' + DataDate.getDate() + ' , '
                    + DataDate.getHours());


                  this.siteOnep.push(Tabledaysitepone[i])
                }

              }

      
              let tab=0
              let con=this.siteOnep[0].electricconsumptions;
              for (let i = 1; i < this.siteOnep.length; i++) {
              if(this.siteOnep[i].time<this.siteOnep[i-1].time)
              { 
                con=this.siteOnep[i-1].electricconsumptions-con;
                tab+=con;
                con=this.siteOnep[i].electricconsumptions;

              }
              if (i==this.siteOnep.length-1){
                tab+=this.siteOnep[i].electricconsumptions-con;
              }
            }
        


              this.FactureData.push(this.selectedSite)

              this.FactureData.push(tab* this.price)
              if (this.siteOnep[this.siteOnep.length - 1] ===
                undefined || this.siteOnep[0] === undefined) {
                this.FactureData.push(0)

              } else {
                this.FactureData.push(tab)
              }
              this.FactureData.push(this.price)
              console.log(this.OneDayp)
              this.FactureData.push(this.OneDayp)
              console.log(this.FactureData)
              this.ligneService.FactureStat(this.FactureData)
              this.consommationp = this.price*tab + ' ' + 'KWh'

            });
          });
        }
        if (this.idselectedsite !== undefined && this.idselectedline !== undefined && this.idselecteddevice === undefined) {
          this.http.get('/api/Ligne/nameline/' + this.idselectedline).subscribe(data => {
            console.log(data)
            const resSTR = JSON.stringify(data);
            const resJSON = JSON.parse(resSTR);
            this.namelinep1 = resJSON;
            this.http.get('/api/Ligne/getsommeligne/' + this.idselectedline).subscribe(data2 => {
              console.log(data2)
              const resSTRR = JSON.stringify(data2);
              const resJSONN = JSON.parse(resSTRR);
              this.datalignep1 = resJSONN;
              console.log(this.datalignep1)

              const Tabledaylinep1 = this.datalignep1;
              console.log(Tabledaylinep1)

              this.SensorOneType = 'Consumption';
              let i = 0;

              let sommedaylinep1 = 0
              for (i = 0; i < Tabledaylinep1.length; i++) {
                let min;

                const DataDate = new Date(Tabledaylinep1[i].time);
                console.log('DataDate: ' + DataDate)

                console.log(new Date(Tabledaylinep1[i].time).getDate())
                const CurentDate = new Date(Date.now());

                if ((OD.getDate() === DataDate.getDate() &&
                  OD.getMonth() === DataDate.getMonth() && OD.getFullYear() === DataDate.getFullYear())) {

                  console.log(Tabledaylinep1[i])
                  sommedaylinep1 += Tabledaylinep1[i].electricconsumptions;
                  console.log(sommedaylinep1)
                  this.lineonep1.push(Tabledaylinep1[i])
                }
              }
              console.log(this.lineonep1)
              let tab=0
              let con=this.lineonep1[0].electricconsumptions;
              for (let i = 1; i < this.lineonep1.length; i++) {
              if(this.lineonep1[i].time<this.lineonep1[i-1].time)
              { 
                con=this.lineonep1[i-1].electricconsumptions-con;
                tab+=con;
                con=this.lineonep1[i].electricconsumptions;

              }
              if (i==this.lineonep1.length-1){
                tab+=this.lineonep1[i].electricconsumptions-con;
              }
            }
              this.FactureData.push(this.selectedLine)

              this.FactureData.push(tab* this.price)
              if (this.lineonep1[this.lineonep1.length - 1] ===
                undefined || this.lineonep1[0] === undefined) {
                this.FactureData.push(0)

              } else {
                this.FactureData.push(tab)
              }
              this.FactureData.push(this.price)
              console.log(this.OneDayp)
              this.FactureData.push(this.OneDayp)
              console.log(this.FactureData)
              this.ligneService.FactureStat(this.FactureData)
              this.consommationp = this.price*tab + ' ' + 'KWh'

          

            });
          });
        }
        if (this.idselectedsite !== undefined && this.idselectedline !== undefined && this.idselecteddevice !== undefined) {
          this.http.get('/api/Device/namedevice/' + this.idselecteddevice).subscribe(data => {
            console.log(data)
            this.namedevicep = data;
            this.devicesService.getlightdata(this.idselecteddevice).subscribe(data2 => {
              console.log(data2)
              this.datadevp1 = data2;

              this.dataLengthp1 = this.datadevp1.data.length;
              console.log(this.dataLengthp1)

              const Tabledaydevicep1 = this.datadevp1.data;
              console.log(Tabledaydevicep1)

              this.SensorOneType = 'Consumption';

              let i = 0;

              let sommedaydevicep1 = 0
              for (i = 0; i < this.dataLengthp1; i++) {


                const DataDate = new Date(Tabledaydevicep1[i].time);
                console.log('DataDate: ' + DataDate)

                console.log(new Date(Tabledaydevicep1[i].time).getDate())


                if ((OD.getDate() === DataDate.getDate() &&
                  OD.getMonth() === DataDate.getMonth() && OD.getFullYear() === DataDate.getFullYear())) {


                  console.log(Tabledaydevicep1[i])
                  sommedaydevicep1 += Tabledaydevicep1[i].electricconsumptions;
                  console.log(sommedaydevicep1)


                  this.deviceonep1.push(Tabledaydevicep1[i])
                }

              }
              const lab=[]
              const con=[0]
              for (let i = 0; i < this.deviceonep1.length; i++) {
              lab.push(this.deviceonep1[i].time.slice(11, 16))
              if(i>0)
              con.push(this.deviceonep1[i].electricconsumptions-this.deviceonep1[i-1].electricconsumptions)
              }

              const sommedaydeviceallp1 = (this.deviceonep1[this.deviceonep1.length - 1].electricconsumptions
                - this.deviceonep1[0].electricconsumptions) * this.price;
              console.log(sommedaydeviceallp1)
              let pricedevbone = 0
              const tableonedevprice = [];
              for (let i = 0; i < this.dataoneddevicep1.length; i++) {
                pricedevbone = this.dataoneddevicep1[i] * this.price;
                tableonedevprice.push(pricedevbone)
              }
              console.log(tableonedevprice)


     
              this.FactureData.push(this.selectedDevice)
              this.FactureData.push(sommedaydeviceallp1)
              if (this.deviceonep1[this.deviceonep1.length - 1] ===
                undefined || this.deviceonep1[0] === undefined) {
                this.FactureData.push(0)
              } else {
                this.FactureData.push(this.deviceonep1[this.deviceonep1.length - 1].electricconsumptions -
                  this.deviceonep1[0].electricconsumptions)
              }
              this.FactureData.push(this.price)
              console.log(this.OneDayp)
              this.FactureData.push(this.OneDayp)
              console.log(this.FactureData)
              this.ligneService.FactureStat(this.FactureData)
              this.consommationp = (this.price*con.reduce((total, current) => total + current, 0)).toString() + ' ' + 'millimes'

              console.log(this.consommationp)

            });
          });
        }
      }
    }
  }
  }

  getmonthprice() {
    this.OneDayp = null
    this.yearp = null
    this.rania = [];
    this.datadevpm = [];
    this.dataonedsite = [];
    this.dataonedline = [];
    this.dataoneddevice = [];
    this.datasitepm = [];
    this.datamonthsitepm = [];
    this.sitemonthpm = [];
    this.datalignepm = [];
    this.linemonthpm = [];
    this.devicemonthpm = [];
    this.datamonthdevicep = [];
    const Monthp = this.monthp;
    console.log(Monthp)
    if (this.price === undefined) {
      alert('choose price')
    } else {
      if (this.monthp === undefined) {
        alert('choose date')
      } else {
    if (new Date(Date.parse(Monthp)).getMonth() !== null)  {
        this.SensorSelected = 'ok';
        console.log('sensorselected: ' + this.SensorSelected)
        this.clearTable();
        console.log(this.CurrentSensor);
        if (this.idselectedsite !== undefined && this.idselectedline === undefined && this.idselecteddevice === undefined) {
          this.http.get('/api/Area/namesite/' + this.idselectedsite).subscribe(data => {
            console.log(data)
            const resSTR = JSON.stringify(data);
            const resJSON = JSON.parse(resSTR);
            this.namesitepm = resJSON;
            this.http.get('/api/Area/getsommesite/' + this.idselectedsite).subscribe(data2 => {
              console.log(data2)
              const resSTRR = JSON.stringify(data2);
              const resJSONN = JSON.parse(resSTRR);
              this.datasitepm = resJSONN;

              const Tablemonthsitepm = this.datasitepm;
              if ( Tablemonthsitepm.length === 0) {
                alert('no data');
                const allmonth = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,
                  12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31]
                this.barchartp2 = new Chart('canvasp2', {
                  type: 'bar',
                  data: {
                    labels: allmonth,
                    datasets: [
                      {
                        data: 0,
                        borderColor: '#9fa9a4',
                        backgroundColor: 'rgb(154,165,154)',
                        fill: true
                      }
                    ]
                  },
                  options: {
                    legend: {
                      display: false
                    },
                    scales: {
                      xAxes: [{
                        display: true
                      }],
                      yAxes: [{
                        display: true
                      }],
                    }
                  }
                });
                this.FactureData.push(0)
                this.FactureData.push(0)
                this.FactureData.push(0)
                this.FactureData.push(0)
                this.ligneService.FactureStat(this.FactureData)
                this.consommationpy = '0' + ' ' + 'millimes'
              } else {
                console.log(Tablemonthsitepm)

                this.SensorOneType = 'Consumption';
                const MM = new Date(Date.parse(Monthp));
                console.log(MM)
                let i = 0;

                let sommemonthsitepm = 0
                for (i = 0; i < Tablemonthsitepm.length - 1; i++) {

                  const DataDate = new Date(Tablemonthsitepm[i].time);
                  console.log('DataDate: ' + DataDate)

                  console.log(new Date(Tablemonthsitepm[i].time).getDate())
                  const CurentDate = new Date(Date.now());


                  if (
                    MM.getMonth() === DataDate.getMonth()) {
                    console.log('true')

                    console.log(Tablemonthsitepm[i])
                    sommemonthsitepm += Tablemonthsitepm[i].electricconsumptions;
                    console.log(sommemonthsitepm)
                    this.sitemonthpm.push(Tablemonthsitepm[i])
                  }

                }
         
                console.log(this.sitemonthpm)

                const allmonth = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,
                  12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31]
                
                  const distinctYears = new Set(this.sitemonthpm.map(item =>
                    new Date (item.time).getFullYear()
                    ));
                    console.log("distinctYears",distinctYears)
                    let  alldata=[]
                    for (let k = 0; k < distinctYears.size; k++) {
                      let tab= []
                    for (let i = 0; i < this.sitemonthpm.length; i++) {
                      if(new Date(this.sitemonthpm[i].time).getFullYear()===Array.from(distinctYears)[k]){
                        tab.push(this.sitemonthpm[i])
                      }
                    }
                    alldata.push(tab)
                  }
                  for(let j=0;j<31;j++)
                  { let m=[]
                    for (let k = 0; k < distinctYears.size; k++) {
                  let dayConso=null;
                  for (let i=0;i<alldata[k].length;i++) {
                   try{
                    if(new Date(alldata[k][i].time).getFullYear()===new Date(MM).getFullYear()){
                    if (new Date(alldata[k][i].time).getDate() === allmonth[j])
                     {
                        if(dayConso===null)
                      {
                        dayConso=alldata[k][i].electricconsumptions;
                      }  
                      if(new Date(alldata[k][i].time).getDate() !==new Date(alldata[k][i+1].time).getDate()){ 
                        dayConso=alldata[k][i].electricconsumptions-dayConso;
                        m.push(dayConso)
                      }
                    }
                    else{
                      dayConso=alldata[k][i+1].electricconsumptions;
                    }
                  }
                    
                  }catch(e){
                    if (e instanceof TypeError && e.message.includes("Cannot read properties of undefined (reading 'time')")) {
                      dayConso=alldata[k][i].electricconsumptions-dayConso;
                      m.push(dayConso)
                    }
                }
              }
                }
                if (m.length > 0) {
                  const d=m.reduce((total, current) => total + current, 0);
                  this.datamonthsitepm.push(d)
                }
                 else {
                  this.datamonthsitepm.push(0)
                }
              }
                 
                console.log(this.datamonthsitepm)

                const label = [];
                for (let i = 0; i < allmonth.length; i++) {
                  label.push(allmonth[i])
                }
                  console.log(this.sitemonthpm);
                if ( this.sitemonthpm.length === 0) {
                  alert('no data')
                  const allmonth = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,
                    12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31]
                  this.barchartp2 = new Chart('canvasp2', {
                    type: 'bar',
                    data: {
                      labels: allmonth,
                      datasets: [
                        {
                          data: 0,
                          borderColor: '#9fa9a4',
                          backgroundColor: 'rgb(154,165,154)',
                          fill: true
                        }
                      ]
                    },
                    options: {
                      legend: {
                        display: false
                      },
                      scales: {
                        xAxes: [{
                          display: true
                        }],
                        yAxes: [{
                          display: true
                        }],
                      }
                    }
                  });
                  this.FactureData.push(0)
                  this.FactureData.push(0)
                  this.FactureData.push(0)
                  this.FactureData.push(0)
                  this.ligneService.FactureStat(this.FactureData)
                  this.consommationpy = '0' + ' ' + 'millimes'
                } else {


                  const sommemonthsiteallpm = (this.sitemonthpm[this.sitemonthpm.length - 1].electricconsumptions -
                    this.sitemonthpm[0].electricconsumptions) * this.price;
                  let pricesitepm = 0
                  const tablesiteepm = [];
                  for (let i = 0; i < this.datamonthsitepm.length; i++) {
                    pricesitepm = this.datamonthsitepm[i] * this.price;
                    tablesiteepm.push(pricesitepm)

                  }
                  console.log(tablesiteepm)

                  this.barchartp2 = new Chart('canvasp2', {
                    type: 'bar',
                    data: {
                      labels: label,
                      datasets: [
                        {
                          data: tablesiteepm,
                          borderColor: '#9fa9a4',
                          backgroundColor: 'rgb(154,165,154)',
                          fill: true
                        }
                      ]
                    },
                    options: {
                      legend: {
                        display: false
                      },
                      scales: {
                        xAxes: [{
                          display: true
                        }],
                        yAxes: [{
                          display: true
                        }],
                      }
                    }
                  });

                  this.consommationpm = this.price*this.datamonthsitepm.reduce((total, current) => total + current, 0).toString()+ ' ' + 'millimes';

                  this.FactureData.push(this.selectedSite)

                  this.FactureData.push(this.price*this.datamonthsitepm.reduce((total, current) => total + current, 0))
                  this.FactureData.push(this.datamonthsitepm.reduce((total, current) => total + current, 0))
                  this.FactureData.push(this.price)
                  console.log(this.monthp)
                  this.FactureData.push(this.monthp)
                  console.log(this.FactureData)
                  this.ligneService.FactureStat(this.FactureData)


                  console.log('SensorValue1: ' + sommemonthsiteallpm)

                  


                  console.log(this.consommationpm)


                }
              }
            });
          });
        }
        if (this.idselectedsite !== undefined && this.idselectedline !== undefined && this.idselecteddevice === undefined) {
          this.http.get('/api/Ligne/nameline/' + this.idselectedline).subscribe(data => {
            console.log(data)
            const resSTR = JSON.stringify(data);
            const resJSON = JSON.parse(resSTR);
            this.namelinepm = resJSON;
            this.http.get('/api/Ligne/getsommeligne/' + this.idselectedline).subscribe(data2 => {
              console.log(data2)
              const resSTRR = JSON.stringify(data2);
              const resJSONN = JSON.parse(resSTRR);
              this.datalignepm = resJSONN;

              const Tablemonthlinepm = this.datalignepm;
              console.log(Tablemonthlinepm)
              if ( this.datalignepm.length === 0) {
                alert('no data')
                const allmonth = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,
                  12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31]
                this.barchartp2 = new Chart('canvasp2', {
                  type: 'bar',
                  data: {
                    labels: allmonth,
                    datasets: [
                      {
                        data: 0,
                        borderColor: '#9fa9a4',
                        backgroundColor: 'rgb(154,165,154)',
                        fill: true
                      }
                    ]
                  },
                  options: {
                    legend: {
                      display: false
                    },
                    scales: {
                      xAxes: [{
                        display: true
                      }],
                      yAxes: [{
                        display: true
                      }],
                    }
                  }
                });
                this.FactureData.push(0)
                this.FactureData.push(0)
                this.FactureData.push(0)
                this.FactureData.push(0)
                this.ligneService.FactureStat(this.FactureData)
                this.consommationpy = '0' + ' ' + 'millimes'
              } else {
                this.SensorOneType = 'Consumption';
                const MM = new Date(Date.parse(Monthp));
                console.log(MM)
                let i = 0;

                let sommemonthlinepm = 0
                for (i = 0; i < Tablemonthlinepm.length - 1; i++) {
                  const DataDate = new Date(Tablemonthlinepm[i].time);

                  if (
                    MM.getMonth() === DataDate.getMonth()) {
                    console.log('true')

                    console.log(Tablemonthlinepm[i])
                    sommemonthlinepm += Tablemonthlinepm[i].electricconsumptions;
                    console.log(Tablemonthlinepm)
                    this.linemonthpm.push(Tablemonthlinepm[i])
                  }

                }
               
                console.log(this.linemonthpm)

                const allmonth = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,
                  14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31]
                 
                  
                  const distinctYears = new Set(this.linemonthpm.map(item =>
                    new Date (item.time).getFullYear()
                    ));
                    let  alldata=[]
                    for (let k = 0; k < distinctYears.size; k++) {
                      let tab= []
                    for (let i = 0; i < this.linemonthpm.length; i++) {
                      if(new Date(this.linemonthpm[i].time).getFullYear()===Array.from(distinctYears)[k]){
                        tab.push(this.linemonthpm[i])
                      }
                    }
                    alldata.push(tab)
                  }
                  for(let j=0;j<31;j++)
                  { let m=[]
                    for (let k = 0; k < distinctYears.size; k++) {
                  let dayConso=null;
                  for (let i=0;i<alldata[k].length;i++) {
                   try{
                    if(new Date(alldata[k][i].time).getFullYear()===new Date(MM).getFullYear()){
                    if (new Date(alldata[k][i].time).getDate() === allmonth[j])
                     {
                        if(dayConso===null)
                      {
                        dayConso=alldata[k][i].electricconsumptions;
                      }  
                      if(new Date(alldata[k][i].time).getDate() !==new Date(alldata[k][i+1].time).getDate()){ 
                        dayConso=alldata[k][i].electricconsumptions-dayConso;
                        m.push(dayConso)
                      }
                    }
                    else{
                      dayConso=alldata[k][i+1].electricconsumptions;
                    }
                  }
                    
                  }catch(e){
                    if (e instanceof TypeError && e.message.includes("Cannot read properties of undefined (reading 'time')")) {
                      dayConso=alldata[k][i].electricconsumptions-dayConso;
                      m.push(dayConso)
                    }
                }
              }
                }
                if (m.length > 0) {
                  const d=m.reduce((total, current) => total + current, 0);
                  this.datamonthlinepm.push(d)
                }
                 else {
                  this.datamonthlinepm.push(0)
                }
              }

                const label = [];
                for (let i = 0; i < allmonth.length; i++) {
                  label.push(allmonth[i])
                }
                if ( this.linemonthpm.length === 0) {
                  alert('no data')
                  this.barchartp2 = new Chart('canvasp2', {
                    type: 'bar',
                    data: {
                      labels: 'label',
                      datasets: [
                        {
                          data: 0,
                          borderColor: '#9fa9a4',
                          backgroundColor: 'rgb(154,165,154)',
                          fill: true
                        }
                      ]
                    },
                    options: {
                      legend: {
                        display: false
                      },
                      scales: {
                        xAxes: [{
                          display: true
                        }],
                        yAxes: [{
                          display: true
                        }],
                      }
                    }
                  });
                  this.FactureData.push(0)
                  this.FactureData.push(0)
                  this.FactureData.push(0)
                  this.FactureData.push(0)
                  this.ligneService.FactureStat(this.FactureData)
                  this.consommationpy = '0' + ' ' + 'millimes'
                } else {
                  const sommemonthlineallpm = (this.linemonthpm[this.linemonthpm.length - 1].electricconsumptions
                    - this.linemonthpm[0].electricconsumptions) * this.price;

                  let pricelinepm = 0
                  const tablelinepm = [];
                  for (let i = 0; i < this.datamonthlinepm.length; i++) {
                    pricelinepm = this.datamonthlinepm[i] * this.price;
                    tablelinepm.push(pricelinepm)
                    this.ExcelItem = {

                      'Line Name': this.namelinepm,
                      'Electric Consumption': this.datamonthlinepm[i] + 'millimes',
                      'Month': label[i],

                    }
                    this.datasetToExcel.push(this.ExcelItem)
                  }
                  console.log(tablelinepm)


                  this.barchartp2 = new Chart('canvasp2', {
                    type: 'bar',
                    data: {
                      labels: label,
                      datasets: [
                        {
                          data: tablelinepm,
                          borderColor: '#9fa9a4',
                          backgroundColor: 'rgb(154,165,154)',
                          fill: true
                        }
                      ]
                    },
                    options: {
                      legend: {
                        display: false
                      },
                      scales: {
                        xAxes: [{
                          display: true
                        }],
                        yAxes: [{
                          display: true
                        }],
                      }
                    }
                  });

                  this.FactureData.push(this.selectedLine)

                  this.FactureData.push(this.price*this.datamonthlinepm.reduce((total, current) => total + current, 0))
                  this.FactureData.push(this.datamonthlinepm.reduce((total, current) => total + current, 0))
                  this.FactureData.push(this.price)
                  console.log(this.monthp)
                  this.FactureData.push(this.monthp)
                  console.log(this.FactureData)
                  this.ligneService.FactureStat(this.FactureData)
                  this.consommationpm = this.price*this.datamonthlinepm.reduce((total, current) => total + current, 0).toString()+ ' ' + 'millimes';

                  console.log(this.consommationpm)

                }
              }
            });


          });
        }
        if (this.idselectedsite !== undefined && this.idselectedline !== undefined && this.idselecteddevice !== undefined) {
          this.http.get('/api/Device/namedevice/' + this.idselecteddevice).subscribe(data => {
            console.log(data)
            const resSTR = JSON.stringify(data);
            const resJSON = JSON.parse(resSTR);
            this.namedevicepm = resJSON;
            this.devicesService.getlightdata(this.idselecteddevice).subscribe(data2 => {
              console.log(data2)
              this.datadevpm = data2;

              this.dataLengthpm = this.datadevpm.data.length;
              console.log(this.dataLengthpm)

              const Tablemonthdevicepm = this.datadevpm.data;
              if ( Tablemonthdevicepm.length === 0) {
                alert('no data');
                const allmonth = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,
                  12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31]
                this.barchartp2 = new Chart('canvasp2', {
                  type: 'bar',
                  data: {
                    labels: allmonth,
                    datasets: [
                      {
                        data: 0,
                        borderColor: '#9fa9a4',
                        backgroundColor: 'rgb(154,165,154)',
                        fill: true
                      }
                    ]
                  },
                  options: {
                    legend: {
                      display: false
                    },
                    scales: {
                      xAxes: [{
                        display: true
                      }],
                      yAxes: [{
                        display: true
                      }],
                    }
                  }
                });
                this.FactureData.push(0)
                this.FactureData.push(0)
                this.FactureData.push(0)
                this.FactureData.push(0)
                this.ligneService.FactureStat(this.FactureData)
                this.consommationpy = '0' + ' ' + 'millimes'
              } else {
                console.log(Tablemonthdevicepm)

                this.SensorOneType = 'Consumption';


                const MM = new Date(Date.parse(Monthp));
                console.log(MM)
                let i = 0;
                let sommemonthdevicepm = 0
                for (i = 0; i < this.dataLengthpm - 1; i++) {
                  let min;

                  const DataDate = new Date(Tablemonthdevicepm[i].time);
                  console.log('DataDate: ' + DataDate)

                  if (
                    MM.getMonth() === DataDate.getMonth()) {
                    console.log('true')

                    console.log(Tablemonthdevicepm[i])
                    sommemonthdevicepm += Tablemonthdevicepm[i].electricconsumptions;
                    console.log(sommemonthdevicepm)


                    this.devicemonthpm.push(Tablemonthdevicepm[i])
                  }

                }
          
                console.log(this.devicemonthpm)

                const allmonth = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,
                  14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31]
               
                  const distinctYears = new Set(this.devicemonthpm.map(item =>
                    new Date (item.time).getFullYear()
                    ));
                  let  alldata=[]
                console.log(distinctYears)
                console.log(Array.from(distinctYears)[0])
    
                  for (let k = 0; k < distinctYears.size; k++) {
                    let tab= []
                  for (let i = 0; i < this.devicemonthpm.length; i++) {
                    if(new Date(this.devicemonthpm[i].time).getFullYear()===Array.from(distinctYears)[k]){
                      tab.push(this.devicemonthpm[i])
                    }
                  }
                  alldata.push(tab)
                }
                for(let j=0;j<31;j++){
                  let m=[]
                for (let k = 0; k < distinctYears.size; k++) {
                    for(let i=0;i<alldata[k].length;i++){
                      if(new Date(alldata[k][i].time).getFullYear()===new Date(MM).getFullYear()){
                     if (new Date(alldata[k][i].time).getDate() === allmonth[j]) {
                       m.push(alldata[k][i].electricconsumptions)
                      }
                    }
                  }
                } if (m.length > 0) {
                  const d = m[m.length - 1] - m[0]
                  this.datamonthdevicep.push(d)
                } else {
                  this.datamonthdevice.push(0)
                }
                 
                }
            
                const label = [];
                for (let i = 0; i < allmonth.length; i++) {
                  label.push(allmonth[i])
                }

                if (this.devicemonthpm.length === 0) {
                  alert('no data');
                  const allmonth = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,
                    12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31]
                  this.barchartp2 = new Chart('canvasp2', {
                    type: 'bar',
                    data: {
                      labels: allmonth,
                      datasets: [
                        {
                          data: 0,
                          borderColor: '#9fa9a4',
                          backgroundColor: 'rgb(154,165,154)',
                          fill: true
                        }
                      ]
                    },
                    options: {
                      legend: {
                        display: false
                      },
                      scales: {
                        xAxes: [{
                          display: true
                        }],
                        yAxes: [{
                          display: true
                        }],
                      }
                    }
                  });
                  this.FactureData.push(0)
                  this.FactureData.push(0)
                  this.FactureData.push(0)
                  this.FactureData.push(0)
                  this.ligneService.FactureStat(this.FactureData)
                  this.consommationpy = '0' + ' ' + 'millimes'
                } else {
                  const sommemonthdeviceallp = (this.devicemonthpm[this.devicemonthpm.length - 1].electricconsumptions -
                    this.devicemonthpm[0].electricconsumptions) * this.price;

                  let pricedevpm = 0
                  const tabledevpm = [];
                  for (let i = 0; i < this.datamonthdevicep.length; i++) {
                    pricedevpm = this.datamonthdevicep[i] * this.price;
                    tabledevpm.push(pricedevpm)
                    this.ExcelItem = {

                      'DeviceName': this.namedevicepm,
                      'Type': this.datadevpm.type,
                      'Electric Consumption': this.datamonthdevicep[i] + 'millimes',
                      'Month': label[i],

                    }
                    this.datasetToExcel.push(this.ExcelItem)
                  }
                  console.log(tabledevpm)

                  this.barchartp2 = new Chart('canvasp2', {
                    type: 'bar',
                    data: {
                      labels: label,
                      datasets: [
                        {
                          data: tabledevpm,
                          borderColor: '#9fa9a4',
                          backgroundColor: 'rgb(154,165,154)',
                          fill: true
                        }
                      ]
                    },
                    options: {
                      legend: {
                        display: false
                      },
                      scales: {
                        xAxes: [{
                          display: true
                        }],
                        yAxes: [{
                          display: true
                        }],
                      }
                    }
                  });
                  this.FactureData.push(this.selectedDevice)

                  this.FactureData.push(this.price*this.datamonthdevicep.reduce((total, current) => total + current, 0))
                  this.FactureData.push(this.datamonthdevicep.reduce((total, current) => total + current, 0))
                  this.FactureData.push(this.price)
                  console.log(this.monthp)
                  this.FactureData.push(this.monthp)
                  console.log(this.FactureData)
                  this.ligneService.FactureStat(this.FactureData)

                  console.log('SensorValue1: ' + sommemonthdeviceallp)
                  
                  this.consommationpm = this.price*this.datamonthdevicep.reduce((total, current) => total + current, 0).toString()+ ' ' + 'millimes';

                  console.log(this.consommationpm)
                }
              }
            });
          });

        }
    } } }

  }
  getyearprice() {
    this.OneDayp = null
    this.namesitepy = [];
    this.datadevpy = [];
    this.monthp = null;
    this.rania = [];
    this.dataonedsite = [];
    this.dataonedline = [];
    this.dataoneddevice = [];
    this.datalignepy = [];
    this.lineyearpy = [];
    this.datayearlinepy = [];
    const Year = this.yearp;
    this.siteyearpy = [];
    this.deviceyearpy = [];
    this.devicemonthpm = [];
    this.datamonthdevicep = [];
    this.datadevpm = [];
    this.datayeardevicepy = [];
    this.datamonthdevicep = [];
    this.datadevpm = [];
    this.datayeardevicepy = [];
    this.deviceyearpy = [];
    console.log(Year)
    console.log(new Date(Date.parse(Year)).getFullYear())
    if (this.yearp === undefined) {
      alert('choose date')
    } else {
    if (new Date(Date.parse(Year)).getFullYear() !== null) {
        this.SensorSelected = 'ok';
        console.log('sensorselected: ' + this.SensorSelected)
        this.clearTable();
        console.log(this.CurrentSensor);
        if (this.idselectedsite !== undefined && this.idselectedline === undefined && this.idselecteddevice === undefined) {
          this.http.get('/api/Area/namesite/' + this.idselectedsite).subscribe(data => {
            console.log(data)
            const resSTR = JSON.stringify(data);
            const resJSON = JSON.parse(resSTR);
            this.namesitepy = resJSON;
            this.http.get('/api/Area/getsommesite/' + this.idselectedsite).subscribe(data2 => {
              console.log(data2)
              const resSTRR = JSON.stringify(data2);
              const resJSONN = JSON.parse(resSTRR);
              this.datasitepy = resJSONN;

              const Tableyearsitepy = this.datasitepy;
              console.log(Tableyearsitepy)
if ( Tableyearsitepy.length === 0) {
  alert('no data');
  const allyear = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre']

  this.barchartp3 = new Chart('canvasp3', {
    type: 'bar',
    data: {
      labels: allyear,
      datasets: [
        {
          data: 0,
          borderColor: '#9fa9a4',
          backgroundColor: 'rgb(154,165,154)',
          fill: true
        }
      ]
    },
    options: {
      legend: {
        display: false
      },
      scales: {
        xAxes: [{
          display: true
        }],
        yAxes: [{
          display: true
        }],
      }
    }
  });
  this.FactureData.push(0)
  this.FactureData.push(0)
  this.FactureData.push(0)
  this.FactureData.push(0)
  this.ligneService.FactureStat(this.FactureData)
  this.consommationpy = '0' + ' ' + 'millimes'
} else {
  this.SensorOneType = 'Consumption';
  const YY = new Date(Date.parse(Year));
  console.log(YY)
  let i = 0;

  let somme3py = 0
  for (i = 0; i < Tableyearsitepy.length ; i++) {

    const DataDate = new Date(Tableyearsitepy[i].time);
    console.log('DataDate: ' + DataDate)

    if (
      YY.getFullYear() === DataDate.getFullYear()) {
      console.log('true')
      const date = new Date(Tableyearsitepy[i].time)

      console.log(Tableyearsitepy[i])
      somme3py += Tableyearsitepy[i].electricconsumptions;
      console.log(somme3py)
      this.siteyearpy.push(Tableyearsitepy[i])
    }

  }


  const allyear = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre']
  
  for (let i = 1; i <= 12; i++) {
    const monthlyData = getSiteYearData(i, this.siteyearpy);
    this.datayearsitepy.push(monthlyData);
  }
  
 
  const label = [];
  for (let i = 0; i < allyear.length; i++) {
    label.push(allyear[i])
  }
  if (this.siteyearpy.length === 0) {
    alert('no data');
    this.barchartp3 = new Chart('canvasp3', {
      type: 'bar',
      data: {
        labels: allyear,
        datasets: [
          {
            data: 0,
            borderColor: '#9fa9a4',
            backgroundColor: 'rgb(154,165,154)',
            fill: true
          }
        ]
      },
      options: {
        legend: {
          display: false
        },
        scales: {
          xAxes: [{
            display: true
          }],
          yAxes: [{
            display: true
          }],
        }
      }
    });
    this.FactureData.push(0)
    this.FactureData.push(0)
    this.FactureData.push(0)
    this.FactureData.push(0)
    this.ligneService.FactureStat(this.FactureData)
    this.consommationpy = '0' + ' ' + 'millimes'
  } else {
    const sommedata1py = (this.siteyearpy[this.siteyearpy.length - 1].electricconsumptions -
       this.siteyearpy[0].electricconsumptions) * this.price;
    let pricesitepy = 0
    const tablesitepy = [];
    for (let i = 0; i < 12; i++) {
      pricesitepy =  this.datayearsitepy[i] * this.price;
      tablesitepy.push(pricesitepy)
    }
    for (let i = 0; i < tablesitepy.length; i++) {
      this.ExcelItem = {

        'Site Name': this.namesitepy,
        'Electric Consumption': tablesitepy[i] + 'millimes',
        'Year': label[i],

      }
      this.datasetToExcel.push(this.ExcelItem)
    }

    console.log(sommedata1py)
    console.log(tablesitepy)

    this.barchartp3 = new Chart('canvasp3', {
      type: 'bar',
      data: {
        labels: allyear,
        datasets: [
          {
            data: tablesitepy,
            borderColor: '#9fa9a4',
            backgroundColor: 'rgb(154,165,154)',
            fill: true
          }
        ]
      },
      options: {
        legend: {
          display: false
        },
        scales: {
          xAxes: [{
            display: true
          }],
          yAxes: [{
            display: true
          }],
        }
      }
    });


    this.FactureData.push(this.selectedSite)

    this.FactureData.push(this.price*this.datayearsitepy.reduce((total, current) => total + current, 0))
    this.FactureData.push(this.datayearsitepy.reduce((total, current) => total + current, 0))
    this.FactureData.push(this.price)
    console.log(this.yearp)
    this.FactureData.push(this.yearp)
    console.log(this.FactureData)
    this.ligneService.FactureStat(this.FactureData)
    this.consommationpy = this.price*this.datayearsitepy.reduce((total, current) => total + current, 0).toString() + ' ' + 'millimes'

    console.log(this.consommationpy)


//
  }
}
            });
          });
        }
        if (this.idselectedsite !== undefined && this.idselectedline !== undefined && this.idselecteddevice === undefined) {
          this.http.get('/api/Ligne/nameline/' + this.idselectedline).subscribe(data => {
            console.log(data)
            const resSTR = JSON.stringify(data);
            const resJSON = JSON.parse(resSTR);
            this.namelinepy = resJSON;
            this.http.get('/api/Ligne/getsommeligne/' + this.idselectedline).subscribe(data2 => {
              console.log(data2)
              const resSTRR = JSON.stringify(data2);
              const resJSONN = JSON.parse(resSTRR);
              this.datalignepy = resJSONN;

              const Tableyearlinepy = this.datalignepy;
              if ( Tableyearlinepy.length === 0) {
                alert('no data')
                const allyear = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin',
                  'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre']
                this.barchartp3 = new Chart('canvasp3', {
                  type: 'bar',
                  data: {
                    labels: allyear,
                    datasets: [
                      {
                        data: 0,
                        borderColor: '#9fa9a4',
                        backgroundColor: 'rgb(154,165,154)',
                        fill: true
                      }
                    ]
                  },
                  options: {
                    legend: {
                      display: false
                    },
                    scales: {
                      xAxes: [{
                        display: true
                      }],
                      yAxes: [{
                        display: true
                      }],
                    }
                  }
                });
                this.FactureData.push(0)
                this.FactureData.push(0)
                this.FactureData.push(0)
                this.FactureData.push(0)
                this.ligneService.FactureStat(this.FactureData)
                this.consommationpy = '0' + ' ' + 'millimes'
              } else {
              console.log(Tableyearlinepy)
              if ( Tableyearlinepy.length === 0) {
                alert('no data')
                this.barchartp3 = new Chart('canvasp3', {
                  type: 'bar',
                  data: {
                    labels: 'allyear',
                    datasets: [
                      {
                        data: 0,
                        borderColor: '#9fa9a4',
                        backgroundColor: 'rgb(154,165,154)',
                        fill: true
                      }
                    ]
                  },
                  options: {
                    legend: {
                      display: false
                    },
                    scales: {
                      xAxes: [{
                        display: true
                      }],
                      yAxes: [{
                        display: true
                      }],
                    }
                  }
                });
                this.FactureData.push(this.namelinepy)

                this.FactureData.push(0)
                this.FactureData.push(0)
                this.FactureData.push(0)
                this.FactureData.push(0)
                this.ligneService.FactureStat(this.FactureData)
                this.consommationpy = '0' + ' ' + 'millimes'
              } else {
                this.SensorOneType = 'Consumption';
                const YY = new Date(Date.parse(Year));
                console.log(YY)
                let i = 0;

                let somme2py = 0
                for (i = 0; i < Tableyearlinepy.length; i++) {

                  const DataDate = new Date(Tableyearlinepy[i].time);
                  console.log('DataDate: ' + DataDate)


                  if (
                    YY.getFullYear() === DataDate.getFullYear()) {
                    console.log('true')

                    somme2py += Tableyearlinepy[i].electricconsumptions;
                    console.log(somme2py)
                    this.lineyearpy.push(Tableyearlinepy[i])
                  }

                }
            
                const allyear = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre']

                for (let i = 1; i <= 12; i++) {
                  const monthlyData = getSiteYearData(i, this.lineyearpy);
                  this.datayearlinepy.push(monthlyData);
                }

                const label = [];
                for (let i = 0; i < allyear.length; i++) {
                  label.push(allyear[i])
                }
                if ( this.lineyearpy.length === 0) {
                  alert('no data')
              
                  this.barchartp3 = new Chart('canvasp3', {
                    type: 'bar',
                    data: {
                      labels: allyear,
                      datasets: [
                        {
                          data: 0,
                          borderColor: '#9fa9a4',
                          backgroundColor: 'rgb(154,165,154)',
                          fill: true
                        }
                      ]
                    },
                    options: {
                      legend: {
                        display: false
                      },
                      scales: {
                        xAxes: [{
                          display: true
                        }],
                        yAxes: [{
                          display: true
                        }],
                      }
                    }
                  });
                  this.FactureData.push(0)
                  this.FactureData.push(0)
                  this.FactureData.push(0)
                  this.FactureData.push(0)
                  this.ligneService.FactureStat(this.FactureData)
                  this.consommationpy = '0' + ' ' + 'millimes'
                } else {
                  const sommedata2py = (this.lineyearpy[this.lineyearpy.length - 1].electricconsumptions
                    - this.lineyearpy[0].electricconsumptions) * this.price;
                  let pricelinepy = 0
                  const tablelinepy = [];
                  for (let i = 0; i <12; i++) {
                    pricelinepy = this.datayearlinepy[i] * this.price;
                    tablelinepy.push(pricelinepy)
                  }
                  for(let i = 0; i < tablelinepy.length; i++) {
                    this.ExcelItem = {

                      'Line Name': this.namelinepy,
                      'Electric Consumption': tablelinepy[i] + 'millimes',
                      'Year': label[i],

                    }
                    this.datasetToExcel.push(this.ExcelItem)
                  }


                  this.barchartp3 = new Chart('canvasp3', {
                    type: 'bar',
                    data: {
                      labels: label,
                      datasets: [
                        {
                          data: tablelinepy,
                          borderColor: '#9fa9a4',
                          backgroundColor: 'rgb(154,165,154)',
                          fill: true
                        }
                      ]
                    },
                    options: {
                      legend: {
                        display: false
                      },
                      scales: {
                        xAxes: [{
                          display: true
                        }],
                        yAxes: [{
                          display: true
                        }],
                      }
                    }
                  });

                  this.FactureData.push(this.selectedLine)

                  this.FactureData.push(this.price*this.datayearlinepy.reduce((total, current) => total + current, 0))
                  this.FactureData.push(this.datayearlinepy.reduce((total, current) => total + current, 0))
                  this.FactureData.push(this.price)
                  console.log(this.yearp)
                  this.FactureData.push(this.yearp)
                  console.log(this.FactureData)
                  this.ligneService.FactureStat(this.FactureData)
                  this.consommationpy = this.price*this.datayearlinepy.reduce((total, current) => total + current, 0).toString() + ' ' + 'millimes'

                }
              }
              }
            });
          });
        }
        if (this.idselectedsite !== undefined && this.idselectedline !== undefined && this.idselecteddevice !== undefined) {
          this.http.get('/api/Device/namedevice/' + this.idselecteddevice).subscribe(data => {
            console.log(data)
            const resSTR = JSON.stringify(data);
            const resJSON = JSON.parse(resSTR);
            this.namedevicepy = resJSON;
            this.devicesService.getlightdata(this.idselecteddevice).subscribe(data2 => {
              console.log(data2)
              this.datadevpy = data2;

              this.dataLengthpy = this.datadevpy.data.length;
              console.log(this.dataLengthpy)

              const Tableyeardevicepy = this.datadevpy.data;
              if ( this.datadevpy.length === 0) {
                alert('no data')
                const allyear = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin',
                  'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre']
                this.barchartp3 = new Chart('canvasp3', {
                  type: 'bar',
                  data: {
                    labels: allyear,
                    datasets: [
                      {
                        data: 0,
                        borderColor: '#9fa9a4',
                        backgroundColor: 'rgb(154,165,154)',
                        fill: true
                      }
                    ]
                  },
                  options: {
                    legend: {
                      display: false
                    },
                    scales: {
                      xAxes: [{
                        display: true
                      }],
                      yAxes: [{
                        display: true
                      }],
                    }
                  }
                });
                this.FactureData.push(0)
                this.FactureData.push(0)
                this.FactureData.push(0)
                this.FactureData.push(0)
                this.ligneService.FactureStat(this.FactureData)
                this.consommationpy = '0' + ' ' + 'millimes'
              } else {

                console.log(Tableyeardevicepy)
              if ( Tableyeardevicepy.length === 0) {
                alert('no data')

                const years = [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028]

                this.barchartp4 = new Chart('canvasp4', {
                  type: 'bar',
                  data: {
                    labels: years,

                    datasets: [
                      {
                        data: 0,
                        borderColor: '#9fa9a4',
                        backgroundColor: 'rgb(154,165,154)',
                        fill: true
                      }
                    ]
                  },
                  options: {
                    legend: {
                      display: false
                    },
                    scales: {
                      xAxes: [{
                        display: true
                      }],
                      yAxes: [{
                        display: true
                      }],
                    }
                  }
                });
                this.FactureData.push(this.namelinepy)

                this.FactureData.push(0)
                this.FactureData.push(0)
                this.FactureData.push(0)
                this.FactureData.push(0)
                this.ligneService.FactureStat(this.FactureData)
                this.consommationpy = '0' + ' ' + 'millimes'
              } else {
                this.SensorOneType = 'Consumption';


                const YY = new Date(Date.parse(Year));
                console.log(YY)
                let i = 0;
                let sommepy = 0
                for (i = 0; i < this.dataLengthpy; i++) {
                  let min;

                  const DataDate = new Date(Tableyeardevicepy[i].time);

                  if (
                    YY.getFullYear() === DataDate.getFullYear()) {
                    console.log('true')

                    console.log(Tableyeardevicepy)
                    sommepy += Tableyeardevicepy[i].electricconsumptions;
                    console.log(sommepy)
                    this.deviceyearpy.push(Tableyeardevicepy[i])
                  }

                }


                const allyear = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre']


                
                for (let i = 1; i <= 12; i++) {
                  this.datayeardevicepy.push(getDataForMonth(i, this.deviceyearpy));
                }
            


                const label = [];
                for (let i = 0; i < allyear.length; i++) {
                  label.push(allyear[i])
                }

                if ( this.deviceyearpy.length === 0) {
                  alert('no data')
            
                  this.barchartp3 = new Chart('canvasp3', {
                    type: 'bar',
                    data: {
                      labels: allyear,
                      datasets: [
                        {
                          data: 0,
                          borderColor: '#9fa9a4',
                          backgroundColor: 'rgb(154,165,154)',
                          fill: true
                        }
                      ]
                    },
                    options: {
                      legend: {
                        display: false
                      },
                      scales: {
                        xAxes: [{
                          display: true
                        }],
                        yAxes: [{
                          display: true
                        }],
                      }
                    }
                  });
                  this.FactureData.push(0)
                  this.FactureData.push(0)
                  this.FactureData.push(0)
                  this.FactureData.push(0)
                  this.ligneService.FactureStat(this.FactureData)
                  this.consommationpy = '0' + ' ' + 'millimes'
                } else {

                  const sommedatapy = (this.deviceyearpy[this.deviceyearpy.length - 1].electricconsumptions
                    - this.deviceyearpy[0].electricconsumptions) * this.price;


                  let pricedevpy = 0
                  const tabledevpy = [];
                  for (let i = 0; i < this.datayeardevicepy.length; i++) {
                    pricedevpy = this.datayeardevicepy[i] * this.price;
                    tabledevpy.push(pricedevpy)
                    this.ExcelItem = {

                      'DeviceName': this.namedevicepy,
                      'Type': this.datadevpy.type,
                      'Electric Consumption': tabledevpy[i] + 'millimes',
                      'Year': label[i],

                    }
                    this.datasetToExcel.push(this.ExcelItem)
                  }

                  this.barchartp3 = new Chart('canvasp3', {
                    type: 'bar',
                    data: {
                      labels: label,
                      datasets: [
                        {
                          data: tabledevpy,
                          borderColor: '#9fa9a4',
                          backgroundColor: 'rgb(154,165,154)',
                          fill: true
                        }
                      ]
                    },
                    options: {
                      legend: {
                        display: false
                      },
                      scales: {
                        xAxes: [{
                          display: true
                        }],
                        yAxes: [{
                          display: true
                        }],
                      }
                    }
                  });

                  this.FactureData.push(this.selectedLine)

                  this.FactureData.push(this.price*this.datayeardevicepy.reduce((total, current) => total + current, 0))
                  this.FactureData.push(this.datayeardevicepy.reduce((total, current) => total + current, 0))
                  this.FactureData.push(this.price)
                  console.log(this.yearp)
                  this.FactureData.push(this.yearp)
                  console.log(this.FactureData)
                  this.ligneService.FactureStat(this.FactureData)
                  this.consommationpy = this.price*this.datayeardevicepy.reduce((total, current) => total + current, 0).toString() + ' ' + 'millimes'

                }
              }
              }
            });
          });
        }
    }
    }
  }
  gettotalprice() {
    this.rania = [];
    this.dataonedsite = [];
    this.totallinept = [];
    this.OneDayp = null
    this.yearp = null;
    this.monthp = null;
    this.dataonedline = [];
    this.datadevpt = [];
    this.totaldevicept = [];
    this.dataoneddevice = [];
    this.datadevpt = [];
    this.totalsitept = [];
    if (this.price === undefined) {
      alert('choose price')
    } else {
        this.SensorSelected = 'ok';
        console.log('sensorselected: ' + this.SensorSelected)
        this.clearTable();
        console.log(this.CurrentSensor);
        if (this.idselectedsite !== undefined && this.idselectedline === undefined && this.idselecteddevice === undefined) {
          this.http.get('/api/Area/namesite/' + this.idselectedsite).subscribe(data => {
            console.log(data)
            const resSTR = JSON.stringify(data);
            const resJSON = JSON.parse(resSTR);
            this.namesitept = resJSON;

            this.http.get('/api/Area/getsommesite/' + this.idselectedsite).subscribe(data2 => {
              console.log(data2)
              this.datadevpt = data2;
              const resSTRR = JSON.stringify(data2);
              const resJSONN = JSON.parse(resSTRR);

              const Tabletotalsitept = resJSONN;


              if ( Tabletotalsitept.length === 0) {
                alert('no data');
                const years = [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028]

                this.barchartp4 = new Chart('canvasp4', {
                  type: 'bar',
                  data: {
                    labels: years,

                    datasets: [
                      {
                        data: 0,
                        borderColor: '#9fa9a4',
                        backgroundColor: 'rgb(154,165,154)',
                        fill: true
                      }
                    ]
                  },
                  options: {
                    legend: {
                      display: false
                    },
                    scales: {
                      xAxes: [{
                        display: true
                      }],
                      yAxes: [{
                        display: true
                      }],
                    }
                  }
                });
                this.FactureData.push(0)
                this.FactureData.push(0)
                this.FactureData.push(0)
                this.FactureData.push(0)
                this.ligneService.FactureStat(this.FactureData)
                this.consommationpt = '0' + ' ' + 'millimes'
              } else {
                console.log(Tabletotalsitept)

                this.SensorOneType = 'Consumption';


                const years = [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028]
                for(let i=0;i<years.length;i++){
                  this.totalsitept.push(getTotalData(years[i],Tabletotalsitept));
                }
             

                const sommedata1py = (Tabletotalsitept[Tabletotalsitept.length - 1].electricconsumptions -
                  Tabletotalsitept[0].electricconsumptions) * this.price;

  
                console.log(this.totalsitept)
                const tablesitept = []
                let somsitept = 0;

                for (let i = 0; i < this.totalsitept.length; i++) {
                  somsitept = this.totalsitept[i] * this.price;
                  tablesitept.push(somsitept)

                  this.ExcelItem = {

                    'Site Name': this.namesitept,
                    'Electric Consumption': tablesitept[i] + 'millimes',
                    'Date': years[i],
                  }
                  this.datasetToExcel.push(this.ExcelItem)
                }
                console.log(tablesitept)
                this.barchartp4 = new Chart('canvasp4', {
                  type: 'bar',
                  data: {
                    labels: years,

                    datasets: [
                      {
                        data: tablesitept,
                        borderColor: '#9fa9a4',
                        backgroundColor: 'rgb(154,165,154)',
                        fill: true
                      }
                    ]
                  },
                  options: {
                    legend: {
                      display: false
                    },
                    scales: {
                      xAxes: [{
                        display: true
                      }],
                      yAxes: [{
                        display: true
                      }],
                    }
                  }
                });
 
                this.FactureData.push(this.selectedSite)
                this.FactureData.push(this.price*this.totalsitept.reduce((total, current) => total + current, 0))
                this.FactureData.push(this.totalsitept.reduce((total, current) => total + current, 0))
                this.FactureData.push(this.price)
                this.FactureData.push('-------------')
                console.log(this.FactureData)
                this.ligneService.FactureStat(this.FactureData)
                console.log('SensorValue1: ' + sommedata1py)
                //     console.log("SensorValue2: " + this.DataTableTwo)
                this.consommationpt = this.price*this.totalsitept.reduce((total, current) => total + current, 0).toString()+ ' ' + 'millimes';

              }
            });
          });
        }
        if (this.idselectedsite !== undefined && this.idselectedline !== undefined && this.idselecteddevice === undefined) {
          this.http.get('/api/Ligne/nameline/' + this.idselectedline).subscribe(data => {
            console.log(data)
            const resSTR = JSON.stringify(data);
            const resJSON = JSON.parse(resSTR);
            this.namelinept = resJSON;

            this.http.get('/api/Ligne/getsommeligne/' + this.idselectedline).subscribe(data2 => {
              console.log(data2)
              const resSTRR = JSON.stringify(data2);
              const resJSONN = JSON.parse(resSTRR);

              const Tabletotallinept = resJSONN;

              if ( Tabletotallinept.length === 0) {
                alert('no data');
                const years = [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028]

                this.barchartp4 = new Chart('canvasp4', {
                  type: 'bar',
                  data: {
                    labels: years,

                    datasets: [
                      {
                        data: 0,
                        borderColor: '#9fa9a4',
                        backgroundColor: 'rgb(154,165,154)',
                        fill: true
                      }
                    ]
                  },
                  options: {
                    legend: {
                      display: false
                    },
                    scales: {
                      xAxes: [{
                        display: true
                      }],
                      yAxes: [{
                        display: true
                      }],
                    }
                  }
                });
                this.FactureData.push(0)
                this.FactureData.push(0)
                this.FactureData.push(0)
                this.FactureData.push(0)
                this.ligneService.FactureStat(this.FactureData)
                this.consommationpt = '0' + ' ' + 'millimes'
              } else {
                console.log(Tabletotallinept)


                const years = [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028]

                for(let i=0;i<years.length;i++){
                  this.totallinept.push(getTotalData(years[i],Tabletotallinept));
                }
            
                const sommedata1py = (Tabletotallinept[Tabletotallinept.length - 1].electricconsumptions -
                  Tabletotallinept[0].electricconsumptions) * this.price;
                console.log(this.totallinept)
                let somlinept = 0
                const tablelinept = []
                for (let i = 0; i < this.totallinept.length; i++) {
                  somlinept = this.totallinept[i] * this.price;
                  tablelinept.push(somlinept)
                  this.ExcelItem = {

                    'Site Name': this.namelinept,
                    'Electric Consumption': tablelinept[i] + 'millimes',
                    'Date': years[i],
                  }
                  this.datasetToExcel.push(this.ExcelItem)
                }


                this.barchartp4 = new Chart('canvasp4', {
                  type: 'bar',
                  data: {
                    labels: years,

                    datasets: [
                      {
                        data: tablelinept,
                        borderColor: '#9fa9a4',
                        backgroundColor: 'rgb(154,165,154)',
                        fill: true
                      }
                    ]
                  },
                  options: {
                    legend: {
                      display: false
                    },
                    scales: {
                      xAxes: [{
                        display: true
                      }],
                      yAxes: [{
                        display: true
                      }],
                    }
                  }
                });
           
                this.FactureData.push(this.selectedLine)
                this.FactureData.push(this.price*this.totallinept.reduce((total, current) => total + current, 0))
                this.FactureData.push(this.totallinept.reduce((total, current) => total + current, 0))
                this.FactureData.push(this.price)
                this.FactureData.push('-------------')
                console.log(this.FactureData)
                this.ligneService.FactureStat(this.FactureData)
                console.log('SensorValue1: ' + sommedata1py)
                //     console.log("SensorValue2: " + this.DataTableTwo)
                this.consommationpt = this.price*this.totallinept.reduce((total, current) => total + current, 0).toString()+ ' ' + 'millimes';

              }
            });
          });

        }
        if (this.idselectedsite !== undefined && this.idselectedline !== undefined && this.idselecteddevice !== undefined) {
          this.http.get('/api/Device/namedevice/' + this.idselecteddevice).subscribe(data => {
            console.log(data)
            const resSTR = JSON.stringify(data);
            const resJSON = JSON.parse(resSTR);
            this.namedevicept = resJSON;

            this.devicesService.getlightdata(this.idselecteddevice).subscribe(data2 => {
              console.log(data2)
              this.datadevpt = data2;

              const Tabletotaldevicept = this.datadevpt.data;

              if ( Tabletotaldevicept.length === 0) {
                alert('no data');
                const years = [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028]

                this.barchartp4 = new Chart('canvasp4', {
                  type: 'bar',
                  data: {
                    labels: years,

                    datasets: [
                      {
                        data: 0,
                        borderColor: '#9fa9a4',
                        backgroundColor: 'rgb(154,165,154)',
                        fill: true
                      }
                    ]
                  },
                  options: {
                    legend: {
                      display: false
                    },
                    scales: {
                      xAxes: [{
                        display: true
                      }],
                      yAxes: [{
                        display: true
                      }],
                    }
                  }
                });
                this.FactureData.push(0)
                this.FactureData.push(0)
                this.FactureData.push(0)
                this.FactureData.push(0)
                this.ligneService.FactureStat(this.FactureData)
                this.consommationpt = '0' + ' ' + 'millimes'
              } else {
                console.log(Tabletotaldevicept)
                this.totaldevicept = [];
                this.SensorOneType = 'Consumption';
                const years = [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028]
                for (let i=0;i<years.length;i++){
                  let tab =[];
                  let data =0;
                  for(let j=0;j<Tabletotaldevicept.length;j++){
                    if(years[i]===new Date(Tabletotaldevicept[j].time).getFullYear()){
                    tab.push(Tabletotaldevicept[j].electricconsumptions);
                    }
                    data = tab[tab.length-1]-tab[0]; 
                  }
                  if(data>0)
                  this.totaldevicept.push(data);
                  else
                  this.totaldevicept.push(0);
                }
                const sommedata1py = (Tabletotaldevicept[Tabletotaldevicept.length - 1].electricconsumptions -
                  Tabletotaldevicept[0].electricconsumptions) * this.price;
                console.log(this.totaldevicept)
                let somdevpt = 0
                const tabledevpt = []
                for (let i = 0; i < this.totaldevicept.length; i++) {
                  somdevpt = this.totaldevicept[i] * this.price;
                  tabledevpt.push(somdevpt)
                  this.ExcelItem = {

                    'Device Name': this.namedevicept,
                    'Electric Consumption': tabledevpt[i] + 'millimes',

                    'Date': years[i],
                  }
                  this.datasetToExcel.push(this.ExcelItem)
                }
                this.barchartp4 = new Chart('canvasp4', {
                  type: 'bar',
                  data: {
                    labels: years,

                    datasets: [
                      {
                        data: tabledevpt,
                        borderColor: '#9fa9a4',
                        backgroundColor: 'rgb(154,165,154)',
                        fill: true
                      }
                    ]
                  },
                  options: {
                    legend: {
                      display: false
                    },
                    scales: {
                      xAxes: [{
                        display: true
                      }],
                      yAxes: [{
                        display: true
                      }],
                    }
                  }
                });
           
                this.FactureData.push(this.selectedLine)
                this.FactureData.push(tabledevpt.reduce((total, current) => total + current, 0))
                this.FactureData.push(tabledevpt.reduce((total, current) => total + current, 0)/this.price)
                this.FactureData.push(this.price)
                this.FactureData.push('-------------')
                console.log(this.FactureData)
                this.ligneService.FactureStat(this.FactureData)
                console.log('SensorValue1: ' + sommedata1py)
                //     console.log("SensorValue2: " + this.DataTableTwo)
                this.consommationpt = tabledevpt.reduce((total, current) => total + current, 0).toString()+ ' ' + 'millimes';
              }

            });
          });
        }
    }

  }


}

function getTotalData(year,totalData) {
let tab = [];
let annualData = [];
  for (let i = 0; i < totalData.length; i++) {
    if (new Date(totalData[i].time).getFullYear() === year) {
      tab.push(totalData[i]);
    }
  }
  if(tab.length > 0){
const times = tab.map(item => item.electricconsumptions);
console.log(times);
  }
  for(let i = 0; i < 31; i++){
    annualData.push(getSiteYearData(i, tab));

  }
  if(annualData.reduce((total, current) => total + current, 0) !== 0){
  console.log(annualData)}
  let data = 0;
  if (annualData.length > 0) {
    data = annualData.reduce((total, current) => total + current, 0);
  }
  return data;
}

function getSiteYearData(monthNumber, siteYearData) {
  let tab = [];
  let monthlyData = [];

  for (let i = 0; i < siteYearData.length; i++) {
    if ((new Date(siteYearData[i].time).getMonth() + 1) === monthNumber) {
      tab.push(siteYearData[i]);
    }
  }
  if(tab.length > 0){
    const times = tab.map(item => item.electricconsumptions);
    console.log(times, "consommation");
      }
  for (let i = 1; i <= 31; i++) {
    monthlyData.push(getElectricConsumptionForDateNumber(i, tab));
  }

  let data = 0;
  if (monthlyData.length > 0) {
    data = monthlyData.reduce((total, current) => total + current, 0);
  }

  return data;
}


function getDataForMonth(month, data=[]) {
  let m = [];
  let k= 0;
  
  for (let i = 0; i < data.length; i++) {
    if (new Date(data[i].time).getMonth() + 1 === month) {
      m.push(data[i].electricconsumptions);
      k++;
    }
  }

  if (m.length > 0) {
    const d= m[k - 1] - m[0];
    return d;
  } else {
    return 0;
  }
}

function getElectricConsumptionForDateNumber(dateNumber, tab) {
  let daysConso = [];
  let dayConso = null;
  for (let i = 0; i < tab.length; i++) {
   try{
    if (new Date(tab[i].time).getDate() === dateNumber) {
      if (dayConso === null) {
        dayConso = tab[i].electricconsumptions;
      }
   
      if (new Date(tab[i].time).getDate() !== new Date(tab[i + 1].time).getDate() ) {
        dayConso = tab[i].electricconsumptions - dayConso;
        daysConso.push(dayConso)
      }
      
    }
     else {
      dayConso = tab[i + 1].electricconsumptions;
    }}
    catch(e){
      if (e instanceof TypeError && e.message.includes("Cannot read properties of undefined (reading 'time')")) {
      dayConso = tab[i].electricconsumptions - dayConso;
      daysConso.push(dayConso)
    }}
   
  }
  return daysConso.reduce((total, current) => total + current, 0);
}