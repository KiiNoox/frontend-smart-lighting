import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../Services/user.service';
import {Router} from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import jwt_decode from 'jwt-decode';

// @ts-ignore
import {LOCAL_STORAGE, WebStorageService} from 'ngx-webstorage-service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  userForm1 = new FormGroup({
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });
  userForm2 = new FormGroup({
    username: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    Confirmpassword: new FormControl('', [Validators.required]),
  });
Error: Boolean = false;
  tokenn;
ErrorPassword: Boolean = false;
  ErrorValidation: Boolean = false;
  get email() {
    return this.userForm1.get('email');
  }

  get password() {
    return this.userForm1.get('password');
  }

  constructor(public userService: UserService, private formBuilder: FormBuilder, private router: Router,
              @Inject(LOCAL_STORAGE) private storage: WebStorageService , private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {

    if (this.storage.get('token') !== undefined) {
      this.router.navigateByUrl('/dashboard');
    }
    const signUpButton = document.getElementById('signUp');
    const signInButton = document.getElementById('signIn');
    const container = document.getElementById('container');
    console.log(this.storage.get('token'),'tokkkennn')

    signUpButton.addEventListener('click', () => {
      console.log('hello');
      container.classList.add('right-panel-active');
    });

    signInButton.addEventListener('click', () => {
      console.log('hello');
      container.classList.remove('right-panel-active');
    });
    this.tokenn = this.activatedRoute.snapshot.paramMap.get('id');
    console.log('eeeeeee' + this.tokenn);
if (this.tokenn !== null) {
  // @ts-ignore
  console.log('/*/*/*/*/*/*/*/' + jwt_decode(this.tokenn).users);
// @ts-ignore
  this.userService.ConfirmMail(jwt_decode(this.tokenn).users._id).subscribe();
}
  }
  RegisterUser(value: any) {
      if (this.userForm2.get('password').value !==    this.userForm2.get('Confirmpassword').value) {
        this.ErrorPassword = true;
      } else {
        if (this.userForm2.valid) {
        this.userService.register(this.userForm2.value).subscribe(data => {
          console.log(data.error );
          if (data.error !== undefined) {
            this.Error = true;
          }
       //   const container = document.getElementById('container');
         // container.classList.remove('right-panel-active');
        });
          // @ts-ignore
          this.router.navigate(['/ConfirmMail'], {queryParams: {data:  this.userForm2.get('email').value}});
          this.userForm2.get('username').reset();
          this.userForm2.get('email').reset();
          this.userForm2.get('password').reset();
          this.userForm2.get('Confirmpassword').reset();
      } else {
          alert('You must fill all the fields !');
        }}
  }
  addCompany(value: any) {

    if (this.userForm1.valid) {
      this.userService.Login(this.userForm1.value).subscribe(data => {
        console.log(data.error);
        if (data.error === undefined) {
          console.log(data);
          this.storage.set('token', data);
          this.storage.set('Lng', 'en');
          const decodedHeader = jwt_decode(this.storage.get('token'));
          // @ts-ignore
          console.log(decodedHeader.users.license.length);
          // @ts-ignore
          for (let i = 0 ; i < decodedHeader.users.license.length ; i++) {
            console.log('cccccccccccccccccccccccccccccccc')
            // @ts-ignore
            // console.log(decodedHeader.users.license[i]._id);
            // @ts-ignore
            console.log(decodedHeader.users.license[i]);
          // @ts-ignore
          this.userService.VerifLicense(decodedHeader.users.license[i]).subscribe(data3 => {
            console.log('cccccccccccccccccccccccccccccccc2')
            console.log(data3);
          });
          }
          this.router.navigateByUrl('dashboard');
        } else {
          alert(data.error);
        }
      });

    } else {
      alert('You must fill all the fields !');
    }
  }
  resetError() {
    this.Error = false;
  }
}
