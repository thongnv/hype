import { Component, ViewEncapsulation, ElementRef, ViewChild, AfterContentInit, NgZone, OnInit } from '@angular/core';

import { LocalStorageService } from 'angular-2-local-storage';
import { UserService } from './services/user.service';
import { WindowUtilService } from './services/window-ultil.service';
import { User } from './app.interface';
import { AppGlobals } from './services/app.global';
import { ActivatedRoute, Router } from '@angular/router';
import { AppSetting } from './app.setting';

@Component({
  selector: 'app',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    './app.component.css'
  ],
  templateUrl: 'app.component.html'
})

export class AppComponent implements OnInit, AfterContentInit {
  public _window: Window;

  @ViewChild('rootContainer')
  public appElementView: ElementRef;

  public user: User;
  public discoverEatActive: boolean;
  public discoverPlayActive: boolean;
  public eventActive: boolean;
  public guidesActive: boolean;

  constructor(private localStorageService: LocalStorageService,
              private userService: UserService,
              zone: NgZone,
              private appGlobal: AppGlobals,
              private windowRef: WindowUtilService) {
    window.addEventListener('resize', (event) => {
      zone.run(() => {
        this.windowRef.rootContainer.innerWidth = window.innerWidth;
        this.windowRef.rootContainer.width = this.appElementView.nativeElement.offsetWidth;
        this.windowRef.rootContainer.height = this.appElementView.nativeElement.offsetHeight;
      });
      this._window = this.windowRef.nativeWindow;
    });
  }

  public ngOnInit() {
    let user = this.localStorageService.get('user') as User;
    if (user) {
      this.user = user;
    }
    this.userService.getEmittedUser().subscribe(
      (data) => this.user = data
    );
    this.setActivePath();
    this.userService.getCsrfToken().subscribe(
      (resp) => {
        this.localStorageService.set('csrf_token', resp._body);
      }
    );

  }

  public ngAfterContentInit() {
    // update global root container info
    this.windowRef.rootContainer.width = this.appElementView.nativeElement.offsetWidth;
    this.windowRef.rootContainer.height = this.appElementView.nativeElement.offsetHeight;
  }

  private setActivePath() {
    this.appGlobal.getEmittedActiveType().subscribe(
      (data) => {
        this.discoverEatActive = data === 'eat';
        this.discoverPlayActive = data === 'play';
        this.eventActive = data === 'event';
        this.guidesActive = data === 'guides';
      }
    );
  }

}
