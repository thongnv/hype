import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { AppState } from '../app.service';
import { MainService } from '../services/main.service';
import { LocalStorageService } from 'angular-2-local-storage';
import { Router } from '@angular/router';
import { NotificationComponent } from './notification/notification.component';
import * as io from 'socket.io-client';
import { AppSetting } from '../app.setting';
import { ProfileService } from '../services/profile.service';
import { User } from '../app.interface';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',

  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  public onSearch = false;
  public mapOptions: any[] = [];
  public notifications: any;
  public selectedMapOption: any;
  public notificationPage: number = 0;
  public set: any = {
    offset: 0, endOfList: false, loadingInProgress: false
  };
  public user = AppSetting.defaultUser;
  @ViewChild(NotificationComponent) public NotificationComponent: NotificationComponent;
  private socket;

  public constructor(public appState: AppState, private mainService: MainService,
                     private localStorageService: LocalStorageService,
                     private router: Router,
                     private location: Location,
                     private profileService: ProfileService) {
  }

  public ngOnInit() {
    let user = this.localStorageService.get('user') as User;
    if (user) {
      this.user = user;
    }
    this.appState.set('notificationPage', this.notificationPage);
    AppSetting.NEIGHBOURHOODS.forEach((item, index) => {
      this.mapOptions.push({id: index + 1, name: item});
    });
    let paramsUrl = this.location.path().split('/');
    if (paramsUrl[1] === 'discover' && paramsUrl[2]) {
      this.selectedMapOption = {id: 0, name: paramsUrl[2].replace('%2B', ' ').replace('%20', ' ')};
    } else {
      this.selectedMapOption = this.mapOptions[0];
    }
    // Socket Notification
    let notificationPage = this.appState.state.notificationPage;
    if (notificationPage !== undefined) {
      this.notificationPage = notificationPage;
    }

    if (!this.user.isAnonymous) {

      this.socket = io(AppSetting.NODE_SERVER);
      this.socket.on('notification', (data) => {
        if (data.uid.indexOf(this.user.id)) {
          this.notifications = data.notifications;
        }
      });

      this.getNotifications();
    }
    this.profileService.getEmittedValue().subscribe(
      (data) => {
        this.user.name = data.name;
        this.user.firstName = data.firstName;
        this.user.lastName = data.lastName;
        this.localStorageService.set('user', this.user);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  public onSelectMapOption(option: any): void {
    this.selectedMapOption = option;
    this.router.navigate(['/discover/' + option.name.replace(' ', '+')]).then();
  }

  public mobile_searchState() {
    this.onSearch = !this.onSearch;
  }

  public mobile_createState() {
    this.onSearch = false;
  }

  public getNotifications() {
    this.mainService.getNotifications(this.notificationPage).then((resp) => {
      this.notifications = resp.data;
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
      this.router.navigate([item.link]).then();
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
