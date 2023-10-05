import {Component, Inject, OnInit} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AreaService} from '../../Services/area.service';
import {LignesService} from '../../Services/lignes.service';
import {FormArray, FormControl, FormGroup, Validators,FormsModule} from '@angular/forms';
import {ProfileService} from '../../Services/profile.service';
import {NotificationsService} from 'angular2-notifications';
import Swal from 'sweetalert2';
import jwt_decode from 'jwt-decode';
import {LOCAL_STORAGE, WebStorageService} from 'ngx-webstorage-service';

@Component({
  selector: 'app-profile-devices',
  templateUrl: './profile-devices.component.html',
  styleUrls: ['./profile-devices.component.css']
})
export class ProfileDevicesComponent implements OnInit {
  test: string;
  profiles: any[];
  area: any[];
  areas: any[];
  value=["19","20","21","22","23","00","01","02","03","04","05"]
  arealat = 0;
  arealag = 0;
  Time: [];
  Lampe_LVL: any[];
  color: 'red';
  Lmp_LVL1 = 100;
  Lmp_LVL2 = 100;
  Lmp_LVL3 = 100;
  Lmp_LVL4 = 100;
  Lmp_LVL5 = 100;
  Lmp_LVL6 = 100;
  T0:string="18"
  T1:string="19"
  T2:string="19"
  T3:string="19" 
  T4:string="19"
  T5:string="19" 
  T6:string="06"
  idprofile = 0;
  mode_auto = false;
  color_profile = '#b75757';
  name_profile = '';
  profileArea=''
  positionDet=[]
  areaForm1 = new FormGroup({
    name: new FormControl('', [Validators.required]),
    color: new FormControl('', [Validators.required]),
    modeAuto: new FormControl(false, [Validators.required]),
    positionDetails:new FormControl('',Validators.required),
    Time: new FormArray([], [Validators.required]),
    Lampe_LVL: new FormArray([], [Validators.required]),
    users: new FormControl('', [Validators.required]),
  });

  Lampe_LVLS = this.areaForm1.get('Lampe_LVL') as FormArray;
  Times = this.areaForm1.get('Time') as FormArray;
  position=this.areaForm1.get('positionDetails') as FormArray;
  
  get name() {
    return this.areaForm1.get('name');
  }

  get colorr() {
    return this.areaForm1.get('color');
  }

  constructor( private dialog: NgbModal , public areaService: AreaService ,
               public ligneService: LignesService , public profileService: ProfileService,
               private service: NotificationsService , @Inject(LOCAL_STORAGE) private storage: WebStorageService) { }

  ngOnInit(): void {
    const decodedHeader = jwt_decode(this.storage.get('token'));
    // @ts-ignore
    this.onafficheside(decodedHeader.users._id);
    // @ts-ignore
    this.onaffichesites(decodedHeader.users._id);
  }
  onafficheside(users) {
    this.profileService.getProfile(users).subscribe(data => {
      this.profiles = data ;
    });
  }
  onaffichesites(users) {
    const decodedHeader = jwt_decode(this.storage.get('token'));

    // @ts-ignore
    this.areaService.getArea(decodedHeader.users._id).subscribe(data => {
      this.areas = data ;
    });
  }


  addDevices() {
    let checkHours=false;

    if (this.idprofile === 0) {
      const control = new FormControl(this.Lmp_LVL1, Validators.required);
      const control2 = new FormControl(this.Lmp_LVL2, Validators.required);
      const control3 = new FormControl(this.Lmp_LVL3, Validators.required);
      const control4 = new FormControl(this.Lmp_LVL4, Validators.required);
      const control5 = new FormControl(this.Lmp_LVL5, Validators.required);
      const control6 = new FormControl(this.Lmp_LVL6, Validators.required);
      const control7 = new FormControl(0, Validators.required);
      const control8 = new FormControl(this.T0, Validators.required);
      const control9 = new FormControl(this.T1, Validators.required);
      const control10 = new FormControl(this.T2, Validators.required);
      const control11 = new FormControl(this.T3, Validators.required);
      const control12 = new FormControl(this.T4, Validators.required);
      const control13 = new FormControl(this.T5, Validators.required);
      const control14 = new FormControl(this.T6, Validators.required);

      this.Lampe_LVLS.push(control);
      this.Lampe_LVLS.push(control2);
      this.Lampe_LVLS.push(control3);
      this.Lampe_LVLS.push(control4);
      this.Lampe_LVLS.push(control5);
      this.Lampe_LVLS.push(control6);
      this.Lampe_LVLS.push(control7);
      this.Times.push(control8);
      this.Times.push(control9);
      this.Times.push(control10);
      this.Times.push(control11);
      this.Times.push(control12);
      this.Times.push(control13);
      this.Times.push(control14);
      const decodedHeader = jwt_decode(this.storage.get('token'));
      // @ts-ignore
      this.areaForm1.controls['users'].setValue(decodedHeader.users._id);
      if (this.profileArea!=='') {
        this.areaForm1.controls['modeAuto'].setValue(true);
        this.positionDet=[this.arealat,this.arealag]
        this.areaForm1.controls['positionDetails'].setValue(this.positionDet);
      }

      console.log(this.areaForm1.value);
      console.log(this.areaForm1.value.Time)
      checkHours=this.manageTime(this.areaForm1.value.Time);
      console.log(checkHours)
      if(!checkHours)
      {this.profileService.AddProfile(this.areaForm1.value).subscribe();
      this.OnSuccess();
      this.Lampe_LVLS.clear();
      this.Times.clear();
      this.T0 = '18';
      this.T6 = '06';
      this.mode_auto = false;
      this.areaForm1.reset();
      this.ngOnInit();
      // @ts-ignore
      this.onafficheside(decodedHeader.users._id);}
      else{
        alert("Please check the timing")      }
    } 
    
    else {
      console.log(this.name_profile + '/////////');
      console.log(this.areaForm1.get('name').value)
      if (this.areaForm1.get('name').value === null) {
        this.areaForm1.controls['name'].setValue(this.name_profile);
      }
      if (this.areaForm1.get('color').value === null) {
        this.areaForm1.controls['color'].setValue(this.color_profile);
      }
      if (this.profileArea!=='') {
        this.areaForm1.controls['modeAuto'].setValue(true);
        this.positionDet=[this.arealat,this.arealag]
        this.areaForm1.controls['positionDetails'].setValue(this.positionDet);
      }

      const control = new FormControl(this.Lmp_LVL1, Validators.required);
      const control2 = new FormControl(this.Lmp_LVL2, Validators.required);
      const control3 = new FormControl(this.Lmp_LVL3, Validators.required);
      const control4 = new FormControl(this.Lmp_LVL4, Validators.required);
      const control5 = new FormControl(this.Lmp_LVL5, Validators.required);
      const control6 = new FormControl(this.Lmp_LVL6, Validators.required);
      const control7 = new FormControl(0, Validators.required);
      const control8 = new FormControl(this.T0, Validators.required);
      const control9 = new FormControl(this.T1, Validators.required);
      const control10 = new FormControl(this.T2, Validators.required);
      const control11 = new FormControl(this.T3, Validators.required);
      const control12 = new FormControl(this.T4, Validators.required);
      const control13 = new FormControl(this.T5, Validators.required);
      const control14 = new FormControl(this.T6, Validators.required);
    

      this.Lampe_LVLS.push(control);
      this.Lampe_LVLS.push(control2);
      this.Lampe_LVLS.push(control3);
      this.Lampe_LVLS.push(control4);
      this.Lampe_LVLS.push(control5);
      this.Lampe_LVLS.push(control6);
      this.Lampe_LVLS.push(control7);
      this.Times.push(control8);
      this.Times.push(control9);
      this.Times.push(control10);
      this.Times.push(control11);
      this.Times.push(control12);
      this.Times.push(control13);
      this.Times.push(control14);


      const decodedHeader = jwt_decode(this.storage.get('token'));
      // @ts-ignore
      this.areaForm1.controls['users'].setValue(decodedHeader.users._id);
      console.log(this.areaForm1.value);
     checkHours=this.manageTime(this.areaForm1.value.Time);

      if(!checkHours)
      {this.profileService.EditProfile(this.areaForm1.value , this.idprofile).subscribe();
      this.OnSuccess();
      this.Lampe_LVLS.clear();
      this.Times.clear();
      //this.areaForm1.reset();
      this.ngOnInit();
       // @ts-ignore
      this.onafficheside(decodedHeader.users._id);

    } else{
      alert("Please check the timing")
    }
    }
   
  }




  select(id) {
    // this.profileService.DeleteProfileByid(id).subscribe();
    console.log(id )
    console.log(id.modeAuto,"modeAuto")
    if(id.modeAuto===true)
    {
      this.mode_auto=true;
    }
    else{
      this.mode_auto=false;

    }
    this.idprofile = id._id;
    console.log( id.name);
    this.name_profile =  id.name;
    this.color_profile = id.color;
    this.Lmp_LVL1 = id.Lampe_LVL[0];
    this.Lmp_LVL2 = id.Lampe_LVL[1];
    this.Lmp_LVL3 = id.Lampe_LVL[2];
    this.Lmp_LVL4 = id.Lampe_LVL[3];
    this.Lmp_LVL5 = id.Lampe_LVL[4];
    this.Lmp_LVL6 = id.Lampe_LVL[5];
    this.T0 = id.Time[0];
    this.T1 = id.Time[1];
    this.T2 = id.Time[2];
    this.T3 = id.Time[3];
    this.T4 = id.Time[4];
    this.T5 = id.Time[5];
    this.T6 = id.Time[6];
    console.log(this.name_profile);
    const decodedHeader = jwt_decode(this.storage.get('token'));
    // @ts-ignore
    this.onafficheside(decodedHeader.users._id);
  }
  ADD() {
    this.profileArea=""
    this.arealag=0;
    this.arealat=0;
    console.log(this.profileArea)
    this.idprofile = 0;
    this.name_profile =  '';
    this.color_profile = '#8BD2D1';
    this.Lmp_LVL1 = 100;
    this.Lmp_LVL2 = 100;
    this.Lmp_LVL3 = 100;
    this.Lmp_LVL4 = 100;
    this.Lmp_LVL5 = 100;
    this.Lmp_LVL6 = 100;
  }

  OnSuccess() {
    this.service.success('Success', 'message', {
      position: ['bottom', 'right'],
      timeOut: 2000,
      animate: 'fade',
      showProgressBar: true,
    })
  }
  OnError() {
    this.service.error('error', 'message', {
      position: ['bottom', 'right'],
      timeOut: 2000,
      animate: 'fade',
      showProgressBar: true,
    })
  }
  delete() {
    if (this.idprofile !== 0) {
      Swal.fire({
        title: 'Are you sure?',
        text: 'You will not be able to recover this Profile!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, keep it'
      }).then((result) => {
        if (result.value) {
        
          this.profileService.DeleteProfileByid(this.idprofile).subscribe(
            (response)=>{
              this.profiles = this.profiles.filter(profiles => profiles.id !== this.idprofile);
              const decodedHeader = jwt_decode(this.storage.get('token'));
              // @ts-ignore
              this.onafficheside(decodedHeader.users._id);
              Swal.fire(
                'Deleted!',
                'Your site has been deleted.',
                'success'
              )
            },
            (error)=>{
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: error,
              })
            }

          );

          // For more information about handling dismissals please visit
          // https://sweetalert2.github.io/#handling-dismissals
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire(
            'Cancelled',
            'Your site is safe :)',
            'error'
          )
        }
      })
    } else {
this.OnError();
    }
  }

  changetime(event) {
    const value = event.target.value;
    console.log(value);
    this.areaService.getAreaById(value).subscribe(data => {
      this.area = data
      // @ts-ignore
      console.log(this.area.Lat);
      // @ts-ignore
      this.arealat = this.area.Lat ;
      // @ts-ignore
      this.arealag = this.area.Lng ;
      this.areaService.apiteamps(this.arealat , this.arealag).subscribe(data2 => {
        console.log(data2);
        // @ts-ignore
        this.T0 = data2.results.sunset;
        console.log(this.T0);
        // @ts-ignore
        this.T6 = data2.results.sunrise;
        const convertTime12to24 = (time12h) => {
          const [time, modifier] = time12h.split(' ');

          // tslint:disable-next-line:prefer-const
          let [hours, minutes] = time.split(':');

          if (hours === '12') {
            hours = '00';
          }

          if (modifier === 'PM') {
            hours = parseInt(hours, 10) + 12;
          }

          return `${hours}:${minutes}`;
        }

        console.log(convertTime12to24(this.T0));
        this.T6 =  convertTime12to24(this.T6);
        this.T0 = convertTime12to24(this.T0);
        let y: number = +this.T0.substring(0, 2);
        const x = this.T0.substring(2, 5);
        y = y + 1;
        const z = y.toString();
        this.T0 = z + x ;

        let a: number = +this.T6.substring(0, 1);
        const b = this.T6.substring(1, 4);
        a = a + 1;
        const c = a.toString();
        this.T6 = c + b;
      })
    });
  }

  retour() {
    this.mode_auto = false;
    this.T0='18'
    this.T6='06'
    this.profileArea=''
    this.positionDet=[]
  }
  modeauto() {
    this.mode_auto = true;
  }



  manageTime(time:[]):boolean{
    let tab=[]
    for(let i=0; i<time.length;i++){
      if( parseInt(time[i])<=6 )
      {
      tab[i]=parseInt(time[i])+24
      }
      else 
      {
        tab[i]=parseInt(time[i]);
      } 
     }
     let min=tab[0];
     for(let i=1;i<tab.length;i++)
     {
      if (tab[i]<min)
      {
        this.Lampe_LVLS.clear();
        this.Times.clear();
        return true;
      }
      else 
      {
        min=tab[i];
      }
 
     }
    return false;
  }



  plus1() {
    if (this.Lmp_LVL1 !== 100) {
      this.Lmp_LVL1 = this.Lmp_LVL1 + 5;
    }
  }
  moins1() {
      if (this.Lmp_LVL1 !== 0) {
        this.Lmp_LVL1 = this.Lmp_LVL1 - 5;
      }
    }
    plus2() {
      if (this.Lmp_LVL2 !== 100) {
        this.Lmp_LVL2 = this.Lmp_LVL2 + 5;
      }
    }
    moins2() {
      if (this.Lmp_LVL2 !== 0) {
        this.Lmp_LVL2 = this.Lmp_LVL2 - 5;
      } 
     }
    plus3() {
      if (this.Lmp_LVL3 !== 100) {
        this.Lmp_LVL3 = this.Lmp_LVL3 + 5;
      }
    }
    moins3() {
      if (this.Lmp_LVL3 !== 0) {
        this.Lmp_LVL3 = this.Lmp_LVL3 - 5;
      }
    }
    plus4() {
      if (this.Lmp_LVL4 !== 100) {
        this.Lmp_LVL4 = this.Lmp_LVL4 + 5;
      }
    }
    moins4() {
      if (this.Lmp_LVL4 !== 0) {
        this.Lmp_LVL4 = this.Lmp_LVL4 - 5;
      }
    }
    plus5() {
      if (this.Lmp_LVL5 !== 100) {
        this.Lmp_LVL5 = this.Lmp_LVL5 + 5;
      }
    }
    moins5() {
      if (this.Lmp_LVL5 !== 0) {
        this.Lmp_LVL5 = this.Lmp_LVL5 - 5;
      }
    }
    plus6() {
      if (this.Lmp_LVL6 !== 100) {
        this.Lmp_LVL6 = this.Lmp_LVL6 + 5;
      }
    }
    moins6() {
      if (this.Lmp_LVL6 !== 0) {
        this.Lmp_LVL6 = this.Lmp_LVL6 - 5;
      }
    }
}
