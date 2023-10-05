import {Component, Inject, OnInit , ChangeDetectorRef} from '@angular/core';
import {AreaService} from '../../Services/area.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {LOCAL_STORAGE, WebStorageService} from 'ngx-webstorage-service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {PageSettingsModel, SortSettingsModel } from '@syncfusion/ej2-angular-treegrid';
import {TreeviewItem} from 'ngx-treeview';
import {Observable, of} from 'rxjs';
import {DevicesService} from '../../Services/devices.service';
import {SelectableSettings} from '@progress/kendo-angular-treeview';
import {LignesService} from '../../Services/lignes.service';
import {EditDeviceComponent} from '../edit-device/edit-device.component';
import {ProfileDevicesComponent} from '../profile-devices/profile-devices.component';
import {AssignProfileComponent} from '../assign-profile/assign-profile.component';
import {DataComponent} from '../data/data.component';
import jwt_decode from 'jwt-decode';
import {DataDeviceComponent} from '../data-device/data-device.component';
@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent implements OnInit {
  testt = false;
  isAnimated = true;
  autoCollapse = true;
  expandOnClick = true;
  connectivitySelectedValue;
  p = 1;
  Errurfilter = false ;
  px: number;
  Status: string;
  SearchText: string;
  cols: any[];
  Devices: any[];
  site: any[];
  lignes: any[];
  idClicked: any;
  Erreur: string;
  public expandedKeys: any[] = ['0', '1'];
  public selectedKeys: any[] = ['0_1'];
  public checkedKeys: any[] = [''];
  id: any[];
  id2: any[] = [];
  StatusselectedValue;
  selectedValue;
  BatteryLevelselectedValue;
  public selection: SelectableSettings = {mode: 'multiple'};
  public sortSettings: SortSettingsModel;
  public pageSettings: PageSettingsModel;
  areaForm1 = new FormGroup({
    code: new FormControl('', [Validators.required]),
    event: new FormControl('', [Validators.required]),
  });
  constructor(public areaService: AreaService, private formBuilder: FormBuilder, private router: Router,
              @Inject(LOCAL_STORAGE) private storage: WebStorageService, private dialog: NgbModal,
              public  lignesService: LignesService, private cd: ChangeDetectorRef,
              public devicesService: DevicesService) {
  }

  ngOnInit(): void {
    const decodedHeader = jwt_decode(this.storage.get('token'));
    console.log('this.Erreur');
    console.log(this.Erreur);
    this.onaffiche(this.id);
    // @ts-ignore
    this.onafficheside(decodedHeader.users._id);
  }

  public fetchChildren(node: any): Observable<any[]> {
    return of(node.Ligne);
  }

  public hasChildren(node: any): boolean {
    return node.Ligne && node.Ligne.length > 0;
  }
  refresh() {
    this.onaffiche(0);
    this.Errurfilter = false;

  }


  search() {
    if (this.selectedValue !== undefined &&  this.StatusselectedValue === undefined && this.connectivitySelectedValue === undefined) {
      this.Devices= this.Devices.filter(u => u.alert == this.selectedValue);
    }
    if (this.selectedValue === undefined &&  this.StatusselectedValue !== undefined && this.connectivitySelectedValue === undefined) {
      this.Devices= this.Devices.filter(u => u.Status === this.StatusselectedValue);
    }
    if (this.selectedValue === undefined &&  this.StatusselectedValue === undefined && this.connectivitySelectedValue !== undefined) {
      this.Devices= this.Devices.filter(u => u.connectivityAlert == this.connectivitySelectedValue);
    }

    if (this.selectedValue !== undefined &&  this.StatusselectedValue !== undefined && this.connectivitySelectedValue === undefined) {
      this.Devices= this.Devices.filter(u => u.alert == this.selectedValue && u.Status == this.StatusselectedValue);
    }
    if (this.selectedValue !== undefined &&  this.StatusselectedValue === undefined && this.connectivitySelectedValue !== undefined) {
      this.Devices= this.Devices.filter(u => u.alert == this.selectedValue && u.connectivityAlert == this.connectivitySelectedValue);
    }
    if (this.selectedValue === undefined &&  this.StatusselectedValue !== undefined && this.connectivitySelectedValue !== undefined) {
      this.Devices= this.Devices.filter(u => u.Status == this.StatusselectedValue && u.connectivityAlert == this.connectivitySelectedValue);
    }

    if (this.selectedValue !== undefined &&  this.StatusselectedValue !== undefined && this.connectivitySelectedValue !== undefined) {
      this.Devices= this.Devices.filter(u => u.alert == this.selectedValue && u.Status == this.StatusselectedValue && u.connectivityAlert == this.connectivitySelectedValue);
    }
        if (this.Devices.length <= 0) {
      this.Errurfilter = true
    }
}
  data(id) {
    const modalRef = this.dialog.open(DataDeviceComponent , { size: 'lg',
      backdrop: 'static',
      windowClass: 'custom-class',
    });
    modalRef.componentInstance.id = id;
  }
  public onNodeClick(e: any): void {
    this.Errurfilter = false;
    console.log(e.item.dataItem._id,"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
    this.idClicked = e.item.dataItem._id;
    this.Status = e.item.dataItem.Status;
    this.areaService.getAreaById(e.item.dataItem._id).subscribe(data3 => {
      console.log(data3,"3333333333333333333333333333333333333333")
      if (data3 === null) {
        this.lignesService.getLigneById(e.item.dataItem._id).subscribe(dataligne => {
          this.lignes = dataligne;
          // @ts-ignore
          this.Devices = this.lignes.Device;
          // @ts-ignore
          this.id = this.Devices;
          // tslint:disable-next-line:triple-equals
          this.filterdevice(this.id);
        })
      } else {
        console.log(this.Devices);
        this.Devices = undefined;
        this.site = data3;
        // @ts-ignore
        //console.log(this.site.Ligne[0].Device[0]);
        // @ts-ignore
        for (let i = 0; i < this.site.Ligne.length; i++) {
          // @ts-ignore
          for (let j = 0; j < this.site.Ligne[i].Device.length; j++) {
            // @ts-ignore
            this.id2.push(this.site.Ligne[i].Device[j]);
          }
        }
        this.filterdevice(this.id2);
      }
    });
  }

  onaffiche(id) {
    const decodedHeader = jwt_decode(this.storage.get('token'));
    // @ts-ignore
    this.devicesService.getDevicesWithoutData(decodedHeader.users._id).subscribe(data2 => {
      //@ts-ignore
      this.Devices = data2;
    });
  }

  onafficheside(users) {
    this.areaService.getArea(users).subscribe(data => {
      this.cols = data;
    });
  }

  filterdevice(id) {
    const decodedHeader = jwt_decode(this.storage.get('token'));
    // @ts-ignore
    this.devicesService.GetAllDevice(decodedHeader.users._id).subscribe(data2 => {
      console.log("data 22222222222222222222222222222222222",data2)
      this.Devices = data2;
      if (id.length > 0) {
        this.Devices = id;
        this.id2 = [];
        this.id = [];
      } else {
        this.Devices = null;
      }
    });
    console.log(this.checkedKeys,"keyyyyyyyyyyyyyyyyyyyy");
  }
  filterdevice2() {
    this.Status = '';
    const decodedHeader = jwt_decode(this.storage.get('token'));
    // @ts-ignore
    this.devicesService.GetAllDevice(decodedHeader.users._id).subscribe(data2 => {
      this.Devices = data2;
    });
  }
  test() {

  }

  Profile() {
    const modalRef = this.dialog.open(ProfileDevicesComponent, {
      size: 'xl',
      backdrop: 'static',
      windowClass: 'custom-class',
    });
  }

  checkboxStatus(device) {
    if (device.Status === 'desactivated') {
      console.log('test3');
      this.areaForm1.controls['code'].setValue(device.identifiant);
      this.areaForm1.controls['event'].setValue('activated');
      device.Status = 'activated';
      this.devicesService.EditDeviceStatus(device, device._id).subscribe();
      this.lignesService.updateLigneStatusByidDeviceA(device._id, null).subscribe();
      this.devicesService.onoffStatus(this.areaForm1.value).subscribe();
      // location.reload();
    } else if (device.Status === 'activated') {
      this.areaForm1.controls['code'].setValue(device.identifiant);
      this.areaForm1.controls['event'].setValue('desactivated');
      console.log('test2');
      device.Status = 'desactivated';
      this.devicesService.EditDeviceStatus(device, device._id).subscribe();
      this.lignesService.updateLigneStatusByidDevice(device._id, null).subscribe();
      this.devicesService.onoffStatus(this.areaForm1.value).subscribe();
      // location.reload();
    }
  }
  checkboxStatus2() {
    this.lignesService.updateLigneStatus3(this.idClicked, null).subscribe( result => console.log(result));
    this.areaService.EditAreaStatus(null, this.idClicked).subscribe();
    // location.reload();
  }
  AssingProfile() {
    const modalRef = this.dialog.open(AssignProfileComponent, {
      size: 'xl',
      backdrop: 'static',
      windowClass: 'custom-class',
    });
  }
}
