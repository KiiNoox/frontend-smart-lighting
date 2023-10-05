import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AreaService} from '../Services/area.service';
import {NotificationsService} from 'angular2-notifications';
import {Router} from '@angular/router';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent implements OnInit {
  areaForm1 = new FormGroup({
    email: new FormControl('', [Validators.required]),
  });
  constructor( public areaService: AreaService , private service: NotificationsService , private router: Router) { }

  ngOnInit(): void {
  }
  OnSuccess() {
    console.log('ezarrrrrrrrrrrrrrrrrrr')
    this.service.success('Success', 'mail sended', {
      position: ['bottom', 'right'],
      timeOut: 2000,
      animate: 'fade',
      showProgressBar: true,
    })
  }
  addDevices() {
    if (this.areaForm1.valid) {
      this.areaService.forgotpassword(this.areaForm1.value).subscribe();
      this.OnSuccess();
    } else {
     alert('You need to insert your mail');
    }
  }
}
