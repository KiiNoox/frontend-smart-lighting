import {Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import {
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,
} from '@angular/core';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours, parseISO,
} from 'date-fns';
import { Subject } from 'rxjs';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import jwt_decode from 'jwt-decode';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView,
} from 'angular-calendar';
const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
};

import { IDropdownSettings } from 'ng-multiselect-dropdown';
import {ProfileService} from '../../Services/profile.service';
import {AreaService} from '../../Services/area.service';
import {LOCAL_STORAGE, WebStorageService} from 'ngx-webstorage-service';
import {LignesService} from '../../Services/lignes.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import Swal from 'sweetalert2';
import {LocationProfile}from '../../models/LocationProfile'
import { LocationProfileService } from 'app/Services/location-profile.service';
@Component({
  selector: 'app-assign-profile',
  // changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './assign-profile.component.html',
  styleUrls: ['./assign-profile.component.css'],
  encapsulation: ViewEncapsulation.None,
})

export class AssignProfileComponent implements OnInit {
  areaForm1 = new FormGroup({
    users: new FormControl('', [Validators.required]),
    PRIMARY_COLOR: new FormControl('#a04b4b', [Validators.required]),
    SECONDARY_COLOR: new FormControl('#f22626', [Validators.required]),
    Start_Date: new FormControl('', [Validators.required]),
    End_Date: new FormControl('', [Validators.required]),
    Profile: new FormControl('', [Validators.required]),
    Area: new FormControl('', [Validators.required]),
    Ligne: new FormControl('', [Validators.required]),
    title: new FormControl('', [Validators.required]),
    perodique: new FormControl('', [Validators.required]),
    mensuel: new FormControl('', [Validators.required]),
    annuel: new FormControl('', [Validators.required]),
  });
  areaForm2 = new FormGroup({
    Start_Date: new FormControl('', [Validators.required]),
    End_Date: new FormControl('', [Validators.required]),
    Area: new  FormControl('', [Validators.required]),
    Ligne: new  FormControl('', [Validators.required]),
    state:new FormControl('',[Validators.required])
  });
  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;
  @ViewChild('modalContentEdit', { static: true }) modalContentEdit: TemplateRef<any>;
  @ViewChild('profileSelect') profileSelect;

  modalRef: NgbModalRef;
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  selectedProfile;
  idprofileselected=null;
  locationPofileToUpdate;
  LigneProfile;
  SiteProfile;
  areaNotInProfile
  lineNotInProfile
  endDate;
  startDate;
  viewDate: Date = new Date();
  newnameprofile;
  newdateend;
  selectedItems = [];
  dropdownSettings = {};
  selectedItems2 = [];
  dropdownSettings2 = {};
  dropdownSettings3 = {};
  selectedItems3 = [];
  dropdownSettings4 = {};
  selectedItems4 = [];
  selectedItems5 = [];
  dropdownSettings5 = {};
 Getlignebyprofile 
  keyword = 'name';
  AreaSelected = [];
  LigneSelected = [];
  daysSelected = [];
  AreaDeleteSelected = [];
  LigneDeleteSelected = [];
  ligneByprofile = [];
  //@ts-ignore
  currentUser=jwt_decode(this.storage.get('token')).users._id;
  LigneClicked = false;
  SiteClicked = false;
  addsite = false;
  addligne = false;
  removesite = false;
  removeligne = false;
  P = 0;
  M = 0;
  A = 0;
  AreaByProfile;
  modalData: {
    Profile: string;
    event: CalendarEvent;
  };
  locationprofileData: any;
  refresh: Subject<any> = new Subject();
  listOfAsignedProfiles:LocationProfile[];
  cols: any[];
  colsA: any[];
  area: any[];
  ligne: any[];
  events: any;
  days: any[];
  items: Array<CalendarEvent<{ time: any }>> = [];
  activeDayIsOpen = false;
  actions: CalendarEventAction[] = [
    {
      label: '<i class="fas fa-fw fa-pencil-alt"></i>',
      a11yLabel: 'Edit',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      },
    },
    {
      label: '<i class="fas fa-fw fa-trash-alt"></i>',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter((iEvent) => iEvent !== event);
        this.handleEvent('Deleted', event);
      },
    },
  ];

  constructor(private modal: NgbModal , public profileService: ProfileService, public areaService: AreaService, 
    public locationProfileService:LocationProfileService,  public  lignesService: LignesService ,  @Inject(LOCAL_STORAGE) private storage: WebStorageService  ) { }
  ngOnInit(): void {

    console.log (this.currentUser,"sssssssssssssssssssssssssssssssssssssssssssssssssssssssssss")
    this.idprofileselected=null;
     this.days = ['Mondays' , 'Tuesday' , 'Wednesday' , 'Thursday' , 'Friday' , 'Saturday' , 'Sunday'];
    console.log('this.actions');
    console.log(this.actions);
    const decodedHeader = jwt_decode(this.storage.get('token'));
    console.log(subDays(startOfDay(new Date()), 1));
  
     // @ts-ignore
    this.locationProfileService.getAssignedProfilesByUser(this.currentUser).subscribe(data=>{
     // @ts-ignore
    this.listOfAsignedProfiles=data;
  console.log(data);
       // @ts-ignore
console.log(this.listOfAsignedProfiles[0].Area.length)})
    // @ts-ignore
    this.profileService.getProfile(decodedHeader.users._id).subscribe(data => {
   //   data = data.filter(item => item.Status === 'Activated');
      this.cols = data ;
      console.log(this.cols);

      const uniqueColors = new Set();
      for (let i = 0; i < this.listOfAsignedProfiles.length; i++) {
        let primaryColor, secondaryColor;
        do {
          primaryColor = getRandomColor();
          secondaryColor = getRandomColor();
      } while (uniqueColors.has(primaryColor) || uniqueColors.has(secondaryColor));
  
      uniqueColors.add(primaryColor);
      uniqueColors.add(secondaryColor);
        // @ts-ignore
          this.items.push({
          start: parseISO(this.listOfAsignedProfiles[i].Start_Date),
          end: parseISO(this.listOfAsignedProfiles[i].End_Date),
          title: "ok",
          color: {primary: primaryColor, secondary: secondaryColor},
          //actions: this.ligneByprofile,
            // @ts-ignore
          //attendees: this.SiteProfile,
          allDay: true,
          resizable: {
            beforeStart: true,
            afterEnd: true,
          },
          draggable: false, }
        );
         
     
      }
      this.refresh.next();
    });
console.log(this.items)
    this.events = this.items;
    console.log(this.events)

    console.log('this.events');

    console.log(this.events);

    this.AfficheProfile();
    this.AfficheSite();
    this.AfficheLigne();

    this.selectedItems = [];
    this.dropdownSettings = {
      singleSelection: false,
      idField: '_id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 2,
      allowSearchFilter: true
    };
    this.selectedItems2 = [
    ];
    this.dropdownSettings2 = {
      singleSelection: false,
      idField: '_id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
    this.selectedItems3 = [
    ];
    this.dropdownSettings3 = {
      singleSelection: false,
      idField: '_id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
    this.selectedItems4 = [
    ];
    this.dropdownSettings4 = {
      singleSelection: false,
      idField: '_id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };



  
  }


  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  eventTimesChanged({
                      event,
                      newStart,
                      newEnd,
                    }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
    this.handleEvent('Dropped or resized', event);
  }

  handleEvent(action: string, event: CalendarEvent): void {
    // @ts-ignore
    this.modalData = { event, action };
    this.modal.open(this.modalContent, { size: 'lg' });
  }
  EditProfile(id) {
      this.locationPofileToUpdate=id;
      this.locationProfileService.getOneAsignedProfile(id).subscribe(
      data=>{
      this.locationprofileData=data;
      console.log(this.locationprofileData,"dataaaaaaaaaaaa1")
       this.locationProfileService.getRelatedAreas(this.locationprofileData._id).subscribe(data2 => {
        this.AreaByProfile = data2;
        this.areaNotInProfile = this.area.filter(area => !this.AreaByProfile.some(profile => profile._id === area._id));

        
        
      });
        this.locationProfileService.getRelatedLignes(this.locationprofileData._id).subscribe(data2 => {
        this.Getlignebyprofile = data2;
       this.lineNotInProfile=this.ligne.filter(ligne => !this.Getlignebyprofile.some(profile => profile._id === ligne._id));     }
    );


      this.startDate= this.locationprofileData.Start_Date.split('/').reverse().join('-').slice(0, 10);
      this.endDate= this.locationprofileData.End_Date.split('/').reverse().join('-').slice(0, 10);
    })

   
  
    this.modalRef =this.modal.open(this.modalContentEdit, { size: 'lg' });
  }
  
  deleteEvent(eventToDelete: CalendarEvent) {
    this.events = this.events.filter((event) => event !== eventToDelete);
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  hasAreas(index: number): boolean {
    return this.listOfAsignedProfiles[index].Area.length > 0;
  }
  

  onItemSelectLine(item: any) {
    this.LigneSelected.push(item);
    for(let i=0;i<this.LigneSelected.length;i++){
     }
     console.log(this.LigneSelected);   
  }
  onSelectAllLines(items: any) {
    this.LigneSelected=[]
    for (const item of items) {
        this.LigneSelected.push(item);
       }  
     console.log( this.LigneSelected);
  }
  onDeSelectAllLines(){
    this.LigneSelected=[]
    console.log(this.LigneSelected)
  }
  onDeSelectLine(itemToDelete: any){
    this.LigneSelected = this.LigneSelected.filter(item => item._id!== itemToDelete._id);
    console.log(this.LigneSelected)
  }
  
  onItemSelect(item: any) {
    this.AreaSelected.push(item);
        for(let i=0;i<this.AreaSelected.length;i++){
     }
     console.log(this.AreaSelected);   
        console.log(this.AreaSelected[0].length)
  }
  onSelectAll(items: any) {
    this.AreaSelected=[]
    for (const item of items) {
        this.AreaSelected.push(item);
       }    console.log( this.AreaSelected);
  console.log(this.AreaSelected[0].length)

   console.log(this.AreaSelected);
  }
  onDeSelectAll(){
   
      this.AreaSelected=[]
    
      console.log(this.AreaSelected)
    }
  onDeSelect(itemToDelete: any){
    this.AreaSelected = this.AreaSelected.filter(item => item._id!== itemToDelete._id);
    console.log(this.AreaSelected,"new tab")
  }
  AfficheProfile() {
    const decodedHeader = jwt_decode(this.storage.get('token'));
    // @ts-ignore
    this.profileService.getProfile(decodedHeader.users._id).subscribe(data => {
      //this.cols = data.filter(item => item.Status === 'Activated');
      this.colsA =  data//.filter(item => item.Status === 'desactivated');
    });
  }
  AfficheSite() {
    const decodedHeader = jwt_decode(this.storage.get('token'));
    // @ts-ignore
    this.areaService.getArea(decodedHeader.users._id).subscribe(data => {
      this.area = data;
    });
  }
  AfficheLigne() {
    const decodedHeader = jwt_decode(this.storage.get('token'));
    // @ts-ignore
    this.lignesService.getLigne(decodedHeader.users._id).subscribe(data => {
      this.ligne=data;
    });
  }

  AddProfile() {
    let formvalide=true;
    this.areaForm1.controls['users'].setValue(this.currentUser);
    this.areaForm1.controls['perodique'].setValue(this.daysSelected);
    if(this.idprofileselected!=null)
    {this.areaForm1.controls['Profile'].setValue( this.idprofileselected._id)}
    if (  this.M === 1 ) {
      this.areaForm1.controls['mensuel'].setValue(1);
      this.areaForm1.controls['annuel'].setValue(0);
    }
    if (  this.A === 1 ) {
      this.areaForm1.controls['annuel'].setValue(1);
      this.areaForm1.controls['mensuel'].setValue(0);
    }  
    if(this.idprofileselected == null)
    {
      formvalide=false
      alert("you have to chose one profile")
      this.areaForm1.controls['Profile'].setValue( null)

    }
    if(this.areaForm1.value.Start_Date>  this.areaForm1.value.End_Date ||this.areaForm1.value.End_Date==null )
    { formvalide=false
      alert("verify Date")
      this.areaForm1.controls['Profile'].setValue( null)

    }
  if (this.areaForm1.value.annuel==''&& this.areaForm1.value.mensuel==''&&this.areaForm1.value.perodique==''&& formvalide){
    formvalide=false
    alert("verify scheduling")
    this.areaForm1.controls['Profile'].setValue( null)
  }
  if( this.idprofileselected._id=null)
    console.log("area form values",this.areaForm1.value);
    if (this.AreaSelected.length > 0 &&formvalide) {
    this.areaForm1.controls['Ligne'].setValue([]);

      this.locationProfileService.AssignProfile(this.areaForm1.value).subscribe(
        (response) => {
          console.log('Request was successful:', response);
        },
        (error) => {
          alert('An error occurred:'+ error);
        }

      );
  
     
      this.AreaSelected = []; 
    }
   else if (this.LigneSelected.length > 0 &&formvalide) {
     this.areaForm1.controls['Area'].setValue([]);
     this.locationProfileService.AssignProfile(this.areaForm1.value).subscribe(
      (response) => {
        console.log('Request was successful:', response);
      },
      (error) => {
        alert('An error occurred:'+ error);
      }

    );;

     this.LigneSelected = [];
   }
   else if (formvalide){
    alert(" You have to chose at least one area or one ligne ")

   }
    this.areaForm1.get('Start_Date').reset();
    this.areaForm1.get('End_Date').reset();
    this.areaForm1.get('Area').reset();
    this.areaForm1.get('Ligne').reset();
    this.areaForm1.get('title').reset();
    this.areaForm1.get('perodique').reset();
    this.refresh.next();
    this.ngOnInit();
    this.refresh.next();
    this.retour();
    this.retour2()

  }
  


  handleUnselect(){
    this.idprofileselected = null;
   this.profileSelect.clear();

  }
  selectEvent(item) {
    this.idprofileselected = item;
    console.log(this.idprofileselected)

  }


  Siteclick() {
    this.SiteClicked = true;
  }

  Ligneclick() {
    this.LigneClicked = true;
  }
  retour() {
    this.LigneClicked = false;
    this.SiteClicked = false;
    this.AreaSelected = [];
    this.LigneSelected = [];
    this.LigneDeleteSelected=[]
    this.AreaDeleteSelected=[]
  }
  retour2() {
    this.M = 0;
    this.P = 0;
    this.A = 0;
  }




  onItemSelect5(item: any) {
   // this.days = ['Mondays' , 'Tuesday' , 'Wednesday' , 'Thursday' , 'Friday' , 'Saturday' , 'Sunday'];
    if (item === 'Mondays') {
      this.daysSelected.push(1);
    }
    if (item === 'Tuesday') {
      this.daysSelected.push(2);
    }
    if (item === 'Wednesday') {
      this.daysSelected.push(3);
    }
    if (item === 'Thursday') {
      this.daysSelected.push(4);
    }
    if (item === 'Friday') {
      this.daysSelected.push(5);
    }
    if (item === 'Saturday') {
      this.daysSelected.push(6);
    }
    if (item === 'Sunday') {
      this.daysSelected.push(7);
    }
  console.log(item);
    console.log( this.daysSelected);
  }
  onSelectAll5(items: any) {
    for (let i = 0 ; i < 7 ; i++) {
      if (items[i] === 'Mondays') {
        this.daysSelected.push(1);
      }
      if (items[i] === 'Tuesday') {
        this.daysSelected.push(2);
      }
      if (items[i] === 'Wednesday') {
        this.daysSelected.push(3);
      }
      if (items[i] === 'Thursday') {
        this.daysSelected.push(4);
      }
      if (items[i] === 'Friday') {
        this.daysSelected.push(5);
      }
      if (items[i] === 'Saturday') {
        this.daysSelected.push(6);
      }
      if (items[i] === 'Sunday') {
        this.daysSelected.push(7);
      }
    }
    // this.daysSelected.push(items);
    console.log('items');
    console.log(items);
    console.log( this.daysSelected);
  }
  onItemSelect3(item: any) {
    this.AreaDeleteSelected.push(item);
    console.log(item);
  }
  onSelectAll3(items: any) { 
    items.forEach(element => {this.AreaDeleteSelected.push(element)
      
    });
    console.log(this.AreaDeleteSelected);
  }
  onItemSelect4(item: any) {
    this.LigneDeleteSelected.push(item);
    console.log(item);
  }
  onSelectAll4(items: any) {
    items.forEach(element => {this.LigneDeleteSelected.push(element)      
    });
    console.log(items);
  }
  SearchLignebyProfile(id) {
    this.profileService.getLigneByprofile(id).subscribe(data => {
      this.ligneByprofile = data ;
    });
  }
  testdata(id) {
    console.log(id);
    this.profileService.getLigneByprofile(id).subscribe(data2 => {
      this.LigneProfile = data2;
    });
  }
  testdata2(id) {
    this.profileService.getAreaByprofile(id).subscribe(data2 => {
      this.SiteProfile = data2;
    });
  }
  CancelProfile(id) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this Assign!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Cancel it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        Swal.fire(
          'Deleted!',
          'this Assign has been Canceled.',
          'success'
        )
        this.locationProfileService.CancelAssignByprofile(id).subscribe();
        this.events = this.events.filter((event) => event._id !== id);
        //@ts-ignore
        this.listOfAsignedProfiles = this.listOfAsignedProfiles.filter(cols => cols._id !== id);
        this.AfficheLigne();
        this.AfficheSite();
        this.AfficheProfile();

      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Your Assign is safe :)',
          'error'
        )
      }
    })


  }

  AddSiteclick() {
    this.addsite = true;
  }
  AddLigneclick() {
    this.addligne = true;
  }
  removeSiteclick() {
    this.removesite = true;
  }
  removeLigneclick() {
    this.removeligne = true;
  }
  retourEdit() {
    this.addsite = false;
    this.addligne = false;
    this.removesite = false;
    this.removeligne = false;
    this.AreaSelected = [];
    this.LigneSelected = [];
    this.AreaDeleteSelected = [];
    this.LigneDeleteSelected = [];
    console.log(this.AreaSelected);
  }
  UpdateProfile() {
    let datesValide=true;
    console.log( this.locationPofileToUpdate,88888888888888888888888)
    let currentArea=this.area.filter(area => this.AreaByProfile.some(profile => profile._id === area._id));
    let currentLine=this.ligne.filter(line => this.Getlignebyprofile.some(profile => profile._id === line._id));
    console.log(currentLine)
    this.areaForm2.controls['Start_Date'].setValue(this.startDate);
    this.areaForm2.controls['Area'].setValue(currentArea);
    this.areaForm2.controls['Ligne'].setValue(currentLine);
    console.log("boool",this.areaForm2.value.Start_Date>  this.areaForm2.value.End_Date )
    if(this.areaForm2.value.Start_Date>  this.areaForm2.value.End_Date ||this.areaForm2.value.End_Date==null )
    {
      datesValide=false;
      alert("verify date")
    }

    
    if(datesValide){
    if (this.AreaSelected.length > 0) {
     
      // let areasToAdd= this.AreaSelected.map(area=>area._id)
      // console.log(areasToAdd)
      // currentArea.map(e=>this.AreaSelected.push(e));
      this.areaForm2.controls['Area'].setValue(this.AreaSelected);
      this.areaForm2.controls['state'].setValue("add area");

      for(let i=0;i<this.AreaSelected.length;i++){
        const requestBody = {
          _id: this.AreaSelected[i]._id,
          locationPofileToUpdate: this.locationPofileToUpdate
        };

     this.locationProfileService.updateAssignedProfile(this.locationPofileToUpdate,this.areaForm2.value,).subscribe(
      ()=>{
        this.locationProfileService.addProfileToArea(requestBody).subscribe(
          (response) => {
            console.log('Request was successful:', response);
          },
          (error) => {
            alert('An error occurred:'+ error);
          }
        );
      },
      (error)=>{
        alert('An error occurred:'+ error);
      }
     ); 
     
    }
      this.AreaSelected = [];
    }

    else if (this.AreaDeleteSelected.length > 0) {

      // const filteredAreas = currentArea.filter(area => {
      //   return !this.AreaDeleteSelected.some(selectedArea => selectedArea._id === area._id);
      // });

      this.areaForm2.controls['Area'].setValue(this.AreaDeleteSelected);
      this.areaForm2.controls['state'].setValue("remove area");

      for(let i=0;i<this.AreaDeleteSelected.length;i++){
        const requestBody = {
          _id: this.AreaDeleteSelected[i]._id,
          locationPofileToUpdate: this.locationPofileToUpdate
        };

        this.locationProfileService.updateAssignedProfile(this.locationPofileToUpdate,this.areaForm2.value,).subscribe(
          ()=>{
            this.locationProfileService.removeProfileFromArea(requestBody).subscribe(
              (response) => {
                console.log('Request was successful:', response);
              },
              (error) => {
                alert('An error occurred:'+ error);
              }
            );
          },
          (error)=>{
            alert('An error occurred:'+ error);
          }
         ); 

    //  this.locationProfileService.removeProfileFromArea(requestBody).subscribe(
    //   (response) => {
    //     console.log('Request was successful:', response);
    //   },
    //   (error) => {
    //     console.error('An error occurred:', error);
    //   }
    // );
      
     }
      this.AreaDeleteSelected=[]
    }

    else if (this.LigneSelected.length > 0) {
      currentLine.map(e=>this.LigneSelected.push(e));
      this.areaForm2.controls['Ligne'].setValue(this.LigneSelected);
      this.areaForm2.controls['state'].setValue("add line");


      for(let i=0;i<this.LigneSelected.length;i++){
        const requestBody = {
          _id: this.LigneSelected[i]._id,
          locationPofileToUpdate: this.locationPofileToUpdate
          
        };
      this.locationProfileService.updateAssignedProfile(this.locationPofileToUpdate,this.areaForm2.value,).subscribe(
        ()=>{
          this.locationProfileService.addProfileToLigne(requestBody).subscribe(
            (response) => {
              console.log('Request was successful:', response);
            },
            (error) => {
              alert('An error occurred:'+ error);
            }
          );
        },
        (error)=>{
          alert('An error occurred:'+ error);
        }
       );  


  
        // this.locationProfileService.addProfileToLigne(requestBody).subscribe(
        //   (response) => {
        //     console.log('Request was successful:', response);
        //   },
        //   (error) => {
        //     console.error('An error occurred:', error);
        //   });
        // }
    
   
      this.LigneSelected = [];
    }
    }
    else if (this.LigneDeleteSelected.length > 0) {
      // const filteredLines = currentLine.filter(line => {
      //   return !this.LigneDeleteSelected.some(selectedLine => selectedLine._id === line._id);
      // });

      
      this.areaForm2.controls['Ligne'].setValue(this.LigneDeleteSelected);
      this.areaForm2.controls['state'].setValue("remove line");

      for(let i=0;i<this.LigneDeleteSelected.length;i++){
        const requestBody = {
          _id: this.LigneDeleteSelected[i]._id,
          locationPofileToUpdate: this.locationPofileToUpdate
        };
      this.locationProfileService.updateAssignedProfile(this.locationPofileToUpdate,this.areaForm2.value,).subscribe(
        ()=>{
          this.locationProfileService.removeProfileFromLigne(requestBody).subscribe(
            (response) => {
              console.log('Request was successful:', response);
            },
            (error) => {
              alert('An error occurred:'+ error);
            }
          );
        },
        (error)=>{
          alert('An error occurred:'+ error);
        }
       );   

    
    //  this.locationProfileService.removeProfileFromLigne(requestBody).subscribe(
    //   (response) => {
    //     console.log('Request was successful:', response);
    //   },
    //   (error) => {
    //     console.error('An error occurred:', error);
    //   }
    // );
      }

      this.LigneDeleteSelected=[]
    }
    else {
      this.areaForm2.controls['state'].setValue("updating date");
      this.locationProfileService.updateAssignedProfile(this.locationPofileToUpdate,this.areaForm2.value,).subscribe(
        ()=>{
        console.log("done")        },
        (error)=>{
          alert('An error occurred:'+ error);
        }
       );  
    }

    console.log(this.areaForm2.value);


    close();

    this.areaForm2.get('End_Date').reset();
    this.areaForm2.get('Start_Date').reset();
    this.areaForm1.get('Area').reset();
    this.areaForm1.get('Ligne').reset();

    this.addsite = false;
    this.addligne = false;
    this.removesite = false;
    this.removeligne = false;
    this.ngOnInit();
    this.modalRef.close();
  }
  }
  zero() {
  }
  Pclick() {
    this.P = 1;
    this.M = 3;
    this.A = 3;
  }
  Mclick() {
    this.M = 1;
    this.P = 3;
    this.A = 3;

  }
  Aclick() {
    this.M = 3;
    this.P = 3;
    this.A = 1;
  }


}
function getRandomColor() {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `#${r.toString(16)}${g.toString(16)}${b.toString(16)}`;
}