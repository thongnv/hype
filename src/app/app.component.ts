import {
  Component,
  ViewEncapsulation
} from '@angular/core';

import { LocalStorageService } from 'angular-2-local-storage';

import { SeoService } from './services/seo.service';
import { MainService } from './services/main.service';

@Component({
  selector: 'app',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    './app.component.css'
  ],
  templateUrl: 'app.component.html'
})

export class AppComponent {

  public user = this.localStorageService.get('user');

  constructor(private localStorageService: LocalStorageService,
              private seoService: SeoService,
              private mainService: MainService) {
    // set meta data for seo
    this.seoService.setSEOMetaTags(
      'Hylo - Discover things to do in Singapore today', 'Hylo corp',
      'hylo, food, hylo food, promote events', 'Description'
    );
    if (!this.localStorageService.get('csrf_token')) {
      this.mainService.getCsrfToken().subscribe(
        (resp) => {
          this.localStorageService.set('csrf_token', resp._body);
        }
      );
    }
  }

}
