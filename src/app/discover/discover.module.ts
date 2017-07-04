import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NouisliderModule } from 'ng2-nouislider';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AgmCoreModule, GoogleMapsAPIWrapper } from 'angular2-google-maps/core';

import { HtmlToTextModule } from '../html-to-text/html-to-text.module';
import {HelperModule} from '../helper/helper.module';
import { DiscoverRoutingModule } from './discover-routing.module';

import { ModeComponent } from './mode-play/mode.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    NouisliderModule,
    NgbModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAkysiDbFxbIPSuVN4XM4R2YpbGUNzk0CY',
      libraries: ['places', 'geometry']
    }),

    HtmlToTextModule,
    HelperModule,
    DiscoverRoutingModule
  ],
  declarations: [
    ModeComponent
  ],
  providers: [
    GoogleMapsAPIWrapper
  ],
  // schemas: [NO_ERRORS_SCHEMA]
})
export class DiscoverModule { }
