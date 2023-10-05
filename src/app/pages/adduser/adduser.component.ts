import {Component, EventEmitter, Inject, OnInit, Output} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import jwt_decode from 'jwt-decode';
import {UserService} from '../../Services/user.service';
import {LOCAL_STORAGE, WebStorageService} from 'ngx-webstorage-service';

@Component({
  selector: 'app-adduser',
  templateUrl: './adduser.component.html',
  styleUrls: ['./adduser.component.css']
})
export class ADDUserComponent implements OnInit {
  userForm2 = new FormGroup({
    username: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    Confirmpassword: new FormControl('', [Validators.required]),
    useractive: new FormControl('', [Validators.required]),
    license: new FormControl('', [Validators.required]),
  });
  Error: Boolean = false;
  tokenn;
  ErrorPassword: Boolean = false;
  SearchText;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  users: any[];
  ErrorValidation: Boolean = false;

  constructor(private dialog: NgbModal, public userService: UserService, @Inject(LOCAL_STORAGE) private storage: WebStorageService) {
  }

  ngOnInit(): void {
  }

  RegisterUser(value: any) {
    if (this.userForm2.get('password').value !== this.userForm2.get('Confirmpassword').value) {
      this.ErrorPassword = true;
    } else {
      const decodedHeader = jwt_decode(this.storage.get('token'));
      // @ts-ignore
      this.userForm2.controls['useractive'].setValue(decodedHeader.users._id);
      // @ts-ignore
      this.userForm2.controls['license'].setValue(decodedHeader.users.license);
      this.userService.registeruser(this.userForm2.value).subscribe(data => {
        console.log(data.error);
        if (data.error !== undefined) {
          this.Error = true;
        }
        this.passEntry.emit(this.userForm2.value);
      });
      this.userForm2.get('username').reset();
      this.userForm2.get('email').reset();
      this.userForm2.get('password').reset();
      this.userForm2.get('Confirmpassword').reset();
      this.dialog.dismissAll();
    }
  }
}
