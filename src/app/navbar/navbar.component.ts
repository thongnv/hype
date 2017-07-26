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
import {AppGlobals} from "../services/app.global";

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
                     private profileService: ProfileService,private appGlobal:AppGlobals) {
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
    if (paramsUrl[1] === 'discover') {
      switch (paramsUrl[2]){
        case 'eat':
          console.log('paramsUrl',paramsUrl.length);
          if(paramsUrl.length == 4){
            this.appGlobal.isLocationAddress.subscribe((res)=>{
              if(res !='Singapore') {
                this.selectedMapOption = {id: 0 , name: res};
              }else{
                this.selectedMapOption = {id: 0, name: paramsUrl[3].replace('%2B', ' ').replace('%20', ' ')};
              }
            });
          }else{
            this.selectedMapOption = this.mapOptions[0];
          }
          break;
        case 'play':
          if(paramsUrl.length == 4 ){
            this.appGlobal.isLocationAddress.subscribe((res)=>{
              if(res !='Singapore') {
                this.selectedMapOption = {id: 0 , name: res};
              }else{
                this.selectedMapOption = {id: 0, name: paramsUrl[3].replace('%2B', ' ').replace('%20', ' ')};
              }
            });
          }else{
            this.selectedMapOption = this.mapOptions[0];
          }
          break;
        default:
          this.appGlobal.isLocationAddress.subscribe((res)=>{
            if(res !='Singapore') {
              this.selectedMapOption = {id: 0 , name: res};
            }else{
              this.selectedMapOption = {id: 0, name: paramsUrl[2].replace('%2B', ' ').replace('%20', ' ')};
            }
          });
          break
      }
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
    this.appGlobal.setLocationAddress(option.name);
    let paramsUrl = this.location.path().split('/');
    if (paramsUrl[1] === 'discover') {
      switch (paramsUrl[2]){
        case 'eat':
          this.router.navigate (['/discover/eat/' + option.name.replace (' ' , '+')]).then ();
          break;
        case 'play':
          this.router.navigate (['/discover/play/' + option.name.replace (' ' , '+')]).then ();
          break;
        default:
          this.router.navigate (['/discover/' + option.name.replace (' ' , '+')]).then ();
          break;
      }
    }else {
      this.router.navigate (['/discover/' + option.name.replace (' ' , '+')]).then ();
    }
  }

  public mobile_searchState() {
    this.onSearch = !this.onSearch;
  }

  public mobile_createState() {
    this.onSearch = false;
  }

  public getNotifications() {
    this.mainService.getNotifications(this.notificationPage).subscribe((resp) => {
      this.notifications = resp.data;
    });
  }

  public onMarkAllRead() {
    this.notifications.results.forEach((notif) => {
      notif.viewed = 'true';
    });
    this.notifications.unread = 0;
    if(this.notifications.unread > 0){
      this.set.loadingInProgress =true;
    }
    this.mainService.updateNotifications('all', null).subscribe((resp) => {
      console.log('resp', resp);
      this.set.loadingInProgress =false;
    });
  }

  public onMarkOneRead(item) {
    item.viewed = true;
    if (parseInt(this.notifications.unread, 10) > 0) {
      this.notifications.unread = this.notifications.unread - 1;
    } else {
      this.notifications.unread = 0;
    }
    this.mainService.updateNotifications('any', item.mid).subscribe((resp) => {

      this.router.navigate([item.link,{notification:item.code}]).then();
    });
  }

  public onScrollToBottom() {
    if (!this.set.loadingInProgress) {
      this.set.endOfList = false;
      this.set.loadingInProgress = true;
      let count = 0;
      this.mainService.getNotifications(++this.notificationPage).subscribe((response) => {
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
