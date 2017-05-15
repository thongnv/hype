import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AppState } from '../app.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.css']
})
export class MemberComponent implements OnInit {

  public userInfo: any;

  public settingForm = this.fb.group({
    receiveEmail: true
  });
  constructor(
      public fb: FormBuilder,
      private appState: AppState
  ) { }

  demo(): void{
    this.userInfo = this.appState.state.userInfo;
  }

  onSubmit(event): void{
    console.log(this.settingForm.value);
  }

  ngOnInit() {
    this.demo();
  }

}
