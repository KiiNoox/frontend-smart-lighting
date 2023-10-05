import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../Services/user.service';

@Component({
  selector: 'app-confirmmail',
  templateUrl: './confirmmail.component.html',
  styleUrls: ['./confirmmail.component.css']
})
export class ConfirmmailComponent implements OnInit {
  @Input() data;
  userForm1 = new FormGroup({
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });
  get email() {
    return this.userForm1.get('email');
  }

  get password() {
    return this.userForm1.get('password');
  }
  constructor(private activatedRoute: ActivatedRoute, public userService: UserService) { }

  ngOnInit(): void {
    this.data = this.activatedRoute.snapshot.queryParamMap.get('data')
    this.userForm1.controls['email'].setValue(this.data);
    console.log(this.userForm1.get('email').value)
    this.userService.SendMailConfirmation(this.userForm1.value).subscribe();
  }

}
