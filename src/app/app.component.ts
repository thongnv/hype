import { Component, ViewEncapsulation, ElementRef, ViewChild, AfterContentInit } from '@angular/core';

import { LocalStorageService } from 'angular-2-local-storage';

import { SeoService } from './services/seo.service';
import { UserService } from './services/user.service';
import { WindowUtilService } from './services/window-ultil.service';

@Component({
  selector: 'app',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    './app.component.css'
  ],
  templateUrl: 'app.component.html'
})

export class AppComponent implements AfterContentInit {
  public _window: Window;

  @ViewChild('rootContainer') appElementView: ElementRef;

  public user = this.localStorageService.get('user');

  constructor(private localStorageService: LocalStorageService,
              private seoService: SeoService,
              private userService: UserService,
              private windowRef: WindowUtilService, private el: ElementRef) {

    this._window = this.windowRef.nativeWindow;
    console.log('root1: ', this.el.nativeElement.offsetWidth);
    console.log('root: ', this._window.innerWidth);

    // set meta data for seo
    this.seoService.setSEOMetaTags(
      'Hylo - Discover things to do in Singapore today', 'Hylo corp',
      'hylo, food, hylo food, promote events', 'Description'
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
    console.log('root Width: ', this.appElementView.nativeElement.offsetWidth);

    // update global root container info
    this.windowRef.rootContainer.width = this.appElementView.nativeElement.offsetWidth;
    this.windowRef.rootContainer.height = this.appElementView.nativeElement.offsetHeight;
  }

}
