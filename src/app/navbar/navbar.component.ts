import { Component, OnInit } from '@angular/core';
import { AppState } from '../app.service';
import { MainService } from '../services/main.service';
import { AppSetting } from '../app.setting';
import { LocalStorageService } from 'angular-2-local-storage';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  public loginData: any;

  public isIn = false;
  public userInfo: any;
  public mapOptions: any[];
  public notifications: any;
  public selectedMapOption: any;
  public notificationPage: number = 0;
  public set: any = {
    offset: 0, endOfList: false, loadingInProgress: false
  };

  public constructor(public appState: AppState, private mainService: MainService,
                     private localStorageService: LocalStorageService) {
    let notificationPage = this.appState.state.notificationPage;
    if (notificationPage !== undefined) {
      this.notificationPage = notificationPage;
    }
    this.appState.set('notificationPage', this.notificationPage);
  }

  public onSelectMapOption(option: any): void {
    this.selectedMapOption = option;
  }

  public toggleState() {
    let bool = this.isIn;
    this.isIn = bool === false;
  }

  public ngOnInit() {
    this.loginData = this.localStorageService.get('loginData') ?
      JSON.parse(<string> this.localStorageService.get('loginData')) : null;
    console.log('local storage: ', this.loginData);
    this.appState.set('loginData', this.loginData);
    this.userInfo = this.appState.state.userInfo;
    this.mapOptions = [
      {id: 1, name: 'Singapore'},
      {id: 2, name: 'Neighbourhood'}
    ];
    this.selectedMapOption = this.mapOptions[0];
    if (this.loginData) {
      this.getNotifications();
    }
  }

  public getNotifications() {
    this.mainService.getNotifications(this.notificationPage).then((resp) => {
      this.notifications = resp.data;
      console.log('this.notifications', this.notifications);
    });
  }

  public onMarkAllRead() {
    this.notifications.results.forEach((notif) => {
      notif.viewed = 'true';
    });
    this.notifications.unread = 0;
    this.mainService.updateNotifications('all', null).then((resp) => {
      console.log('resp', resp);
    });
  }

  public onMarkOneRead(item) {
    item.viewed = true;
    this.mainService.updateNotifications('any', item.mid).then((resp) => {
      console.log('resp', resp);
    });
  }

  public onScrollToBottom() {
    if (!this.set.loadingInProgress) {
      this.set.endOfList = false;
      this.set.loadingInProgress = true;
      let count = 0;
      this.mainService.getNotifications(++this.notificationPage).then((response) => {
        if (response.data.results.length) {
          response.data.results.forEach((item) => {
            count++;
            this.notifications.results.push(item);
          });
          if (count === 0) {
            this.set.endOfList = true;
            this.notificationPage--;
          }
        } else {
          this.set.endOfList = true;
        }
        this.set.loadingInProgress = false;
      });
    }
  }
}
