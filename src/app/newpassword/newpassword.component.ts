import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import jwt_decode from 'jwt-decode';
import {ActivatedRoute, Router} from '@angular/router';
import {AreaService} from '../Services/area.service';
import {NotificationsService} from 'angular2-notifications';

@Component({
  selector: 'app-newpassword',
  templateUrl: './newpassword.component.html',
  styleUrls: ['./newpassword.component.css']
})
export class NewpasswordComponent implements OnInit {
  areaForm1 = new FormGroup({
    password: new FormControl('', [Validators.required]),
    password2: new FormControl('', [Validators.required]),
  });
  tokenn;
  constructor(private activatedRoute: ActivatedRoute, public areaService: AreaService , private service: NotificationsService ,
              private router: Router) { }

  ngOnInit(): void {
    this.tokenn = this.activatedRoute.snapshot.paramMap.get('id');
  }
  OnSuccess() {
    console.log('ezarrrrrrrrrrrrrrrrrrr')
    this.service.success('Success', 'Password changed sended', {
      position: ['bottom', 'right'],
      timeOut: 2000,
      animate: 'fade',
      showProgressBar: true,
    })
  }
  addDevices() {
    if (this.areaForm1.valid) {
    if (this.areaForm1.controls['password'].value === this.areaForm1.controls['password2'].value) {
      // @ts-ignore
      this.areaService.changepassword(jwt_decode(this.tokenn).users._id , this.areaForm1.value).subscribe();
      this.OnSuccess();
      this.router.navigateByUrl('');
    } else {
      alert('You must fill all the fields !');
    }
    } else {
      alert('You need to insert your Password');
    }
  }
}
