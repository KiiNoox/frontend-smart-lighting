import {Component, Inject, OnInit} from '@angular/core';
import {UserService} from '../../Services/user.service';
import {NotifierOptions, NotifierService} from 'angular-notifier';
import {User} from '../../models/User';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {LOCAL_STORAGE, WebStorageService} from 'ngx-webstorage-service';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  userForm1 = new FormGroup({
    username: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    role: new FormControl('', [Validators.required]),

  });

  get username() {
    return this.userForm1.get('username');
  }

  get email() {
    return this.userForm1.get('email');
  }

  get password() {
    return this.userForm1.get('password');
  }


  constructor(public userService: UserService,  private formBuilder: FormBuilder , private router: Router,
              @Inject(LOCAL_STORAGE) private storage: WebStorageService) { }

  ngOnInit(): void {
    if (this.storage.get('token') === undefined) {
      this.router.navigateByUrl('/');
    }
  }
  addCompany(value: any) {
    console.log(this.userForm1.value);

    if (this.userForm1.valid) {
     // this.userService.registerCompany(this.userForm1.value).subscribe(data => 'ok');
      console.log('test');    }
  }
}
