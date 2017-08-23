import { Component, ViewEncapsulation, ElementRef, ViewChild, AfterContentInit, NgZone, OnInit } from '@angular/core';

import { LocalStorageService } from 'angular-2-local-storage';

import { SeoService } from './services/seo.service';
import { UserService } from './services/user.service';
import { WindowUtilService } from './services/window-ultil.service';
import { User } from './app.interface';
import {EventEmitterService} from './services/event-emitter.service';

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
  sub: any;

  constructor(private localStorageService: LocalStorageService,
              private seoService: SeoService,
              private userService: UserService,
              zone: NgZone,
              private windowRef: WindowUtilService,
              private _eventEmitter: EventEmitterService) {
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
    // DEBUG
    this.sub = this._eventEmitter.dataStream.subscribe(data => console.log('get data: ', data));

    let user = this.localStorageService.get('user') as User;
    if (user) {
      this.user = user;
    }
    this.userService.getEmittedUser().subscribe(
      (data) => this.user = data
    );

    if (!this.localStorageService.get('csrf_token')) {
      this.userService.getCsrfToken().subscribe(
        (resp) => {
          this.localStorageService.set('csrf_token', resp._body);
        }
      );
    }

  }

  public ngAfterContentInit() {
    // update global root container info
    this.windowRef.rootContainer.width = this.appElementView.nativeElement.offsetWidth;
    this.windowRef.rootContainer.height = this.appElementView.nativeElement.offsetHeight;
  }

}
