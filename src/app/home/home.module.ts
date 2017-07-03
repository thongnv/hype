import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NouisliderModule } from 'ng2-nouislider';
import { AgmCoreModule, GoogleMapsAPIWrapper } from 'angular2-google-maps/core';

import {HelperModule} from '../helper/helper.module';
import { HomeRoutingModule } from './home-routing.module';

import { HomeComponent } from './home.component';

@NgModule({
  imports: [
    CommonModule,

    NouisliderModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAkysiDbFxbIPSuVN4XM4R2YpbGUNzk0CY',
      libraries: ['places', 'geometry']
    }),

    HelperModule,
    HomeRoutingModule
  ],
  declarations: [
    HomeComponent
  ],
  providers: [
    GoogleMapsAPIWrapper
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class HomeModule { }
