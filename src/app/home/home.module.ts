import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NouisliderModule } from 'ng2-nouislider';
import { AgmCoreModule, GoogleMapsAPIWrapper } from 'angular2-google-maps/core';
import { MomentModule } from 'angular2-moment';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { NgbPopoverConfig } from '@ng-bootstrap/ng-bootstrap';
import { Daterangepicker } from 'ng2-daterangepicker';

import {HelperModule} from '../helper/helper.module';
import { HtmlToTextModule } from '../html-to-text/html-to-text.module';
import { HomeRoutingModule } from './home-routing.module';

import { HomeComponent } from './home.component';

@NgModule({
  imports: [
    CommonModule,

    NouisliderModule,
    MomentModule,
    NgbModule,
    Daterangepicker,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAkysiDbFxbIPSuVN4XM4R2YpbGUNzk0CY',
      libraries: ['places', 'geometry']
    }),

    HelperModule,
    HtmlToTextModule,
    HomeRoutingModule
  ],
  declarations: [
    HomeComponent
  ],
  providers: [
    GoogleMapsAPIWrapper,
    NgbPopoverConfig,
  ],
})
export class HomeModule { }
