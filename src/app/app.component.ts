import {
  Component,
  ViewEncapsulation
} from '@angular/core';

import { LocalStorageService } from 'angular-2-local-storage';

import { SeoService } from './services/seo.service';

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
              private seoService: SeoService) {
    // set meta data for seo
    this.seoService.setSEOMetaTags(
      'Hylo - Discover things to do in Singapore today', 'Hylo corp',
      'hylo, food, hylo food, promote events', 'Description'
    );
  }

}
