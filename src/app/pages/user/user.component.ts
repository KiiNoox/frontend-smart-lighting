import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../../Services/user.service';
import {ActivatedRoute, Router} from '@angular/router';
import {LOCAL_STORAGE, WebStorageService} from 'ngx-webstorage-service';
import jwt_decode from 'jwt-decode';
import {AreaService} from '../../Services/area.service';
import {DataComponent} from '../data/data.component';
import {ADDUserComponent} from '../adduser/adduser.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {NotificationsService} from 'angular2-notifications';

@Component({
    selector: 'user-cmp',
    moduleId: module.id,
    templateUrl: 'user.component.html'
})

export class UserComponent implements OnInit {
  userForm2 = new FormGroup({
    username: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    Confirmpassword: new FormControl('', [Validators.required]),
    useractive:  new FormControl('', [Validators.required]),
    license:  new FormControl('', [Validators.required]),
  });
  Error: Boolean = false;
  tokenn;
  ErrorPassword: Boolean = false;
  SearchText;
  users: any[];
  ErrorValidation: Boolean = false;
  constructor(public userService: UserService, private formBuilder: FormBuilder, private router: Router,
              @Inject(LOCAL_STORAGE) private storage: WebStorageService , private activatedRoute: ActivatedRoute ,
              public areaService: AreaService ,  private dialog: NgbModal ,  private service: NotificationsService ) {
  }
    ngOnInit() {
      const decodedHeader = jwt_decode(this.storage.get('token'));
      // @ts-ignore
      console.log(decodedHeader.users.useractive);
    // @ts-ignore
      this.afficheuser(decodedHeader.users._id);
    }
  RegisterUser(value: any) {
    if (this.userForm2.get('password').value !==    this.userForm2.get('Confirmpassword').value) {
      this.ErrorPassword = true;
    } else {
      const decodedHeader = jwt_decode(this.storage.get('token'));
      // @ts-ignore
      this.userForm2.controls['useractive'].setValue(decodedHeader.users._id);
      // @ts-ignore
      this.userForm2.controls['license'].setValue(decodedHeader.users.license);
      if (this.userForm2.valid) {
        this.userService.registeruser(this.userForm2.value).subscribe(data => {
          console.log(data.error );
          if (data.error !== undefined) {
            this.Error = true;
          }
        });
        this.userForm2.get('username').reset();
        this.userForm2.get('email').reset();
        this.userForm2.get('password').reset();
        this.userForm2.get('Confirmpassword').reset();
      } else {
        alert('You must fill all the fields !');
      }}
  }
  afficheuser(users) {
    this.areaService.getallusers(users).subscribe(data => {
      console.log(data);
      this.users = data ;
    });
  }
  addUser() {
    const modalRef = this.dialog.open(ADDUserComponent , { size: 'lg',
      backdrop: 'static',
      windowClass: 'custom-class',
    });
    modalRef.componentInstance.passEntry.subscribe((cols) => {
      this.users.push(cols);
      this.OnSuccess();
    });
  }

  OnSuccess() {
    this.service.success('Success', 'message', {
      position: ['bottom', 'right'],
      timeOut: 2000,
      animate: 'fade',
      showProgressBar: true,
    })
  }
}
